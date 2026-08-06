using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_Solutions.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrderIdFromPromotions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_Orders_OrderId",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_OrderId",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "Promotions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_OrderId",
                table: "Promotions",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_Orders_OrderId",
                table: "Promotions",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
