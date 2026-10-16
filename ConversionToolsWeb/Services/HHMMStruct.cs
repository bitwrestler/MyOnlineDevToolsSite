namespace ConversionToolsWeb.Services;

public record HHMMStruct(int hours, int minutes)
{
    public double TotalHours => hours + minutes * 60;
}
