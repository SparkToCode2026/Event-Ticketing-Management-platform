using Microsoft.EntityFrameworkCore;
using Project_Solutions.Models;

namespace Project_Solutions.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<OrganizerProfile> OrganizerProfiles { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventCategory> EventCategories { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User (1) — OrganizerProfile (1), optional on User's side
            modelBuilder.Entity<User>()
                .HasOne(u => u.OrganizerProfile)
                .WithOne(o => o.User)
                .HasForeignKey<OrganizerProfile>(o => o.UserId);

            // Order (1) — Promotion (1), optional on Order's side
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Promotion)
                .WithOne(p => p.Order)
                .HasForeignKey<Promotion>(p => p.OrderId);

            // Order (1) — Payment (1), optional on Order's side
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Payment)
                .WithOne(p => p.Order)
                .HasForeignKey<Payment>(p => p.OrderId);


            base.OnModelCreating(modelBuilder);
        }
    }
}