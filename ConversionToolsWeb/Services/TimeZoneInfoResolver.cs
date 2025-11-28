using System.Linq;

namespace ConversionToolsWeb.Services
{
    public class TimeZoneInfoResolver : ITimeZoneInfoResolver
    {
        private static readonly string[] _supportedTimeZones = new string[]
        {
            "UTC",
            "Eastern Standard Time",
            "Central Standard Time",
            "Mountain Standard Time",
            "Pacific Standard Time"
        };

        private static readonly TimeZoneInfo[] _supportedTimeZoneInfos = _supportedTimeZones.Select(s=> TimeZoneInfo.FindSystemTimeZoneById(s)).ToArray();

        public IEnumerable<string> SupportedTimeZones => _supportedTimeZones;
        
        public IEnumerable<TimeZoneInfo> SupportedTimeZoneInfos => _supportedTimeZoneInfos;
    }
}
