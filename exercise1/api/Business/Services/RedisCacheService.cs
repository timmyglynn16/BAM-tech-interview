using StackExchange.Redis;
using StargateAPI.Business.Data;
using System.Text.Json;

namespace StargateAPI.Business.Services
{
    public class RedisCacheService
    {
        private readonly IDatabase _database;
        private readonly IConnectionMultiplexer _redis;

        public RedisCacheService(IConnectionMultiplexer redis)
        {
            _redis = redis;
            _database = redis.GetDatabase();
        }

        // Person data methods
        public async Task StorePersonAsync(ExternalPersonData person)
        {
            var key = $"external:person:{person.ExternalId}";
            var json = JsonSerializer.Serialize(person);
            await _database.StringSetAsync(key, json);
        }

        public async Task<ExternalPersonData?> GetPersonAsync(string externalId)
        {
            var key = $"external:person:{externalId}";
            var json = await _database.StringGetAsync(key);
            
            if (!json.HasValue)
                return null;
                
            return JsonSerializer.Deserialize<ExternalPersonData>(json!);
        }

        public async Task<List<ExternalPersonData>> GetAllPersonsAsync()
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: "external:person:*");
            var persons = new List<ExternalPersonData>();

            foreach (var key in keys)
            {
                var json = await _database.StringGetAsync(key);
                if (json.HasValue)
                {
                    var person = JsonSerializer.Deserialize<ExternalPersonData>(json!);
                    if (person != null)
                        persons.Add(person);
                }
            }

            return persons;
        }

        // Duty data methods
        public async Task StoreDutyAsync(ExternalDutyData duty)
        {
            var key = $"external:duty:{duty.ExternalId}";
            var json = JsonSerializer.Serialize(duty);
            await _database.StringSetAsync(key, json);
        }

        public async Task<ExternalDutyData?> GetDutyAsync(string externalId)
        {
            var key = $"external:duty:{externalId}";
            var json = await _database.StringGetAsync(key);
            
            if (!json.HasValue)
                return null;
                
            return JsonSerializer.Deserialize<ExternalDutyData>(json!);
        }

        public async Task<List<ExternalDutyData>> GetAllDutiesAsync()
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: "external:duty:*");
            var duties = new List<ExternalDutyData>();

            foreach (var key in keys)
            {
                var json = await _database.StringGetAsync(key);
                if (json.HasValue)
                {
                    var duty = JsonSerializer.Deserialize<ExternalDutyData>(json!);
                    if (duty != null)
                        duties.Add(duty);
                }
            }

            return duties;
        }


        // Bulk operations
        public async Task StorePersonsAsync(List<ExternalPersonData> persons)
        {
            var tasks = persons.Select(person => StorePersonAsync(person));
            await Task.WhenAll(tasks);
        }

        public async Task StoreDutiesAsync(List<ExternalDutyData> duties)
        {
            var tasks = duties.Select(duty => StoreDutyAsync(duty));
            await Task.WhenAll(tasks);
        }


        // Cache management
        public async Task ClearAllDataAsync()
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: "external:*");
            await _database.KeyDeleteAsync(keys.ToArray());
        }

        public async Task<long> GetDataCountAsync()
        {
            return await Task.Run(() =>
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var keys = server.Keys(pattern: "external:*");
                return keys.Count();
            });
        }

        public async Task<List<string>> GetDataSummaryAsync()
        {
            return await Task.Run(() =>
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var personKeys = server.Keys(pattern: "external:person:*");
                var dutyKeys = server.Keys(pattern: "external:duty:*");

                return new List<string>
                {
                    $"Persons: {personKeys.Count()}",
                    $"Duties: {dutyKeys.Count()}",
                    $"Total: {personKeys.Count() + dutyKeys.Count()}"
                };
            });
        }
    }
}
