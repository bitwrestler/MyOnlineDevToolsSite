using Microsoft.OpenApi;
using System.Runtime.CompilerServices;

namespace ConversionToolsWeb
{
    public static class SwaggerSetup
    {
        private const string Version = "v1";
        private const string Title = "Dev Tools API";
        private const string RelativeEndpoint = "api-docs";
        private const string RelativeEndpointRooted = "/" + RelativeEndpoint;
        private const string SwaggerJsonEndpointName = "swagger.json";

        public static void InitializeSwaggerService(IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(
                o => o.SwaggerDoc(Version, new OpenApiInfo
                {
                    Title = Title,
                    Version = Version
                }
                ));
        }

        public static void InitializeSwaggerMiddleware(WebApplication app)
        {
            app.UseSwagger(o => o.RouteTemplate = RelativeEndpoint + "/{documentName}/" + SwaggerJsonEndpointName); // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwaggerUI(o =>
            {
                o.SwaggerEndpoint($"{RelativeEndpointRooted}/{Version}/{SwaggerJsonEndpointName}", Title);
                o.RoutePrefix = RelativeEndpoint;
                o.DocumentTitle = Title;
            }
            ); // Enable middleware to serve Swagger UI
        }
    }
}
