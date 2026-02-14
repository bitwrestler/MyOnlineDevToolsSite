using ConversionToolsWeb.Models;
using Microsoft.AspNetCore.Mvc;

namespace ConversionToolsWeb.Controllers.API
{
    [Route("api/utility")]
    public class UtilityController : Controller
    {
        [Route("remoteip")]
        [HttpGet]
        [HttpPost]
        public IActionResult GetMyIP()
        {
            var connection = Request.HttpContext.Connection;
            var remoteIpAddress = connection.RemoteIpAddress;
            if (remoteIpAddress is null)
            {
                return new BadRequestObjectResult("Remote IP address is not available.");
            }
            var clientIp = remoteIpAddress.ToString();
            var result = new RemoteIpResponse() { IpAddress = clientIp  };
            return Ok(result);
        }
    }
}
