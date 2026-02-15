using Microsoft.AspNetCore.Mvc;

namespace ConversionToolsWeb.Services
{
    public class MyIPService : IMyIPService
    {
        public string GetMyIP(HttpContext httpContext)
        {
            var connection = httpContext.Connection;
            var remoteIpAddress = connection.RemoteIpAddress;
            if (remoteIpAddress is null)
            {
                throw new Exception("Remote IP Address not available");
            }
            return remoteIpAddress.ToString();
        }
    }
}
