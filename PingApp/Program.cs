using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PingApp.DataAndHelpers;
using PingApp.Hubs;
using PingApp.Interfaces;
using PingApp.ServicesBackend;
using Serilog;

namespace PingApp
{
    public class Program
    {
        private const string ServiceName = "Pinger";

        public static async Task Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += (_, eventArgs) =>
                Log.Error("UnhandledException - {EventArgsExceptionObject}", eventArgs.ExceptionObject);

            try
            {
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"));

                WebApplicationBuilder builder = WebApplication.CreateBuilder(args);



                //--- Logging ---

                Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();
                builder.Host.UseSerilog((context, lc) =>
                {
                    lc.Enrich.FromLogContext()
                        .Enrich.WithEnvironment(context.HostingEnvironment.EnvironmentName)
                        .Enrich.WithProperty("ApplicationName", ServiceName)
                        .WriteTo.Console();
                });


                // --- URLs / Kestrel bindings ---
                List<string> urls = new();
                urls.Add("http://*:34011");
                builder.WebHost.UseUrls(urls.ToArray());


                var service = builder.Services;
                var config = builder.Configuration;
                var env = builder.Environment;


                // --- DbContext ---
                service.AddDbContext<PingAppDbContext>(options =>
                    options.UseSqlite(config.GetConnectionString("DatabaseConnection")));
                // service.AddDbContext<PingAppDbContext>(options =>
                // options.UseNpgsql(config.GetConnectionString("DatabaseConnection")));


                // --- Background Services ---
                service.AddHostedService<ShipBackgroundPingService>();

                // --- Options & Validation


                service.AddOptions<PaginationSettings>()
                    .Bind(builder.Configuration.GetSection("PaginationSettings"))
                    .ValidateDataAnnotations()
                    .Validate(ps => ps.PageSize <= ps.MaxPageSize,
                        "PageSize must be less than or equal to MaxPagesSize")
                    .ValidateOnStart();



                // --- App Services ___


                service.AddScoped<NotifierService>();
                service.AddScoped<IShipQueryService, ShipQueryService>();
                service.AddScoped<IShipStatusService, ShipStatusService>();
                service.AddSingleton(new ConcurrentDictionary<Guid, string>());



                // ---Controllers and JSON Converters

                service.AddControllers().AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });


                // --- Cors ---
                service.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        policy =>
                        {
                            policy.AllowAnyHeader()
                                .AllowAnyMethod()
                                .SetIsOriginAllowed(_ => true)
                                .AllowCredentials();
                        });
                });


                // --- Signal R ---

                service.AddSignalR();

              
                // --- OpenAPI only in dev

                if (env.IsDevelopment())
                {
                    service.AddOpenApiDocument();
                }

                WebApplication app = builder.Build();

                // --- Middleware / Pipeline

                if (!env.IsDevelopment())
                {
                    app.UseHsts();
                }

                app.UseRouting();
                app.UseCors("CorsPolicy");


                if (env.IsDevelopment())
                {
                    app.UseOpenApi();
                    app.UseSwaggerUi();

                    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                    app.MapGet("/debugpagination", (IOptionsSnapshot<PaginationSettings> opts) =>
                    {
                        var s = opts.Value; // reflects config changes on next request
                        var checkPayload = new
                        {
                            s.Page,
                            s.PageSize,
                            s.MaxPageSize,
                            s.Sort,
                            s.Direction
                        };
                        return Results.Json(checkPayload, new JsonSerializerOptions(JsonSerializerDefaults.Web)
                        {
                            Converters = { new JsonStringEnumConverter() }

                        });
                    });
                }

                app.MapHub<DisplayHub>("/display");
                app.MapControllers();
                app.MapDefaultControllerRoute();


                // --- Scope Seed dB Database ---
                using (var scope = app.Services.CreateScope()) //new code
                {
                    var seedShips = new AssetSeedData();
                    var sp = scope.ServiceProvider; //new code
                    var db = sp.GetRequiredService<PingAppDbContext>(); //new code
                    var initCfg = sp.GetRequiredService<IConfiguration>();
                    //var logging = sp.GetRequiredService<ILogger<Program>>();



                    try
                    {
                        // await dbContext.Database.EnsureDeletedAsync(); //commented out this line after first run when empty database created) //new code
                        // await dbContext.Database.MigrateAsync(); //commented out after the first dataSeed run (when empty database created) //new code
                        await seedShips.InitAsync(initCfg, db); //Seed initial ship information properties
                        // var shipService = services.GetRequiredService<ShipStatusService>();
                        // await shipService.ExecuteAsync(db);
                    }
                    catch (Exception ex)
                    {
                        var logger = sp.GetRequiredService<ILogger<Program>>();
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

    }

}