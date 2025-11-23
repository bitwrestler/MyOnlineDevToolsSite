namespace ConversionToolsWeb.Models
{
    public class DateTimeConversionResponse
    {
        public DateTime DateTime {get;set;}
        public required string TimeZoneId { get; set; }
        public long Ticks { get; set; }
    }
}
