using Project_Solutions.Models;

namespace Project_Solutions.Services.Auth
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}