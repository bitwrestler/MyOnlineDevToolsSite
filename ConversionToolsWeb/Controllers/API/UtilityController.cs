using ConversionToolsWeb.Models;
using Microsoft.AspNetCore.Mvc;
using ConversionToolsWeb.Services;

namespace ConversionToolsWeb.Controllers.API
{

    [Route("api/utility")]
    public class UtilityController : Controller
    {
        private readonly IMyIPService _myIPService;
        public UtilityController(IMyIPService myIPService)
        {
            _myIPService = myIPService;
        }


        [Route("remoteip")]
        [HttpGet]
        [HttpPost]
        public IActionResult GetMyIP()
        {
            var clientIp = _myIPService.GetMyIP(Request.HttpContext);
            var result = new RemoteIpResponse() { IpAddress = clientIp  };
            return Ok(result);
        }
    }
}
