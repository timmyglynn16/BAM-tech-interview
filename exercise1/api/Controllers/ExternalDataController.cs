using Microsoft.AspNetCore.Mvc;
using StargateAPI.Business.Data;
using StargateAPI.Business.Services;
using StargateAPI.Controllers;
using System.Net;

namespace StargateAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExternalDataController : ControllerBase
    {
        private readonly RedisCacheService _redisService;
        private readonly SeedDataGenerator _seedGenerator;

        public ExternalDataController(RedisCacheService redisService, SeedDataGenerator seedGenerator)
        {
            _redisService = redisService;
            _seedGenerator = seedGenerator;
        }

        [HttpGet("seed")]
        public async Task<IActionResult> SeedData([FromQuery] int personCount = 100, [FromQuery] int dutyCount = 200)
        {
            try
            {
                // Clear existing data
                await _redisService.ClearAllDataAsync();

                // Generate new seed data
                var persons = _seedGenerator.GeneratePersons(personCount);
                var duties = _seedGenerator.GenerateDuties(dutyCount);

                // Store in Redis
                await _redisService.StorePersonsAsync(persons);
                await _redisService.StoreDutiesAsync(duties);

                var summary = await _redisService.GetDataSummaryAsync();

                return Ok(new
                {
                    success = true,
                    message = "Seed data generated successfully",
                    data = new
                    {
                        personsGenerated = persons.Count,
                        dutiesGenerated = duties.Count,
                        cacheSummary = summary
                    }
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetDataSummary()
        {
            try
            {
                var summary = await _redisService.GetDataSummaryAsync();
                var totalCount = await _redisService.GetDataCountAsync();

                return Ok(new
                {
                    success = true,
                    message = "Data summary retrieved successfully",
                    data = new
                    {
                        summary = summary,
                        totalRecords = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpGet("persons")]
        public async Task<IActionResult> GetAllPersons()
        {
            try
            {
                var persons = await _redisService.GetAllPersonsAsync();

                return Ok(new
                {
                    success = true,
                    message = "Persons retrieved successfully",
                    data = persons
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpGet("duties")]
        public async Task<IActionResult> GetAllDuties()
        {
            try
            {
                var duties = await _redisService.GetAllDutiesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Duties retrieved successfully",
                    data = duties
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }


        [HttpDelete("clear")]
        public async Task<IActionResult> ClearAllData()
        {
            try
            {
                await _redisService.ClearAllDataAsync();

                return Ok(new
                {
                    success = true,
                    message = "All external data cleared successfully"
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpPost("persons")]
        public async Task<IActionResult> AddPerson([FromBody] ExternalPersonData person)
        {
            try
            {
                await _redisService.StorePersonAsync(person);

                return Ok(new
                {
                    success = true,
                    message = "Person added successfully",
                    data = person
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpPost("duties")]
        public async Task<IActionResult> AddDuty([FromBody] ExternalDutyData duty)
        {
            try
            {
                await _redisService.StoreDutyAsync(duty);

                return Ok(new
                {
                    success = true,
                    message = "Duty added successfully",
                    data = duty
                });
            }
            catch (Exception ex)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

    }
}
