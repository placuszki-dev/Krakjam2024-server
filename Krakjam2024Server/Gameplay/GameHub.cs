using Microsoft.AspNetCore.SignalR;

namespace Placuszki.Krakjam2024.Server;

// GameHub is created at each message received from client or sent to client
public class GameHub : Hub<IGameHub>
{
    public GameHub(GameplayService gameplayService)
    {
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"New client connected. Sending initial data");
        return base.OnConnectedAsync();
    }
}