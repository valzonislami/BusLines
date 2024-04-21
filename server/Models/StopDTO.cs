namespace server.Models
{
    public class StopDTO
    {
        public int Id { get; set; }
        public int CityId { get; set; }

        // Navigation properties
        public ICollection<int> BusScheduleIds { get; set; } // For referencing BusScheduleIds associated with this Stop
    }
}