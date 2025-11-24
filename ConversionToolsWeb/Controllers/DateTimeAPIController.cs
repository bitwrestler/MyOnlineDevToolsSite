using ConversionToolsWeb.Models;
using ConversionToolsWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace ConversionToolsWeb.Controllers
{
    [Route("api")]
    public class DateTimeAPIController : Controller
    {
        private readonly IDateTimeConversionService _dateTimeConversionService;
        private readonly IDateTimeParserService _dateTimeParserService;

        public DateTimeAPIController(IDateTimeConversionService dateTimeConversionService, IDateTimeParserService dateTimeParserService)
        {
            _dateTimeConversionService = dateTimeConversionService;
            _dateTimeParserService = dateTimeParserService;
        }

        [Route("to-ticks")]
        [HttpPost]
        public IActionResult ConvertToTicks([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            if (string.IsNullOrWhiteSpace(dateTimeConversionRequest.TimeZoneId))
            {
                return BadRequest("TimeZoneId is required.");
            }

            var dateTime = _dateTimeParserService.Parse(dateTimeConversionRequest.DateTime);

            var ticks = _dateTimeConversionService.ToTicks(
                dateTime,
                dateTimeConversionRequest.TimeZoneId
                );

            return Ok(new DateTimeConversionResponse
            {
                DateTime = dateTime,
                TimeZoneId = dateTimeConversionRequest.TimeZoneId,
                Ticks = ticks
            });
        }

        [Route("from-ticks")]
        [HttpPost]
        public IActionResult ConvertFromTicks([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            if (string.IsNullOrWhiteSpace(dateTimeConversionRequest.TimeZoneId))
            {
                return BadRequest("TimeZoneId is required.");
            }
            var dateTime = _dateTimeConversionService.FromTicks(
                dateTimeConversionRequest.Ticks,
                dateTimeConversionRequest.TimeZoneId
                );
            return Ok(new DateTimeConversionResponse
            {
                DateTime = dateTime,
                TimeZoneId = dateTimeConversionRequest.TimeZoneId,
                Ticks = dateTimeConversionRequest.Ticks
            });
        }

        [HttpGet]
        [Route("supported-timezones")]
        public IActionResult GetSupportedTimeZones([FromServices] ITimeZoneInfoResolver timeZoneInfoResolver)
        {
            var supportedTimeZones = timeZoneInfoResolver.SupportedTimeZones;
            return Ok(supportedTimeZones);
        }
    }
}
