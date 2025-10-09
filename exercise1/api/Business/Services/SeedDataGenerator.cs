using StargateAPI.Business.Data;
using System.Text.Json;

namespace StargateAPI.Business.Services
{
    public class SeedDataGenerator
    {
        private readonly Random _random = new Random();
        
        // Realistic astronaut names
        private readonly string[] _firstNames = {
            "Sarah", "Marcus", "Elena", "David", "Priya", "James", "Maria", "Chen", "Alex", "Nina",
            "Michael", "Sofia", "Robert", "Aisha", "John", "Luna", "Carlos", "Zara", "Emma", "Kai",
            "Olivia", "Ravi", "Isabella", "Hassan", "Liam", "Yuki", "Noah", "Amara", "Ava", "Diego",
            "Maya", "Ahmed", "Lucas", "Sakura", "Ethan", "Fatima", "Mason", "Leila", "Logan", "Hiroshi"
        };

        private readonly string[] _lastNames = {
            "Chen", "Rodriguez", "Patel", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore",
            "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez",
            "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez",
            "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson"
        };

        // Military ranks in order
        private readonly string[] _ranks = {
            "Cadet", "Ensign", "Lieutenant Junior Grade", "Lieutenant", "Lieutenant Commander", 
            "Commander", "Captain", "Commodore", "Rear Admiral", "Vice Admiral", "Admiral"
        };

        private readonly string[] _specializations = { "Pilot", "Engineer", "Scientist", "Medical", "Communications", "Navigation" };

        public List<ExternalPersonData> GeneratePersons(int count = 100)
        {
            var persons = new List<ExternalPersonData>();
            
            for (int i = 0; i < count; i++)
            {
                var person = new ExternalPersonData
                {
                    ExternalId = $"EXT-PERSON-{i + 1:D6}",
                    Name = GenerateName(),
                    Rank = GenerateRank(),
                    Mission = GenerateMission(),
                    StartDate = GenerateStartDate(),
                    EndDate = GenerateEndDate(),
                    Status = GenerateStatus(),
                    Metadata = GeneratePersonMetadata(),
                    LastUpdated = DateTime.UtcNow.AddDays(-_random.Next(0, 30))
                };
                
                persons.Add(person);
            }
            
            return persons;
        }

        public List<ExternalDutyData> GenerateDuties(int count = 200)
        {
            var duties = new List<ExternalDutyData>();
            
            for (int i = 0; i < count; i++)
            {
                var duty = new ExternalDutyData
                {
                    ExternalId = $"EXT-DUTY-{i + 1:D6}",
                    PersonExternalId = $"EXT-PERSON-{_random.Next(1, 101):D6}",
                    DutyTitle = GenerateDutyTitle(),
                    Rank = GenerateRank(),
                    StartDate = GenerateStartDate(),
                    EndDate = GenerateEndDate(),
                    Status = GenerateDutyStatus(),
                    Metadata = GenerateDutyMetadata(),
                    LastUpdated = DateTime.UtcNow.AddDays(-_random.Next(0, 30))
                };
                
                duties.Add(duty);
            }
            
            return duties;
        }


        private string GenerateName()
        {
            var firstName = _firstNames[_random.Next(_firstNames.Length)];
            var lastName = _lastNames[_random.Next(_lastNames.Length)];
            return $"{firstName} {lastName}";
        }

        private string GenerateRank()
        {
            return _ranks[_random.Next(_ranks.Length)];
        }

        private string GenerateMission()
        {
            var missions = new[] { "Mars Colony Alpha", "Lunar Base Beta", "Deep Space Gamma", "ISS Life Support", "Satellite Repair", "Zero Gravity Study", "Space Medicine", "Basic Training" };
            var missionName = missions[_random.Next(missions.Length)];
            var suffix = _random.Next(1, 100);
            return $"{missionName}-{suffix}";
        }

        private string GenerateDutyTitle()
        {
            var titles = new[]
            {
                "Mission Commander", "Pilot", "Flight Engineer", "Payload Specialist", "Mission Specialist",
                "Science Officer", "Medical Officer", "Communications Officer", "Navigation Officer",
                "Systems Engineer", "Research Scientist", "Training Instructor", "Safety Officer",
                "Maintenance Technician", "Ground Support", "Mission Control", "Flight Director"
            };
            return titles[_random.Next(titles.Length)];
        }

        private DateTime GenerateStartDate()
        {
            var startDate = DateTime.UtcNow.AddYears(-_random.Next(1, 15));
            return startDate.AddDays(_random.Next(0, 365));
        }

        private DateTime? GenerateEndDate()
        {
            // 70% chance of having an end date
            if (_random.NextDouble() < 0.7)
            {
                var endDate = DateTime.UtcNow.AddDays(-_random.Next(0, 1095)); // Up to 3 years ago
                return endDate;
            }
            return null;
        }

        private string GenerateStatus()
        {
            var statuses = new[] { "ACTIVE", "RETIRED", "PENDING", "COMPLETED" };
            return statuses[_random.Next(statuses.Length)];
        }

        private string GenerateDutyStatus()
        {
            var statuses = new[] { "ACTIVE", "COMPLETED", "CANCELLED" };
            return statuses[_random.Next(statuses.Length)];
        }


        private Dictionary<string, object> GeneratePersonMetadata()
        {
            return new Dictionary<string, object>
            {
                ["experience_years"] = _random.Next(1, 25),
                ["missions_completed"] = _random.Next(0, 15),
                ["specialization"] = _specializations[_random.Next(_specializations.Length)],
                ["performance_rating"] = Math.Round(_random.NextDouble() * 2 + 8, 1), // 8.0 to 10.0
                ["last_medical_check"] = DateTime.UtcNow.AddDays(-_random.Next(0, 365)),
                ["security_clearance"] = _random.Next(1, 5),
                ["language_skills"] = new[] { "English", "Spanish", "French", "Mandarin", "Russian" }.Take(_random.Next(1, 4)).ToArray(),
                ["education_level"] = new[] { "Bachelor", "Master", "PhD", "Military Academy" }[_random.Next(4)],
                ["awards"] = _random.Next(0, 8)
            };
        }

        private Dictionary<string, object> GenerateDutyMetadata()
        {
            return new Dictionary<string, object>
            {
                ["mission_duration_days"] = _random.Next(7, 365),
                ["crew_size"] = _random.Next(2, 8),
                ["mission_success_rate"] = Math.Round(_random.NextDouble() * 0.3 + 0.7, 2), // 70% to 100%
                ["training_hours"] = _random.Next(40, 200),
                ["emergency_procedures"] = _random.Next(0, 5),
                ["equipment_used"] = new[] { "Space Suit", "Navigation System", "Communication Array", "Life Support", "Research Equipment" }.Take(_random.Next(1, 4)).ToArray(),
                ["mission_priority"] = new[] { "Low", "Medium", "High", "Critical" }[_random.Next(4)]
            };
        }

    }
}
