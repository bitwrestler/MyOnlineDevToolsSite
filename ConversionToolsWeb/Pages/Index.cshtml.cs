using ConversionToolsWeb.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ConversionToolsWeb.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ITimeZoneInfoResolver _timeZoneInfoResolver;
        private readonly ILogger<IndexModel> _logger;


        public IndexModel(ILogger<IndexModel> logger, ITimeZoneInfoResolver timeZoneInfoResolver)
        {
            _logger = logger;
            _timeZoneInfoResolver = timeZoneInfoResolver;
        }

        public IEnumerable<string> SupportedTimeZones => _timeZoneInfoResolver.SupportedTimeZones;
        
    }
}
