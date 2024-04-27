using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BusLineController : ControllerBase
    {
        private readonly BusLineService _busLineService;

        public BusLineController(BusLineService busLineService)
        {
            _busLineService = busLineService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBusLines()
        {
            try
            {
                var busLines = await _busLineService.GetBusLinesAsync();
                return Ok(busLines);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Handle exceptions more gracefully in a real application
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBusLine(int id)
        {
            try
            {
                var busLine = await _busLineService.GetBusLineAsync(id);
                if (busLine == null)
                {
                    return NotFound();
                }
                return Ok(busLine);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Handle exceptions more gracefully in a real application
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddBusLine([FromBody] BusLineDTO busLineDTO)
        {
            try
            {
                var busLine = await _busLineService.AddBusLineAsync(busLineDTO);
                return CreatedAtAction(nameof(GetBusLine), new { id = busLine.Id }, busLine);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusLine(int id, [FromBody] BusLineDTO busLineDTO)
        {
            try
            {
                await _busLineService.UpdateBusLineAsync(id, busLineDTO);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusLine(int id)
        {
            try
            {
                await _busLineService.DeleteBusLineAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
