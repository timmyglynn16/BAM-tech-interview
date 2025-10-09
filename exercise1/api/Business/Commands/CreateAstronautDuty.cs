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

            var query = "SELECT * FROM [Person] WHERE Name = @Name";

            var person = await _context.Connection.QueryFirstOrDefaultAsync<Person>(query, new { Name = request.Name });

            query = "SELECT * FROM [AstronautDetail] WHERE PersonId = @PersonId";

            var astronautDetail = await _context.Connection.QueryFirstOrDefaultAsync<AstronautDetail>(query, new { PersonId = person.Id });


            query = "SELECT * FROM [AstronautDuty] WHERE PersonId = @PersonId AND DutyEndDate IS NULL ORDER BY DutyStartDate DESC";

            var astronautDuty = await _context.Connection.QueryFirstOrDefaultAsync<AstronautDuty>(query, new { PersonId = person.Id });

            if (astronautDuty != null)
            {
                // Rule 5: Previous Duty End Date is set to the day before the New Astronaut Duty Start Date
                DateTime newDutyStartDate;
                if (request.DutyTitle == "RETIRED" && request.DutyEndDate.HasValue)
                {
                    // For retirement, the new duty start date is the retirement date
                    newDutyStartDate = request.DutyEndDate.Value.Date;
                }
                else
                {
                    // For regular duties, use the provided start date
                    newDutyStartDate = request.DutyStartDate.Date;
                }
                
                // Rule 5: Set previous duty end date to one day before new duty start date
                DateTime previousDutyEndDate = newDutyStartDate.AddDays(-1).Date;
                
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
                    throw new InvalidOperationException($"Cannot calculate end date for duty. Existing duty start: {astronautDuty.DutyStartDate}, New duty start: {newDutyStartDate}, Error: {ex.Message}");
                }
            }

            var newAstronautDuty = new AstronautDuty()
            {
                PersonId = person.Id,
                Rank = request.Rank,
                DutyTitle = request.DutyTitle,
                DutyStartDate = request.DutyTitle == "RETIRED" && request.DutyEndDate.HasValue 
                    ? request.DutyEndDate.Value.Date 
                    : request.DutyStartDate.Date,
                DutyEndDate = request.DutyEndDate?.Date
            };

            await _context.AstronautDuties.AddAsync(newAstronautDuty);

            if (astronautDetail == null)
            {
                // create AstronautDetail only after AstronautDuty is created
                astronautDetail = new AstronautDetail();
                astronautDetail.PersonId = person.Id;
                astronautDetail.CurrentDutyTitle = request.DutyTitle;
                astronautDetail.CurrentRank = request.Rank;
                astronautDetail.CareerStartDate = request.DutyStartDate.Date;
                if (request.DutyTitle == "RETIRED" && request.DutyEndDate.HasValue)
                {
                    astronautDetail.CareerEndDate = request.DutyEndDate.Value.Date;
                }

                await _context.AstronautDetails.AddAsync(astronautDetail);
            }
            else
            {
                astronautDetail.CurrentDutyTitle = request.DutyTitle;
                astronautDetail.CurrentRank = request.Rank;
                if (request.DutyTitle == "RETIRED" && request.DutyEndDate.HasValue)
                {
                    astronautDetail.CareerEndDate = request.DutyEndDate.Value.Date;
                }
                _context.AstronautDetails.Update(astronautDetail);
            }

            await _context.SaveChangesAsync();

            return new CreateAstronautDutyResult()
            {
                Id = newAstronautDuty.Id
            };
        }
    }

    public class CreateAstronautDutyResult : BaseResponse
    {
        public int? Id { get; set; }
    }
}
