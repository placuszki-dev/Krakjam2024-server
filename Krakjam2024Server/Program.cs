using SignalRGameServerSample.Models;

namespace Placuszki.Krakjam2024.Server
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Disable object to json change property name with camel case principle
            builder.Services.AddSignalR().AddJsonProtocol(o => { o.PayloadSerializerOptions.PropertyNamingPolicy = null; });
            
            // Add services to the container.
            builder.Services.AddRazorPages();
            builder.Services.AddServerSideBlazor();
            builder.Services.AddScoped<SessionService>();
            builder.Services.AddSingleton<GameplayService>();
            builder.Services.AddSingleton<Helper>();
            //Disable Cross Orgine protection
            builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
                x =>
                {
                    x.AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed((host) => true)
                        .AllowCredentials();
                }));

            //-------------
            var app = builder.Build();
            app.UseCors("CorsPolicy");

            // // Configure the HTTP request pipeline.
            // if (!app.Environment.IsDevelopment())
            // {
            //     app.UseExceptionHandler("/Error");
            //     app.UseHsts();
            // }

            // app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.MapBlazorHub();
            app.MapFallbackToPage("/_Host");
            app.MapHub<GameHub>("/GameHub");

            app.Run();
        }
    }
}