namespace ConversionToolsWeb.Models
{
    public class DateTimeConversionResponse : BaseConversionResponse
    {
        public DateTime DateTime {get;set;}
        public required string TimeZoneId { get; set; }
    }
}
