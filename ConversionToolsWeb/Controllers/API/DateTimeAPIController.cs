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

        public DateTimeAPIController(IDateTimeConversionService dateTimeConversionService,
            IDateTimeParserService dateTimeParserService, ITimeZoneInfoResolver timeZoneInfoResolver)
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
                new DateTimeWithTimezone(dateTime, dateTimeConversionRequest.TimeZoneId)
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

        [Route("timespan/ticks-difference")]
        [HttpPost]
        public IActionResult GetTicksDifference([FromBody] TicksDifferenceRequest ticksDifferenceRequest)
        {
            var result =
                _dateTimeConversionService.TicksDifference(ticksDifferenceRequest.Ticks1,
                    ticksDifferenceRequest.Ticks2);
            return Ok(new TimeSpanConversionReponse() { DateTime = result, Ticks = result.Ticks });
        }

        [Route("ticks-greater")]
        [HttpPost]
        public IActionResult TicksGreater([FromBody] TicksDifferenceRequest ticksGreaterRequest)
        {
            var result =
                _dateTimeConversionService.TicksGreater(ticksGreaterRequest.Ticks1, ticksGreaterRequest.Ticks2);
            return Ok(result);
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
                new DateTimeWithTimezone(dateTime, dateTimeConversionRequest.TimeZoneId)
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
            return Ok(_timeZoneInfoResolver.SupportedTimeZoneInfos.Select(s => new NowResponse()
                { TimeZoneId = s.Id, DateTime = _dateTimeConversionService.GetNow(s) }));
        }

        [HttpGet]
        [Route("get-difference")]
        public IActionResult GetDifference([FromBody] IEnumerable<DateTimeConversionRequest> dateTimeConversionRequests)
        {
            var l = dateTimeConversionRequests.ToArray();
            if (l.Length < 2)
            {
                return BadRequest("Two dates are required for Date Difference");
            }

            DateTimeWithTimezone r1;
            DateTimeWithTimezone r2;

            try
            {
                r1 = ConvertToDateTimeWithTimeZone(l[0]);
                r2 = ConvertToDateTimeWithTimeZone(l[1]);
            }
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
            var ts = _dateTimeConversionService.DateTimeDifference(r1,r2);
            return Ok(new DifferenceResponse(ts));
        }

        private DateTimeWithTimezone ConvertToDateTimeWithTimeZone(DateTimeConversionRequest request)
        {
            var d = _dateTimeParserService.ParseDateTime(request.DateTime);
            if (string.IsNullOrWhiteSpace(request.TimeZoneId))
            {
                throw new Exception("TimeZoneId is required.");
            }
            return new DateTimeWithTimezone(d, request.TimeZoneId);
        }
    }
}

