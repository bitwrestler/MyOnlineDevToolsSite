
namespace ConversionToolsWeb.Services
{
    public interface ITimeZoneInfoResolver
    {
        IEnumerable<string> SupportedTimeZones { get; }
    }
}