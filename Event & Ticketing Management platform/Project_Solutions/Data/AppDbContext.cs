using Microsoft.EntityFrameworkCore;
using Project_Solutions.Models;

namespace Project_Solutions.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<OrganizerProfile> OrganizerProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.OrganizerProfile)
                .WithOne(o => o.User)
                .HasForeignKey<OrganizerProfile>(o => o.UserId);

            base.OnModelCreating(modelBuilder);
        }
    }
}