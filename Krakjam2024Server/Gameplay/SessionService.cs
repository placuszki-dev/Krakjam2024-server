namespace Placuszki.Krakjam2024.Server;

public class SessionService
{
    public string PlayerId { get; set; } = Guid.NewGuid().ToString();
    public string PhoneColor { get; set; } = GenerateRandomHexColor();

    private static string GenerateRandomHexColor()
    {
        Random random = new Random();
        byte[] colorBytes = new byte[3];
        random.NextBytes(colorBytes);

        string hexColor = $"#{colorBytes[0]:X2}{colorBytes[1]:X2}{colorBytes[2]:X2}";
        return hexColor;
    }
}