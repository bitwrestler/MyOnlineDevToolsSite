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

            // Register Swagger services
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            DISetup.ConfigureServices(builder.Services);


            var app = builder.Build();

            app.UseSwagger(); // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwaggerUI(); // Enable middleware to serve Swagger UI

            //app.UseSwaggerUI(options =>
            //{
            //    options.SwaggerEndpoint("/api/swagger/v1/swagger.json", "API V1");
            //    options.RoutePrefix = "api/swagger";
            //}
            //); // Enable middleware to serve Swagger UI


            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
            }
            app.UseStaticFiles();
            app.UseRouting();
            app.MapRazorPages();
            app.MapControllers();

            app.Run();
        }
    }
}
