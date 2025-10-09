using Dapper;
using MediatR;
using MediatR.Pipeline;
using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Data;
using StargateAPI.Controllers;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace StargateAPI.Business.Commands
{
    public class CreateAstronautDuty : IRequest<CreateAstronautDutyResult>
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Rank is required")]
        [MaxLength(100, ErrorMessage = "Rank cannot exceed 100 characters")]
        public required string Rank { get; set; }

        [Required(ErrorMessage = "DutyTitle is required")]
        [MaxLength(100, ErrorMessage = "DutyTitle cannot exceed 100 characters")]
        public required string DutyTitle { get; set; }

        [Required(ErrorMessage = "DutyStartDate is required")]
        public DateTime DutyStartDate { get; set; }

        public DateTime? DutyEndDate { get; set; }
    }

    public class CreateAstronautDutyPreProcessor : IRequestPreProcessor<CreateAstronautDuty>
    {
        private readonly StargateContext _context;

        public CreateAstronautDutyPreProcessor(StargateContext context)
        {
            _context = context;
        }

        public Task Process(CreateAstronautDuty request, CancellationToken cancellationToken)
        {
            var person = _context.People.AsNoTracking().FirstOrDefault(z => z.Name == request.Name);

            if (person is null) throw new BadHttpRequestException("Person not found");

            // Removed the check that prevented creating duties for people with existing active duties
            // Now we allow this and automatically end the old duty in the handler

            return Task.CompletedTask;
        }
    }

    public class CreateAstronautDutyHandler : IRequestHandler<CreateAstronautDuty, CreateAstronautDutyResult>
    {
        private readonly StargateContext _context;

        public CreateAstronautDutyHandler(StargateContext context)
        {
            _context = context;
        }
        public async Task<CreateAstronautDutyResult> Handle(CreateAstronautDuty request, CancellationToken cancellationToken)
        {
            try
            {


                var query = "SELECT * FROM [Person] WHERE Name = @Name";

            var person = await _context.Connection.QueryFirstOrDefaultAsync<Person>(query, new { Name = request.Name });
            
            if (person == null)
            {
                throw new InvalidOperationException($"Person with name '{request.Name}' not found");
            }

            query = "SELECT * FROM [AstronautDetail] WHERE PersonId = @PersonId";

            var astronautDetail = await _context.Connection.QueryFirstOrDefaultAsync<AstronautDetail>(query, new { PersonId = person.Id });


            query = "SELECT * FROM [AstronautDuty] WHERE PersonId = @PersonId AND DutyEndDate IS NULL ORDER BY DutyStartDate DESC";

            var astronautDuty = await _context.Connection.QueryFirstOrDefaultAsync<AstronautDuty>(query, new { PersonId = person.Id });

            if (astronautDuty != null)
            {
                // For ALL duties (including retirement): previous duty ends one day before new duty starts
                DateTime previousDutyEndDate;
                
                // Check if the start date is valid (not default DateTime)
                if (request.DutyStartDate == default(DateTime))
                {
                    throw new InvalidOperationException("DutyStartDate is required for all duties but was not provided");
                }
                
                previousDutyEndDate = request.DutyStartDate.AddDays(-1).Date;
                
                try
                {
                    // Safety check to ensure the date is valid
                    if (previousDutyEndDate < DateTime.MinValue || previousDutyEndDate > DateTime.MaxValue)
                    {
                        throw new InvalidOperationException($"Calculated end date {previousDutyEndDate} is outside valid DateTime range");
                    }
                    
                    astronautDuty.DutyEndDate = previousDutyEndDate;
                    _context.AstronautDuties.Update(astronautDuty);
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    throw new InvalidOperationException($"Cannot calculate end date for duty. Existing duty start: {astronautDuty.DutyStartDate}, Retirement date: {request.DutyEndDate}, Error: {ex.Message}");
                }
            }

            var newAstronautDuty = new AstronautDuty()
            {
                PersonId = person.Id,
                Rank = request.Rank,
                DutyTitle = request.DutyTitle,
                DutyStartDate = request.DutyStartDate == default(DateTime) ? DateTime.Today : request.DutyStartDate.Date,
                DutyEndDate = request.DutyTitle == "RETIRED" ? null : request.DutyEndDate?.Date  // No end date for retirement
            };

            Console.WriteLine($"Creating new duty - Title: {newAstronautDuty.DutyTitle}, Start: {newAstronautDuty.DutyStartDate}, End: {newAstronautDuty.DutyEndDate}");

            await _context.AstronautDuties.AddAsync(newAstronautDuty);

            if (astronautDetail == null)
            {
                // create AstronautDetail only after AstronautDuty is created
                astronautDetail = new AstronautDetail();
                astronautDetail.PersonId = person.Id;
                astronautDetail.CurrentDutyTitle = request.DutyTitle;
                astronautDetail.CurrentRank = request.Rank;
                
                DateTime careerStartDate = request.DutyStartDate == default(DateTime) ? DateTime.Today : request.DutyStartDate.Date;
                astronautDetail.CareerStartDate = careerStartDate;
                
                if (request.DutyTitle == "RETIRED")
                {
                    // Career end date is one day before the retirement duty start date
                    astronautDetail.CareerEndDate = careerStartDate.AddDays(-1);
                    Console.WriteLine($"New AstronautDetail - Setting career end date to: {astronautDetail.CareerEndDate} (one day before retirement start: {careerStartDate})");
                }

                await _context.AstronautDetails.AddAsync(astronautDetail);
            }
            else
            {
                astronautDetail.CurrentDutyTitle = request.DutyTitle;
                astronautDetail.CurrentRank = request.Rank;
                if (request.DutyTitle == "RETIRED")
                {
                    // Career end date is one day before the retirement duty start date
                    DateTime retirementStartDate = request.DutyStartDate == default(DateTime) ? DateTime.Today : request.DutyStartDate.Date;
                    astronautDetail.CareerEndDate = retirementStartDate.AddDays(-1);
                    Console.WriteLine($"Existing AstronautDetail - Setting career end date to: {astronautDetail.CareerEndDate} (one day before retirement start: {retirementStartDate})");
                }
                _context.AstronautDetails.Update(astronautDetail);
            }

            await _context.SaveChangesAsync();

                return new CreateAstronautDutyResult()
                {
                    Id = newAstronautDuty.Id
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }

    public class CreateAstronautDutyResult : BaseResponse
    {
        public int? Id { get; set; }
    }
}
