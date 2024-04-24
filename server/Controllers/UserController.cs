using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.DTOs;
using server.Entities;
using server.Models;
using server.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly BusDbContext _context;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;

        public UserController(BusDbContext context, IMapper mapper, JwtService jwtService)
        {
            _context = context;
            _mapper = mapper;
            _jwtService = jwtService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers(
            [FromQuery] string? email = null)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(e => e.Email == email);
            }

            var users = await query.ToListAsync();
            var usersDto = _mapper.Map<List<UserDTO>>(users);
            return Ok(usersDto);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDTO>(user);
            return Ok(userDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return Conflict("User already exists.");
            }

            user.Password = PasswordHasher.HashPassword(user.Password);

            // Set default role if not provided or invalid
            if (!Enum.IsDefined(typeof(UserRole), user.Role))
            {
                user.Role = UserRole.User;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
            if (user == null || !PasswordHasher.VerifyPassword(loginDTO.Password, user.Password))
            {
                return Unauthorized();
            }

            var token = _jwtService.GenerateToken(user);
            return Ok(new { Token = token });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Check if the email is being changed and if it already exists for another user
            if (!string.IsNullOrWhiteSpace(user.Email) && user.Email != existingUser.Email)
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == user.Email);
                if (emailExists)
                {
                    return Conflict("Email already exists for another user.");
                }
            }

            // Update only non-null and non-empty values from the User entity, excluding ID and Role
            existingUser.FirstName = string.IsNullOrWhiteSpace(user.FirstName) ? existingUser.FirstName : user.FirstName;
            existingUser.LastName = string.IsNullOrWhiteSpace(user.LastName) ? existingUser.LastName : user.LastName;
            existingUser.Email = string.IsNullOrWhiteSpace(user.Email) ? existingUser.Email : user.Email;

            // Hash the password if provided
            if (!string.IsNullOrWhiteSpace(user.Password))
            {
                existingUser.Password = PasswordHasher.HashPassword(user.Password);
            }

            // Update user role if provided and valid
            if (Enum.IsDefined(typeof(UserRole), user.Role))
            {
                existingUser.Role = user.Role;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}