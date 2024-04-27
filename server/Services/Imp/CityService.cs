using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;

namespace server.Services.Imp
{
    public class CityService : ICityService
    {
        private readonly BusDbContext _context;

        public CityService(BusDbContext context)
        {
            _context = context;
        }

        public async Task<List<City>> GetCitiesAsync()
        {
            return await _context.Cities.ToListAsync();
        }

        public async Task<City> GetCityByIdAsync(int id)
        {
            return await _context.Cities.FindAsync(id);
        }

        public async Task<City> AddCityAsync(CityDTO cityDTO)
        {
            var existingCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == cityDTO.Name);
            if (existingCity != null)
            {
                throw new ArgumentException("City already exists.");
            }

            var city = new City
            {
                Name = cityDTO.Name
            };

            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
            return city;
        }

        public async Task UpdateCityAsync(int id, CityDTO cityDTO)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                throw new ArgumentException("City not found.");
            }

            if (!string.IsNullOrWhiteSpace(cityDTO.Name))
            {
                city.Name = cityDTO.Name;
            }

            _context.Entry(city).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCityAsync(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                throw new ArgumentException("City not found.");
            }

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();
        }
    }
}