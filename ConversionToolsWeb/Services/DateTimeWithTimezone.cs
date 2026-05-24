namespace ConversionToolsWeb.Services;

public record DateTimeWithTimezone(DateTime DateTime, string TimeZone)
{
    public TimeZoneInfo TimeZoneInfo => TimeZoneInfo.FindSystemTimeZoneById(TimeZone);
    public DateTime ToUtc => TimeZoneInfo.ConvertTimeToUtc(DateTime, TimeZoneInfo);
}