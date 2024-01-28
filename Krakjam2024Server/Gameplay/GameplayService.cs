using Microsoft.AspNetCore.SignalR;

namespace Placuszki.Krakjam2024.Server;

public class GameplayService : BackgroundService
{
    public event Action<int> EndGameReceived;
    public event Action MainMenuOpenedOnClient;
    
    private readonly ILogger<GameplayService> _logger;
    private static IHubContext<GameHub, IGameHub> _gameHub;

    public GameplayService(ILogger<GameplayService> logger, IHubContext<GameHub, IGameHub> gameHub)
    {
        _logger = logger;
        _gameHub = gameHub;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.Log(LogLevel.Information, "Background service started");
        await Task.CompletedTask;
    }

    public void SendUpdateToClients(DataPacket dataPacket)
    {
        _gameHub.Clients.All.SendDataPacket(dataPacket);
    }

    public void SendUserInfoToClients(UserInfo userInfo)
    {
        _gameHub.Clients.All.SendUserInfo(userInfo);
    }

    public void OnEndGameReceivedFromClient(int winningCheeseType)
    {
        EndGameReceived?.Invoke(winningCheeseType);
    }

    public void OnMainMenuOpenedOnClient()
    {
        MainMenuOpenedOnClient?.Invoke();
    }
}