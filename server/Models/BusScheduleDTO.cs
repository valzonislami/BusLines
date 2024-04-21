using server.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class BusScheduleDTO
    {
        // Foreign key for BusLineId
        public string StartCityName { get; set; }
        public string DestinationCityName { get; set; }

        // Foreign key for OperatorId

        public string OperatorName { get; set; }

        public DateTime Departure { get; set; }

        public DateTime Arrival { get; set; }

        public double Price { get; set; }

        public ICollection<int> StopIds { get; set; } // For referencing StopIds associated with this BusSchedule


    }
}
