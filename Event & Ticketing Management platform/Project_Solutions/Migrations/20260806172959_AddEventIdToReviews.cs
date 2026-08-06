using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_Solutions.Migrations
{
    /// <inheritdoc />
    public partial class AddEventIdToReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_EventId",
                table: "Reviews",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_EventId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Reviews");
        }
    }
}
