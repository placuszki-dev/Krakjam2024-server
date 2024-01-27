namespace Placuszki.Krakjam2024.Server;

public class SessionService
{
    public string PlayerId { get; set; } = Guid.NewGuid().ToString();
}
