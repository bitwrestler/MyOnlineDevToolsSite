
namespace ConversionToolsWeb.Services
{
    public interface IDateTimeConversionService
    {
        DateTime FromTicks(long ticks, string timeZoneId);
        long ToTicks(DateTimeWithTimezone dateTimeWithTimeZone);
        long ToTicks(string dateTime, string timeZoneId);
        DateTime GetNow(TimeZoneInfo timeZone);

        long ToEpochSeconds(string dateTime, string timeZoneId);
        long ToEpochSeconds(DateTimeWithTimezone dateTimeWithTimeZone);
        DateTime FromEpochSeconds(long epochSeconds, string timeZoneId);

        long TimeSpanToTicks(string? timeSpanString);
        TimeSpan TicksToTimeSpan(long ticks);
        TimeSpan TicksDifference(long ticks1, long ticks2);
        long TicksGreater(long ticks1, long ticks2);
        TimeSpan DateTimeDifference(DateTimeWithTimezone dt1, DateTimeWithTimezone dt2);
    }
}