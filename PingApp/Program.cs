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
                serv.AddHostedService<ShipBackgroundPingService>();

                // --- Options & Validation


                serv.AddOptions<PaginationSettings>()
                    .Bind(builder.Configuration.GetSection("PaginationSettings"))
                    .ValidateDataAnnotations()
                    .Validate(ps => ps.PageSize <= ps.MaxPageSize,
                        "PageSize must be less than or equal to MaxPagesSize")
                    .ValidateOnStart();



                // --- App Services ___


                serv.AddScoped<NotifierService>();
                serv.AddScoped<IShipQueryService, ShipQueryService>();
                serv.AddScoped<IShipStatusService, ShipStatusService>();
                serv.AddSingleton(new ConcurrentDictionary<Guid, string>());



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
                
                app.UseHttpsRedirection();
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
                //app.MapDefaultControllerRoute();


                // --- Scope Seed dB Database ---
                using (var scope = app.Services.CreateScope()) //new code
                {
                    var seedShips = new AssetSeedData();
                    var sp = scope.ServiceProvider; //new code
                    var db = sp.GetRequiredService<PingAppDbContext>(); //new code
                    var initCfg = sp.GetRequiredService<IConfiguration>();
                    var logging = sp.GetRequiredService<ILogger<Program>>();



                    try
                    {
                        //await db.Database.EnsureDeletedAsync(); //after the database has been seeded comment out this line.
                        //await db.Database.MigrateAsync(); //after first run when the empty database is created comment out this line.
                        await seedShips.InitAsync(initCfg, db); //Seed initial ship information properties
                        //var shipBackgroundService = sp.GetRequiredService<ShipBackgroundPingService>();
                        //await shipBackgroundService.ExecuteAsync(db);
                        logging.LogInformation("Database seeded and ready.");
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