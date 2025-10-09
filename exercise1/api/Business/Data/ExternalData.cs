using System.ComponentModel.DataAnnotations;

namespace StargateAPI.Business.Data
{
    public class ExternalPersonData
    {
        public string ExternalId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Rank { get; set; } = string.Empty;
        public string Mission { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = string.Empty; // "ACTIVE", "RETIRED", "PENDING", "COMPLETED"
        public Dictionary<string, object> Metadata { get; set; } = new Dictionary<string, object>();
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

    public class ExternalDutyData
    {
        public string ExternalId { get; set; } = string.Empty;
        public string PersonExternalId { get; set; } = string.Empty;
        public string DutyTitle { get; set; } = string.Empty;
        public string Rank { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = string.Empty; // "ACTIVE", "COMPLETED", "CANCELLED"
        public Dictionary<string, object> Metadata { get; set; } = new Dictionary<string, object>();
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

}
