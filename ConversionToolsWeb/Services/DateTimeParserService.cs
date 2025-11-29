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
            if( (parts.Length>1 && parts[..^1].Any(part => !int.TryParse(part, out _))) || ! double.TryParse(parts[^1], out _) )
            {
                throw new FormatException("TimeSpan string contains invalid numeric values.");
            }
            var numericPartsExceptionSeconds = parts.Length > 1 ? parts[..^1].Select(s=>int.Parse(s)).ToArray() : Array.Empty<int>();
            var secondsPart = double.Parse(parts[^1]);

            int days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
            switch (parts.Length)
            {
                case 4:
                    days = numericPartsExceptionSeconds[0];
                    hours = numericPartsExceptionSeconds[1];
                    minutes = numericPartsExceptionSeconds[2];
                    break;
                case 3:
                    hours = numericPartsExceptionSeconds[0];
                    minutes = numericPartsExceptionSeconds[1];
                    break;
                case 2:
                    minutes = numericPartsExceptionSeconds[0];
                    break;
                case 1:
                    break;
                default:
                    throw new FormatException("Invalid TimeSpan parts count.");
            }
            ParseFractionalSeconds(secondsPart, out seconds, out milliseconds);
            return new TimeSpan(days, hours, minutes, seconds, milliseconds);
        }

        private static void ParseFractionalSeconds(double totalSeconds, out int seconds, out int milliseconds)
        {
            seconds = (int)Math.Floor(totalSeconds);
            milliseconds = (int)((totalSeconds - seconds) * 1000);
        }
    }
}
