using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class BusSchedules
    {
        public int Id { get; set; }

        // Foreign key for BusLineId
        public int BusLineId { get; set; }
        [ForeignKey("BusLineId")]
        public BusLine BusLine { get; set; }

        // Foreign key for OperatorId
        public int OperatorId { get; set; }
        [ForeignKey("OperatorId")]
        public Operator Operator { get; set; }
        public DateTime Departure { get; set; }
        public DateTime Arrival { get; set; }
        public double Price { get; set; }

    }
}
