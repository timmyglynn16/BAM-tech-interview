﻿﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using StargateAPI.Business.Commands;
using StargateAPI.Business.Queries;
using System.Net;

namespace StargateAPI.Controllers
{
   
    [ApiController]
    [Route("[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly IMediator _mediator;
        public PersonController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetPeople()
        {
            try
            {
                var result = await _mediator.Send(new GetPeople()
                {

                });

                return this.GetResponse(result);
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

        [HttpGet("{name}")]
        public async Task<IActionResult> GetPersonByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = "Name parameter is required",
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.BadRequest
                });
            }
            try
            {
                var result = await _mediator.Send(new GetPersonByName()
                {
                    Name = name
                });

                return this.GetResponse(result);
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

        [HttpPost("")]
        public async Task<IActionResult> CreatePerson([FromBody] CreatePerson request)
        {
            if (request == null)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = "Request body is required",
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.BadRequest
                });
            }
            try
            {
                var result = await _mediator.Send(request);
                return this.GetResponse(result);
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

        [HttpPut("{name}")]
        public async Task<IActionResult> UpdatePerson(string name, [FromBody] UpdatePerson request)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = "Name parameter is required",
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.BadRequest
                });
            }
            if (request == null)
            {
                return this.GetResponse(new BaseResponse()
                {
                    Message = "Request body is required",
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.BadRequest
                });
            }
            
            request.Name = name;
            
            try
            {
                var result = await _mediator.Send(request);
                return this.GetResponse(result);
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