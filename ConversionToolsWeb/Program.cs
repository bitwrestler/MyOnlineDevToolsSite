using Microsoft.OpenApi;

namespace ConversionToolsWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Add services to the container.
            builder.Services.AddRazorPages();

            SwaggerSetup.InitializeSwaggerService(builder.Services);
            DISetup.ConfigureServices(builder.Services);

            var app = builder.Build();

            SwaggerSetup.InitializeSwaggerMiddleware(app);

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
            }
            app.UseStaticFiles();
            app.Use(async (ctx, next) =>
            {
                var prefix = ctx.Request.Headers["X-Forwarded-Prefix"].FirstOrDefault();
                if (!string.IsNullOrEmpty(prefix)) ctx.Request.PathBase = prefix;
                await next();
            });
            app.UseRouting();
            app.MapRazorPages();
            app.MapControllers();

            app.Run();
        }
    }
}
