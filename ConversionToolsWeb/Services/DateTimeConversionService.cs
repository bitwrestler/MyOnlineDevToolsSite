namespace ConversionToolsWeb.Services
{
    public class DateTimeConversionService : IDateTimeConversionService
    {
        private readonly IDateTimeParserService _dateTimeParserService;

        public DateTimeConversionService(IDateTimeParserService dateTimeParserService)
        {
            _dateTimeParserService = dateTimeParserService;
        }

        public long ToTicks(string dateTime, string timeZoneId)
        {
            return ToTicks( new DateTimeWithTimezone(_dateTimeParserService.ParseDateTime(dateTime), timeZoneId) );
        }

        public long ToTicks(DateTimeWithTimezone dateTimeWithTimezone)
        {
            return TimeZoneInfo.ConvertTimeToUtc(dateTimeWithTimezone.DateTime, dateTimeWithTimezone.TimeZoneInfo).Ticks;
        }

        public DateTime FromTicks(long ticks, string timeZoneId)
        {
            var utcDateTime = new DateTime(ticks);
            return TimeZoneInfo.ConvertTime(utcDateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
        }

        public long ToEpochSeconds(string dateTime, string timeZoneId)
        {
            return ToEpochSeconds(new DateTimeWithTimezone(_dateTimeParserService.ParseDateTime(dateTime), timeZoneId));
        }

        public long ToEpochSeconds(DateTimeWithTimezone dateTime)
        {
            var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(dateTime.DateTime,dateTime.TimeZoneInfo);
            var dtOffset = new DateTimeOffset(utcDateTime);
            return dtOffset.ToUnixTimeSeconds();
        }

        public DateTime FromEpochSeconds(long epochSeconds, string timeZoneId)
        {
            var utcDateTime = DateTimeOffset.FromUnixTimeSeconds(epochSeconds).UtcDateTime;
            return TimeZoneInfo.ConvertTime(utcDateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
        }

        public long TimeSpanToTicks(string? timeSpanString)
        {
            return _dateTimeParserService.ParseTimeSpan(timeSpanString).Ticks;
        }
        public TimeSpan TicksToTimeSpan(long ticks)
        {
            return new TimeSpan(ticks);
        }

        public DateTime GetNow(TimeZoneInfo timeZone)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);
        }

        public TimeSpan TicksDifference(long ticks1, long ticks2)
        {
            long[] ticks = [ticks1, ticks2];
            ticks = ticks.OrderByDescending(t => t).ToArray();
            return new TimeSpan(ticks[0] - ticks[1]);
        }

        public long TicksGreater(long ticks1, long ticks2)
        {
            if (ticks1 == ticks2)
            {
                return 0;
            } else
            {
                return ticks1 > ticks2 ? ticks1 : ticks2;
            }
        }

        public TimeSpan DateTimeDifference(DateTimeWithTimezone dt1, DateTimeWithTimezone dt2)
        {
            var d = new DateTime[2];
            d[0] = dt1.ToUtc;
            d[1] = dt2.ToUtc;
            d.Sort();
            return d[1] - d[0];
        }
    }
}
