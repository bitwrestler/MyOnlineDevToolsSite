using ConversionToolsWeb.Models;
using ConversionToolsWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace ConversionToolsWeb.Controllers.API
{
    [Route("api/datetime")]
    public class DateTimeAPIController : Controller
    {
        private readonly IDateTimeConversionService _dateTimeConversionService;
        private readonly IDateTimeParserService _dateTimeParserService;
        private readonly ITimeZoneInfoResolver _timeZoneInfoResolver;

        public DateTimeAPIController(IDateTimeConversionService dateTimeConversionService, IDateTimeParserService dateTimeParserService, ITimeZoneInfoResolver timeZoneInfoResolver)
        {
            _dateTimeConversionService = dateTimeConversionService;
            _dateTimeParserService = dateTimeParserService;
            _timeZoneInfoResolver = timeZoneInfoResolver;
        }

        [Route("to-ticks")]
        [HttpPost]
        public IActionResult ConvertToTicks([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            if (string.IsNullOrWhiteSpace(dateTimeConversionRequest.TimeZoneId))
            {
                return BadRequest("TimeZoneId is required.");
            }

            var dateTime = _dateTimeParserService.ParseDateTime(dateTimeConversionRequest.DateTime);

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

        [Route("to-unix")]
        [HttpPost]
        public IActionResult ConvertToEpochSeconds([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            if (string.IsNullOrWhiteSpace(dateTimeConversionRequest.TimeZoneId))
            {
                return BadRequest("TimeZoneId is required.");
            }

            var dateTime = _dateTimeParserService.ParseDateTime(dateTimeConversionRequest.DateTime);

            var ticks = _dateTimeConversionService.ToEpochSeconds(
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

        [Route("from-unix")]
        [HttpPost]
        public IActionResult ConvertFromEpochSeconds([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            if (string.IsNullOrWhiteSpace(dateTimeConversionRequest.TimeZoneId))
            {
                return BadRequest("TimeZoneId is required.");
            }
            var dateTime = _dateTimeConversionService.FromEpochSeconds(
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

        [Route("timespan/to-ticks")]
        [HttpPost]
        public IActionResult ConvertTimespanToTicks([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            var ticks = _dateTimeConversionService.TimeSpanToTicks(dateTimeConversionRequest.DateTime);

            return Ok(new TimeSpanConversionReponse
            {
                DateTime = _dateTimeParserService.ParseTimeSpan(dateTimeConversionRequest.DateTime),
                Ticks = ticks
            });
        }

        [Route("timespan/from-ticks")]
        [HttpPost]
        public IActionResult ConvertTicksToTimespan([FromBody] DateTimeConversionRequest dateTimeConversionRequest)
        {
            var timeSpan = _dateTimeConversionService.TicksToTimeSpan(dateTimeConversionRequest.Ticks);
            return Ok(new TimeSpanConversionReponse
            {
                DateTime = timeSpan,
                Ticks = dateTimeConversionRequest.Ticks
            });
        }

        [HttpGet]
        [Route("supported-timezones")]
        public IActionResult GetSupportedTimeZones()
        {
            var supportedTimeZones = _timeZoneInfoResolver.SupportedTimeZones;
            return Ok(supportedTimeZones);
        }

        [HttpGet]
        [Route("now")]
        public IActionResult GetNows()
        {
            return Ok(_timeZoneInfoResolver.SupportedTimeZoneInfos.Select(s => new NowResponse() { TimeZoneId = s.Id , DateTime = _dateTimeConversionService.GetNow(s) } ));
        }
    }
}
