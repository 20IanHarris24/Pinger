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


                
                var serv = builder.Services;
                var conf = builder.Configuration;
                var env = builder.Environment;


                // --- DbContext ---
                serv.AddDbContext<PingAppDbContext>(options =>
                {
                    var cs = conf.GetConnectionString("DatabaseConnection");
                    options.UseSqlite(cs);

                });
                    
                    
                    
                    
                // service.AddDbContext<PingAppDbContext>(options =>
                // options.UseNpgsql(config.GetConnectionString("DatabaseConnection")));


                // --- Background Services ---
                serv.AddSingleton<ShipBackgroundPingService>();

                // --- Options & Validation


                serv.AddOptions<PaginationSettings>()
                    .Bind(builder.Configuration.GetSection("PaginationSettings"))
                    .ValidateDataAnnotations()
                    .Validate(ps => ps.PageSize <= ps.MaxPageSize,
                        "PageSize must be less than or equal to MaxPagesSize")
                    .ValidateOnStart();



                // --- App Services ___


                serv.AddSingleton<ConcurrentDictionary<Guid, string>>();
                serv.AddSingleton<IHostedService>(sp => sp.GetRequiredService<ShipBackgroundPingService>());
                serv.AddSingleton<IShipPingRequester>(sp => sp.GetRequiredService<ShipBackgroundPingService>());
                serv.AddSingleton<ShipStatusService>();
                serv.AddSingleton<IShipStatusService>(sp => sp.GetRequiredService<ShipStatusService>());
                serv.AddSingleton<IShipStatusMaintenance>(sp => sp.GetRequiredService<ShipStatusService>());
                serv.AddSingleton<NotifierService>();
                serv.AddScoped<AssetSeedData>();
                serv.AddScoped<IShipQueryService, ShipQueryService>();



                // ---Controllers and JSON Converters

                serv.AddControllers().AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });


                // --- Cors ---
                serv.AddCors(options =>
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

                serv.AddSignalR();

              
                // --- OpenAPI only in dev

                if (env.IsDevelopment())
                {
                    serv.AddOpenApiDocument();
                }

                WebApplication app = builder.Build();

                // --- Middleware / Pipeline

                if (!env.IsDevelopment())
                {
                    app.UseHsts();
                }
                
                if (env.IsDevelopment())
                {
                    app.UseHttpsRedirection();
                }

                app.UseDefaultFiles();
                app.UseStaticFiles();
                
                app.UseRouting();
                app.UseCors("CorsPolicy");


                if (env.IsDevelopment())
                {
                    app.UseOpenApi();
                    app.UseSwaggerUi();

                    app.MapGet("/debugpagination", (IOptionsSnapshot<PaginationSettings> opts) =>
                    {
                        var ps = opts.Value; // reflects config changes on next request
                        var checkPayload = new
                        {
                            ps.Page,
                            ps.PageSize,
                            ps.MaxPageSize,
                            ps.Sort,
                            ps.Direction
                        };
                        return Results.Json(checkPayload, new JsonSerializerOptions(JsonSerializerDefaults.Web)
                        {
                            Converters = { new JsonStringEnumConverter() }

                        });
                    });
                }

                app.MapHub<DisplayHub>("/display");
                app.MapControllers();
                app.MapFallbackToFile("index.html");
                


                // --- Scope Seed dB Database ---
                using (var scope = app.Services.CreateScope())
                {
                    var sp = scope.ServiceProvider;
                    var db = sp.GetRequiredService<PingAppDbContext>();
                    var initCfg = sp.GetRequiredService<IConfiguration>();
                    var logging = sp.GetRequiredService<ILogger<Program>>();
                    var seedShips = sp.GetRequiredService<AssetSeedData>();



                    try
                    {
                        await db.Database.MigrateAsync();
                        var seeded = await seedShips.InitAsync(CancellationToken.None, initCfg, db); //Seed initial ship information properties
                        logging.LogInformation(seeded ? "Database seeded and ready." : "Database ready (seeding not required)." );
                    }
                    catch (Exception ex)
                    {
                        
                        logging.LogError(ex, "An error occurred seeding the DB.");
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