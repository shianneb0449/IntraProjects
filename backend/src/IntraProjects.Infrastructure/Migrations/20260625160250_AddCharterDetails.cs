using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntraProjects.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCharterDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AnnualPrice",
                table: "ProjectCharters",
                type: "decimal(12,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasVendor",
                table: "ProjectCharters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "OneTimeCosts",
                table: "ProjectCharters",
                type: "decimal(12,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductName",
                table: "ProjectCharters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VendorName",
                table: "ProjectCharters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VendorNotes",
                table: "ProjectCharters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CharterCostItems",
                columns: table => new
                {
                    CostItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterCostItems", x => x.CostItemId);
                    table.ForeignKey(
                        name: "FK_CharterCostItems_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharterMilestones",
                columns: table => new
                {
                    MilestoneId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    MilestoneNumber = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CompleteByDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsComplete = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterMilestones", x => x.MilestoneId);
                    table.ForeignKey(
                        name: "FK_CharterMilestones_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharterTeamMembers",
                columns: table => new
                {
                    TeamMemberId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    EstimatedHours = table.Column<decimal>(type: "decimal(8,2)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterTeamMembers", x => x.TeamMemberId);
                    table.ForeignKey(
                        name: "FK_CharterTeamMembers_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharterVendorCons",
                columns: table => new
                {
                    VendorConId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterVendorCons", x => x.VendorConId);
                    table.ForeignKey(
                        name: "FK_CharterVendorCons_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharterVendorPros",
                columns: table => new
                {
                    VendorProId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterVendorPros", x => x.VendorProId);
                    table.ForeignKey(
                        name: "FK_CharterVendorPros_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharterVendorReferences",
                columns: table => new
                {
                    VendorReferenceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ContactInfo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterVendorReferences", x => x.VendorReferenceId);
                    table.ForeignKey(
                        name: "FK_CharterVendorReferences_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CharterCostItems_CharterId",
                table: "CharterCostItems",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_CharterMilestones_CharterId",
                table: "CharterMilestones",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_CharterTeamMembers_CharterId",
                table: "CharterTeamMembers",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_CharterVendorCons_CharterId",
                table: "CharterVendorCons",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_CharterVendorPros_CharterId",
                table: "CharterVendorPros",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_CharterVendorReferences_CharterId",
                table: "CharterVendorReferences",
                column: "CharterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CharterCostItems");

            migrationBuilder.DropTable(
                name: "CharterMilestones");

            migrationBuilder.DropTable(
                name: "CharterTeamMembers");

            migrationBuilder.DropTable(
                name: "CharterVendorCons");

            migrationBuilder.DropTable(
                name: "CharterVendorPros");

            migrationBuilder.DropTable(
                name: "CharterVendorReferences");

            migrationBuilder.DropColumn(
                name: "AnnualPrice",
                table: "ProjectCharters");

            migrationBuilder.DropColumn(
                name: "HasVendor",
                table: "ProjectCharters");

            migrationBuilder.DropColumn(
                name: "OneTimeCosts",
                table: "ProjectCharters");

            migrationBuilder.DropColumn(
                name: "ProductName",
                table: "ProjectCharters");

            migrationBuilder.DropColumn(
                name: "VendorName",
                table: "ProjectCharters");

            migrationBuilder.DropColumn(
                name: "VendorNotes",
                table: "ProjectCharters");
        }
    }
}
