using Microsoft.EntityFrameworkCore;

namespace Project_Solutions.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
