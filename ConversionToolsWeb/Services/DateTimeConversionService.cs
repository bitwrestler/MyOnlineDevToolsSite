using ConversionToolsWeb.Models;

namespace ConversionToolsWeb.Services
{
    public class DateTimeConversionService : IDateTimeConversionService
    {
        private IDateTimeParserService _dateTimeParserService;

        public DateTimeConversionService(IDateTimeParserService dateTimeParserService)
        {
            _dateTimeParserService = dateTimeParserService;
        }

        public long ToTicks(string dateTime, string timeZoneId)
        {
            return ToTicks(_dateTimeParserService.Parse(dateTime), timeZoneId);
        }

        public long ToTicks(DateTime dateTime, string timeZoneId)
        {
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId)).Ticks;
        }

        public DateTime FromTicks(long ticks, string timeZoneId)
        {
            var utcDateTime = new DateTime(ticks);
            return TimeZoneInfo.ConvertTime(utcDateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
        }

        public long ToEpochSeconds(string dateTime, string timeZoneId)
        {
            return ToEpochSeconds(_dateTimeParserService.Parse(dateTime), timeZoneId);
        }

        public long ToEpochSeconds(DateTime dateTime, string timeZoneId)
        {
            var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
            var dtOffset = new DateTimeOffset(utcDateTime);
            return dtOffset.ToUnixTimeSeconds();
        }

        public DateTime FromEpochSeconds(long epochSeconds, string timeZoneId)
        {
            var utcDateTime = DateTimeOffset.FromUnixTimeSeconds(epochSeconds).UtcDateTime;
            return TimeZoneInfo.ConvertTime(utcDateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
        }

        public DateTime GetNow(TimeZoneInfo timeZone)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);
        }
    }
}
