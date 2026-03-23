using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace portfolio_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectVisibilityAndOrdering : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "Projects",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "IsPublished",
                table: "Projects",
                newName: "IsVisible");

            migrationBuilder.RenameColumn(
                name: "IsPublished",
                table: "Achievements",
                newName: "IsFeatured");

            // IsFeatured already exists in the Projects table from a previous migration.
            // migrationBuilder.AddColumn<bool>(
            //     name: "IsFeatured",
            //     table: "Projects",
            //     type: "boolean",
            //     nullable: false,
            //     defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Subject = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Projects",
                newName: "OrderIndex");

            migrationBuilder.RenameColumn(
                name: "IsVisible",
                table: "Projects",
                newName: "IsPublished");

            migrationBuilder.RenameColumn(
                name: "IsFeatured",
                table: "Achievements",
                newName: "IsPublished");
        }
    }
}
