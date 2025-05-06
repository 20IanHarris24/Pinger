using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using PingApp.BackgroundServices;
using PingApp.DataAndHelpers;
using PingApp.Hubs;
using Serilog;

namespace PingApp
{
    public class Program
    {
        private const string SERVICE_NAME = "Pinger";

        public static async Task Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, eventArgs) => Log.Error("UnhandledException - {EventArgsExceptionObject}", eventArgs.ExceptionObject);

            try
            {
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"));

                WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

                builder.Configuration.AddJsonFile("appsettings.Development.json", optional: false, reloadOnChange: true);
                // builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                builder.Services.AddSignalR();
                builder.Services.AddHostedService<ShipStatusService>();
                builder.Services.AddDbContext<PingAppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DatabaseConnection")));


                Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();

                // builder.WebHost.ConfigureAppConfiguration((context, config) =>
                // {
                //     config.AddConfigs();
                // });

                List<string> urls = new();
                urls.Add("http://*:34011");
                builder.WebHost.UseUrls(urls.ToArray());

                builder.WebHost.ConfigureServices((hostContext, services) =>
                {
                    CustomConfigureServices(hostContext, services);
                });

                builder.Host.UseSerilog((context, loggerConfiguration) =>
                {
                    string environment = context.HostingEnvironment.EnvironmentName;
                    loggerConfiguration = loggerConfiguration
                        // Any settable logging options is controlled using device.config.json .ReadFrom.Configuration(context.Configuration.GetSection("Serilog"))
                        .Enrich.FromLogContext()
                        .Enrich.WithEnvironment(environment)
                        .Enrich.WithProperty("ApplicationName", SERVICE_NAME);

                    loggerConfiguration = loggerConfiguration.WriteTo.Console();
                });

                WebApplication app = builder.Build();
                // app.UseDefaultFiles();
                // app.UseStaticFiles();
                app.UseRouting();
                app.MapHub<DisplayHub>("/display");
                app.MapControllers();

                ConfigureWebApp(app);


                //Scope Seed Database
                using (var scope = app.Services.CreateScope()) //new code
                {
                var seedShips = new AssetSeedData();
                var services = scope.ServiceProvider; //new code
                var dbContext = services.GetRequiredService<PingAppDbContext>(); //new code
                var initShipConfig = services.GetRequiredService<IConfiguration>();
                // await dbContext.Database.EnsureDeletedAsync(); //commented out this line after first run when empty database created) //new code
                // await dbContext.Database.MigrateAsync(); //commented out after the first dataSeed run (when empty database created) //new code



                try
                {
                    await seedShips.InitAsync(dbContext, initShipConfig);  //Seed initial ship information properties
                    // var shipService = services.GetRequiredService<ShipStatusService>();
                    // await shipService.ExecuteAsync(dbContext);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred seeding the DB.");
                }

                }


                app.Run();
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static void CustomConfigureServices(WebHostBuilderContext hostContext, IServiceCollection services)
        {
            services.AddControllers().AddJsonOptions(options => {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            if (hostContext.HostingEnvironment.IsDevelopment())
            {
                services.AddOpenApiDocument(settings =>
                {
                });
            }

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder =>
                    {
                        builder.AllowAnyHeader().AllowAnyMethod().SetIsOriginAllowed(origin => true).AllowCredentials();
                    });
            });
        }

        private static void ConfigureWebApp(WebApplication app)
        {
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseRouting();

            app.UseCors("CorsPolicy");

            if (app.Environment.IsDevelopment())
            {
                app.UseOpenApi();
                app.UseSwaggerUi();
            }

            app.MapDefaultControllerRoute();
        }
    }
}