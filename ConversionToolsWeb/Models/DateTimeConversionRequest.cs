namespace ConversionToolsWeb.Models
{
    public class DateTimeConversionRequest
    {
        public string? DateTime { get; set; }
        public string? TimeZoneId { get; set; }
        public long Ticks { get; set; }
    }
}
