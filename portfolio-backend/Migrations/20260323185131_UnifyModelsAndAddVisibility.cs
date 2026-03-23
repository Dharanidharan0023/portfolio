using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace portfolio_backend.Migrations
{
    /// <inheritdoc />
    public partial class UnifyModelsAndAddVisibility : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "Skills",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "Experiences",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "Educations",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "Contacts",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "Achievements",
                newName: "Order");

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Skills",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Experiences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Educations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Contacts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Achievements",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Educations");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Achievements");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Skills",
                newName: "OrderIndex");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Experiences",
                newName: "OrderIndex");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Educations",
                newName: "OrderIndex");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Contacts",
                newName: "OrderIndex");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Achievements",
                newName: "OrderIndex");
        }
    }
}
