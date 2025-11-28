
namespace ConversionToolsWeb.Services
{
    public interface ITimeZoneInfoResolver
    {
        IEnumerable<string> SupportedTimeZones { get; }
        IEnumerable<TimeZoneInfo> SupportedTimeZoneInfos { get; }
    }
}