namespace Placuszki.Krakjam2024.Server
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddRazorPages();
            builder.Services.AddServerSideBlazor();
            builder.Services.AddHttpContextAccessor(); // to get IP address of connected user
            builder.Services.AddScoped<SessionService>();
            builder.Services.AddScoped<FileReader>();
            builder.Services.AddSingleton<GameplayService>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.MapBlazorHub();
            app.MapFallbackToPage("/_Host");
            app.MapHub<GameHub>("/hubs/gamehub");

            app.Run();
        }
    }
}