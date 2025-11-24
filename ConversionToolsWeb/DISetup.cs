namespace ConversionToolsWeb
{
    public static class DISetup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<Services.IDateTimeConversionService, Services.DateTimeConversionService>();
            services.AddSingleton<Services.IDateTimeParserService, Services.DateTimeParserService>();
            services.AddSingleton<Services.ITimeZoneInfoResolver, Services.TimeZoneInfoResolver>();
        }
    }
}