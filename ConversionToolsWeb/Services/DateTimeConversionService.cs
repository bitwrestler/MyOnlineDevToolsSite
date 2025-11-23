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
    }
}
