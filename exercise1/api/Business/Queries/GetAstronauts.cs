using Dapper;
using MediatR;
using StargateAPI.Business.Data;
using StargateAPI.Business.Dtos;
using StargateAPI.Controllers;

namespace StargateAPI.Business.Queries
{
    public class GetAstronauts : IRequest<GetAstronautsResult>
    {

    }

    public class GetAstronautsHandler : IRequestHandler<GetAstronauts, GetAstronautsResult>
    {
        public readonly StargateContext _context;
        public GetAstronautsHandler(StargateContext context)
        {
            _context = context;
        }
        public async Task<GetAstronautsResult> Handle(GetAstronauts request, CancellationToken cancellationToken)
        {
            var result = new GetAstronautsResult();

            // Use INNER JOIN to only get people who have astronaut details (i.e., have been assigned duties)
            var query = $"SELECT a.Id as PersonId, a.Name, b.CurrentRank, b.CurrentDutyTitle, b.CareerStartDate, b.CareerEndDate FROM [Person] a INNER JOIN [AstronautDetail] b on b.PersonId = a.Id";

            var astronauts = await _context.Connection.QueryAsync<PersonAstronaut>(query);

            result.Astronauts = astronauts.ToList();

            return result;
        }
    }

    public class GetAstronautsResult : BaseResponse
    {
        public List<PersonAstronaut> Astronauts { get; set; } = new List<PersonAstronaut> { };

    }
}
