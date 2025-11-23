namespace ConversionToolsWeb.Services
{
    public class DateTimeParserService : IDateTimeParserService
    {
        public DateTime Parse(string? dateTimeString)
        {
            if (string.IsNullOrWhiteSpace(dateTimeString))
            {
                throw new ArgumentException("DateTime string cannot be null or empty.", nameof(dateTimeString));
            }
            return DateTime.Parse(dateTimeString);
        }
    }
}
