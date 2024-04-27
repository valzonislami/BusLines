using server.DTOs;
using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IBusLineService
    {
        public Task<List<BusLine>> GetBusLinesAsync();
        public Task<BusLine> GetBusLineAsync(int id);
        public Task<BusLine> AddBusLineAsync(BusLineDTO busLineDTO);
        public Task UpdateBusLineAsync(int id, BusLineDTO busLineDTO);
        public Task DeleteBusLineAsync(int id);
    }
}