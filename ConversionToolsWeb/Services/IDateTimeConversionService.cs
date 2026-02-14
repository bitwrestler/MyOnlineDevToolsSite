
namespace ConversionToolsWeb.Services
{
    public interface IDateTimeConversionService
    {
        DateTime FromTicks(long ticks, string timeZoneId);
        long ToTicks(DateTime dateTime, string timeZoneId);
        long ToTicks(string dateTime, string timeZoneId);
        DateTime GetNow(TimeZoneInfo timeZone);

        long ToEpochSeconds(string dateTime, string timeZoneId);
        long ToEpochSeconds(DateTime dateTime, string timeZoneId);
        DateTime FromEpochSeconds(long epochSeconds, string timeZoneId);

        long TimeSpanToTicks(string? timeSpanString);
        TimeSpan TicksToTimeSpan(long ticks);
        TimeSpan TicksDifference(long ticks1, long ticks2);
    }
}