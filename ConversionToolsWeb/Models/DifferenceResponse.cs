namespace ConversionToolsWeb.Models;

public class DifferenceResponse(TimeSpan difference)
{
    public double Days { get; init; } = difference.TotalDays;
    public double Hours { get; init; } = difference.TotalHours;
    public double Minutes { get; init; } = difference.TotalMinutes;
    public double Seconds { get; init; } = difference.TotalSeconds;
    public long Ticks { get; init; } = difference.Ticks;
}