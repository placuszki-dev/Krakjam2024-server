using System.IO;

public class FileReader
{
    public string ReadFileContent(string filePath)
    {
        try
        {
            return File.ReadAllText(filePath);
        }
        catch (Exception ex)
        {
            return $"Error reading file: {ex.Message}";
        }
    }
}