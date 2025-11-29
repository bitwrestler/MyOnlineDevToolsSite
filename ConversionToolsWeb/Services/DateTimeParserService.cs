namespace ConversionToolsWeb.Services
{
    public class DateTimeParserService : IDateTimeParserService
    {
        public DateTime ParseDateTime(string? dateTimeString)
        {
            if (string.IsNullOrWhiteSpace(dateTimeString))
            {
                throw new ArgumentException("DateTime string cannot be null or empty.", nameof(dateTimeString));
            }
            return DateTime.Parse(dateTimeString);
        }

        public TimeSpan ParseTimeSpan(string? timeSpanString)
        {
            if (string.IsNullOrWhiteSpace(timeSpanString))
            {
                throw new ArgumentException("TimeSpan string cannot be null or empty.", nameof(timeSpanString));
            }

            var parts = timeSpanString.Split(':');
            if (parts.Length > 4 || parts.Length == 0)
            {
                throw new FormatException("TimeSpan string must be in the format 'dd:hh:mm:ss' where all elements except seconds are optional.");
            }
            if(parts.Any(part => !int.TryParse(part, out _)))
            {
                throw new FormatException("TimeSpan string contains invalid numeric values.");
            }
            var numericParts = parts.Select(part => int.Parse(part)).ToArray();

            int days = 0, hours = 0, minutes = 0, seconds = 0;
            switch (numericParts.Length)
            {
                case 4:
                    days = numericParts[0];
                    hours = numericParts[1];
                    minutes = numericParts[2];
                    seconds = numericParts[3];
                    break;
                case 3:
                    hours = numericParts[0];
                    minutes = numericParts[1];
                    seconds = numericParts[2];
                    break;
                case 2:
                    minutes = numericParts[0];
                    seconds = numericParts[1];
                    break;
                case 1:
                    seconds = numericParts[0];
                    break;
                default:
                    throw new FormatException("Invalid TimeSpan parts count.");
            }
            return new TimeSpan(days, hours, minutes, seconds);
        }
    }
}
