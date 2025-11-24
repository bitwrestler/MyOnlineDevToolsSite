namespace ConversionToolsWeb.Services
{
    public class TimeZoneInfoResolver : ITimeZoneInfoResolver
    {
        public IEnumerable<string> SupportedTimeZones => new HashSet<string>()
        {
            "UTC",
            "Eastern Standard Time",
            "Central Standard Time",
            "Mountain Standard Time",
            "Pacific Standard Time",
            "Hawaii-Aleutian Standard Time"
        };
    }
}
