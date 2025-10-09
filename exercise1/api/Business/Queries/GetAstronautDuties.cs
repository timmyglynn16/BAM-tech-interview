using Dapper;
using MediatR;
using StargateAPI.Business.Data;
using StargateAPI.Controllers;

namespace StargateAPI.Business.Queries
{
    public class GetAstronautDuties : IRequest<GetAstronautDutiesResult>
    {
    }

    public class GetAstronautDutiesHandler : IRequestHandler<GetAstronautDuties, GetAstronautDutiesResult>
    {
        public readonly StargateContext _context;
        public GetAstronautDutiesHandler(StargateContext context)
        {
            _context = context;
        }

        public async Task<GetAstronautDutiesResult> Handle(GetAstronautDuties request, CancellationToken cancellationToken)
        {
            var result = new GetAstronautDutiesResult();

            var query = "SELECT ad.Id, ad.PersonId, ad.Rank, ad.DutyTitle, ad.DutyStartDate, ad.DutyEndDate, p.Name as PersonName FROM [AstronautDuty] ad INNER JOIN [Person] p ON ad.PersonId = p.Id ORDER BY ad.DutyStartDate DESC";

            var duties = await _context.Connection.QueryAsync<AstronautDutyWithPerson>(query);

            result.AstronautDuties = duties.ToList();

            return result;
        }
    }

    public class GetAstronautDutiesResult : BaseResponse
    {
        public List<AstronautDutyWithPerson> AstronautDuties { get; set; } = new List<AstronautDutyWithPerson>();
    }

    public class AstronautDutyWithPerson
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string Rank { get; set; } = string.Empty;
        public string DutyTitle { get; set; } = string.Empty;
        public DateTime DutyStartDate { get; set; }
        public DateTime? DutyEndDate { get; set; }
        public string PersonName { get; set; } = string.Empty;
    }
}