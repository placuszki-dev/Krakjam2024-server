using Microsoft.AspNetCore.SignalR;

namespace Placuszki.Krakjam2024.Server;

public class GameplayService : BackgroundService
{
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

    public void SendUpdateToClients(string playerId, string key, int value)
    {
        DataPacket dataPacket = new DataPacket
        {
            PlayerId = playerId,
            Key = key,
            Value = value,
        };
        _gameHub.Clients.All.SendDataPacket(dataPacket);
    }
}