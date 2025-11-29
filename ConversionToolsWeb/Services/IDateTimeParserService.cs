
namespace ConversionToolsWeb.Services
{
    public interface IDateTimeParserService
    {
        DateTime ParseDateTime(string? dateTimeString);
        TimeSpan ParseTimeSpan(string? timeSpanString);
    }
}