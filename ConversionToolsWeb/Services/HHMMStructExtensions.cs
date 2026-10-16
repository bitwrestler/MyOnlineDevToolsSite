namespace ConversionToolsWeb.Services;

public static class HHMMStructExtensions
{
    public static HHMMStruct Total(this IEnumerable<HHMMStruct> source)
    {
        int hours = 0;
        int minutes = 0;
        foreach (var item in source)
        {
            hours += item.hours;
            minutes += item.minutes;
        }
        hours += minutes / 60;
        minutes %= 60;
        return new HHMMStruct(hours, minutes);
    }
}
