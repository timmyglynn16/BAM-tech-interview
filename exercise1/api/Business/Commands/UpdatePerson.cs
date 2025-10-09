using MediatR;
using MediatR.Pipeline;
using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Data;
using StargateAPI.Controllers;
using System.ComponentModel.DataAnnotations;

namespace StargateAPI.Business.Commands
{
    public class UpdatePerson : IRequest<UpdatePersonResult>
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public required string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "NewName is required")]
        [MaxLength(255, ErrorMessage = "NewName cannot exceed 255 characters")]
        public required string NewName { get; set; } = string.Empty;
    }

    public class UpdatePersonPreProcessor : IRequestPreProcessor<UpdatePerson>
    {
        private readonly StargateContext _context;
        public UpdatePersonPreProcessor(StargateContext context)
        {
            _context = context;
        }
        public Task Process(UpdatePerson request, CancellationToken cancellationToken)
        {
            var person = _context.People.AsNoTracking().FirstOrDefault(z => z.Name == request.Name);

            if (person is null) throw new BadHttpRequestException("Person not found");

            // Check if new name already exists
            var existingPerson = _context.People.AsNoTracking().FirstOrDefault(z => z.Name == request.NewName);
            if (existingPerson is not null) throw new BadHttpRequestException("Person with new name already exists");

            return Task.CompletedTask;
        }
    }

    public class UpdatePersonHandler : IRequestHandler<UpdatePerson, UpdatePersonResult>
    {
        private readonly StargateContext _context;

        public UpdatePersonHandler(StargateContext context)
        {
            _context = context;
        }
        public async Task<UpdatePersonResult> Handle(UpdatePerson request, CancellationToken cancellationToken)
        {
            var person = await _context.People.FirstOrDefaultAsync(p => p.Name == request.Name);

            if (person == null)
            {
                return new UpdatePersonResult()
                {
                    Success = false,
                    Message = $"Person with name '{request.Name}' not found.",
                    ResponseCode = 404
                };
            }

            person.Name = request.NewName;
            _context.People.Update(person);
            await _context.SaveChangesAsync();

            return new UpdatePersonResult()
            {
                Id = person.Id,
                Message = $"Person updated successfully from '{request.Name}' to '{request.NewName}'"
            };
        }
    }

    public class UpdatePersonResult : BaseResponse
    {
        public int Id { get; set; }
    }
}
