namespace Placuszki.Krakjam2024.Server;

public class SessionService
{
    public string PlayerId;
    public string PhoneColor;
    public int CheeseType;

    public string getPlayerId()
    {
	    if (string.IsNullOrEmpty(PlayerId)) {
		    PlayerId = Guid.NewGuid().ToString();
	    }
	    return PlayerId;
    }

    public void setPlayerId(string id) {
	    PlayerId = id;
    }

    public string getPhoneColor() {
	    if (string.IsNullOrEmpty(PhoneColor)) {
	    	PhoneColor = GenerateRandomHexColor();
	    }
	    return PhoneColor;
    }

    public void setPhoneColor(string color) {
	    PhoneColor = color;
    }

    public int getCheeseType()
    {
	    return CheeseType;
    }

    // TODO: Szymon
    public void setPhoneColor(int cheeseType) {
	    CheeseType = cheeseType;
    }
    
    private static string GenerateRandomHexColor()
    {
        Random random = new Random();
        byte[] colorBytes = new byte[3];
        random.NextBytes(colorBytes);

        string hexColor = $"#{colorBytes[0]:X2}{colorBytes[1]:X2}{colorBytes[2]:X2}";
        return hexColor;
    }
}
