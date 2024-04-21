using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OperatorController : ControllerBase
    {
        private readonly BusDbContext _context;

        public OperatorController(BusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetOperators()
        {
            var operators = await _context.Operators.ToListAsync();
            return Ok(operators);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOperator(int id)
        {
            var oper = await _context.Operators.FindAsync(id);
            if (oper == null)
            {
                return NotFound();
            }
            return Ok(oper);
        }

        [HttpPost]
        public async Task<IActionResult> AddOperator([FromBody] OperatorDTO OperatorDTO)
        {
            var existingOperator = await _context.Operators.FirstOrDefaultAsync(c => c.Name == OperatorDTO.Name);
            if (existingOperator != null)
            {
                return Conflict("Operator already exists.");
            }

            var oper = new Operator
            {
                Name = OperatorDTO.Name
            };

            _context.Operators.Add(oper);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOperator), new { id = oper.Id }, oper);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOperator(int id, [FromBody] OperatorDTO operatorDTO)
        {
            var oper = await _context.Operators.FindAsync(id);
            if (oper == null)
            {
                return NotFound();
            }

            // Update only if the Name property in the DTO is not null or empty
            if (!string.IsNullOrWhiteSpace(operatorDTO.Name))
            {
                oper.Name = operatorDTO.Name;
            }

            _context.Entry(oper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OperatorExists(id))
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
        public async Task<IActionResult> DeleteOperator(int id)
        {
            var oper = await _context.Operators.FindAsync(id);
            if (oper == null)
            {
                return NotFound();
            }

            _context.Operators.Remove(oper);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OperatorExists(int id)
        {
            return _context.Operators.Any(e => e.Id == id);
        }
    }

    public class OperatorDTO
    {
        public string Name { get; set; }
    }
}