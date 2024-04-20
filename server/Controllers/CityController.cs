using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using server.Entities;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {
        private readonly List<City> _cities = new List<City>();

        // GET: api/Cities
        [HttpGet]
        public IEnumerable<City> GetCities()
        {
            return _cities;
        }

        // GET: api/Cities/5
        [HttpGet("{id}")]
        public ActionResult<City> GetCity(int id)
        {
            var city = _cities.Find(c => c.Id == id);
            if (city == null)
            {
                return NotFound();
            }
            return city;
        }

        // POST: api/Cities
        [HttpPost]
        public ActionResult<City> AddCity(City city)
        {
            _cities.Add(city);
            return CreatedAtAction(nameof(GetCity), new { id = city.Id }, city);
        }

        // PUT: api/Cities/5
        [HttpPut("{id}")]
        public IActionResult UpdateCity(int id, City city)
        {
            var existingCity = _cities.Find(c => c.Id == id);
            if (existingCity == null)
            {
                return NotFound();
            }
            existingCity.Name = city.Name;
            return NoContent();
        }

        // DELETE: api/Cities/5
        [HttpDelete("{id}")]
        public IActionResult DeleteCity(int id)
        {
            var city = _cities.Find(c => c.Id == id);
            if (city == null)
            {
                return NotFound();
            }
            _cities.Remove(city);
            return NoContent();
        }
    }
}
