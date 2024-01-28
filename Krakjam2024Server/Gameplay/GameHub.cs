using CargoAR.Shared.Network;
using Microsoft.AspNetCore.SignalR;

namespace Placuszki.Krakjam2024.Server;

// GameHub is created at each message received from client or sent to client
public class GameHub : Hub<IGameHub>, IClientHub
{
    private readonly GameplayService _gameplayService;

    public GameHub(GameplayService gameplayService)
    {
        _gameplayService = gameplayService;
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"New client connected. Sending initial data");
        return base.OnConnectedAsync();
    }

    public void SendEndGameToServer(int winningCheeseType)
    {
        Console.WriteLine($"SendEndGameToServer: {winningCheeseType}");
        _gameplayService.OnEndGameReceivedFromClient(winningCheeseType);
    }

    public void SendMainMenuOpenedToServer()
    {
        Console.WriteLine($"MainMenuOpened");
        _gameplayService.OnMainMenuOpenedOnClient();
    }

    public void VibratePhone(string playerId, float force)
    {
        _gameplayService.OnVibratePhoneReceived(playerId, force);
    }
}