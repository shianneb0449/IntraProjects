using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IntraProjects.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdObjectId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SamAccountName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    LastSyncedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "CharterStatuses",
                columns: table => new
                {
                    StatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsTerminal = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterStatuses", x => x.StatusId);
                });

            migrationBuilder.CreateTable(
                name: "Priorities",
                columns: table => new
                {
                    PriorityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PriorityCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    ColorHex = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Priorities", x => x.PriorityId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTaskStatuses",
                columns: table => new
                {
                    StatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsTerminal = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTaskStatuses", x => x.StatusId);
                });

            migrationBuilder.CreateTable(
                name: "SubtaskStatuses",
                columns: table => new
                {
                    StatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsTerminal = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubtaskStatuses", x => x.StatusId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCharters",
                columns: table => new
                {
                    CharterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Department = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProblemStatement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GoalStatement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectApproach = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerUserId = table.Column<int>(type: "int", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    PriorityId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TargetDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ActualCloseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsArchived = table.Column<bool>(type: "bit", nullable: false),
                    ArchivedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ArchivedByUserId = table.Column<int>(type: "int", nullable: true),
                    ArchiveReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedByUserId = table.Column<int>(type: "int", nullable: false),
                    ModifiedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectCharters", x => x.CharterId);
                    table.ForeignKey(
                        name: "FK_ProjectCharters_AppUsers_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "AppUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectCharters_CharterStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "CharterStatuses",
                        principalColumn: "StatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectCharters_Priorities_PriorityId",
                        column: x => x.PriorityId,
                        principalTable: "Priorities",
                        principalColumn: "PriorityId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AuditEvents",
                columns: table => new
                {
                    AuditEventId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false),
                    EntityDisplayId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ActionType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    FieldName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OldValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NewValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChangedByUserId = table.Column<int>(type: "int", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CorrelationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CharterId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditEvents", x => x.AuditEventId);
                    table.ForeignKey(
                        name: "FK_AuditEvents_AppUsers_ChangedByUserId",
                        column: x => x.ChangedByUserId,
                        principalTable: "AppUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AuditEvents_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CharterStatusHistories",
                columns: table => new
                {
                    HistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    FromStatusId = table.Column<int>(type: "int", nullable: true),
                    ToStatusId = table.Column<int>(type: "int", nullable: false),
                    ChangedByUserId = table.Column<int>(type: "int", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharterStatusHistories", x => x.HistoryId);
                    table.ForeignKey(
                        name: "FK_CharterStatusHistories_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTasks",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaskNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectObjectiveGoal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    PriorityId = table.Column<int>(type: "int", nullable: false),
                    Requestor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequestorEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Team = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Urgency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignedToUserId = table.Column<int>(type: "int", nullable: true),
                    PrimaryResourceLoad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondaryResourceUserId = table.Column<int>(type: "int", nullable: true),
                    SecondaryResourceLoad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReminderDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProjectFolderDirectory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TravelNeeded = table.Column<bool>(type: "bit", nullable: false),
                    ScopeCreep = table.Column<bool>(type: "bit", nullable: false),
                    ReviewNeeded = table.Column<bool>(type: "bit", nullable: false),
                    ApprovalStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverUserId = table.Column<int>(type: "int", nullable: true),
                    NextStepSummary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StalledBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StalledReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CurrentlyWaitingOn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsArchived = table.Column<bool>(type: "bit", nullable: false),
                    ArchivedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ArchivedByUserId = table.Column<int>(type: "int", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedByUserId = table.Column<int>(type: "int", nullable: false),
                    ModifiedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTasks", x => x.TaskId);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_AppUsers_AssignedToUserId",
                        column: x => x.AssignedToUserId,
                        principalTable: "AppUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_Priorities_PriorityId",
                        column: x => x.PriorityId,
                        principalTable: "Priorities",
                        principalColumn: "PriorityId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_ProjectTaskStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "ProjectTaskStatuses",
                        principalColumn: "StatusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Subtasks",
                columns: table => new
                {
                    SubtaskId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubtaskNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TaskId = table.Column<int>(type: "int", nullable: false),
                    CharterId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectObjectiveGoal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    PriorityId = table.Column<int>(type: "int", nullable: false),
                    Requestor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequestorEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Team = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Urgency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignedToUserId = table.Column<int>(type: "int", nullable: true),
                    PrimaryResourceLoad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondaryResourceUserId = table.Column<int>(type: "int", nullable: true),
                    SecondaryResourceLoad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReminderDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProjectFolderDirectory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TravelNeeded = table.Column<bool>(type: "bit", nullable: false),
                    ScopeCreep = table.Column<bool>(type: "bit", nullable: false),
                    ReviewNeeded = table.Column<bool>(type: "bit", nullable: false),
                    ApprovalStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverUserId = table.Column<int>(type: "int", nullable: true),
                    NextStepSummary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StalledBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StalledReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CurrentlyWaitingOn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsArchived = table.Column<bool>(type: "bit", nullable: false),
                    ArchivedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedByUserId = table.Column<int>(type: "int", nullable: false),
                    ModifiedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subtasks", x => x.SubtaskId);
                    table.ForeignKey(
                        name: "FK_Subtasks_AppUsers_AssignedToUserId",
                        column: x => x.AssignedToUserId,
                        principalTable: "AppUsers",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Subtasks_Priorities_PriorityId",
                        column: x => x.PriorityId,
                        principalTable: "Priorities",
                        principalColumn: "PriorityId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Subtasks_ProjectCharters_CharterId",
                        column: x => x.CharterId,
                        principalTable: "ProjectCharters",
                        principalColumn: "CharterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Subtasks_ProjectTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "TaskId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Subtasks_SubtaskStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "SubtaskStatuses",
                        principalColumn: "StatusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "CharterStatuses",
                columns: new[] { "StatusId", "DisplayName", "IsActive", "IsTerminal", "SortOrder", "StatusCode" },
                values: new object[,]
                {
                    { 1, "Draft", true, false, 1, "Draft" },
                    { 2, "Active", true, false, 2, "Active" },
                    { 3, "On Hold", true, false, 3, "OnHold" },
                    { 4, "Completed", true, true, 4, "Completed" },
                    { 5, "Cancelled", true, true, 5, "Cancelled" }
                });

            migrationBuilder.InsertData(
                table: "Priorities",
                columns: new[] { "PriorityId", "ColorHex", "DisplayName", "PriorityCode", "SortOrder" },
                values: new object[,]
                {
                    { 1, "#ef4444", "Critical", "Critical", 1 },
                    { 2, "#f97316", "High", "High", 2 },
                    { 3, "#eab308", "Medium", "Medium", 3 },
                    { 4, "#64748b", "Low", "Low", 4 }
                });

            migrationBuilder.InsertData(
                table: "ProjectTaskStatuses",
                columns: new[] { "StatusId", "DisplayName", "IsActive", "IsTerminal", "SortOrder", "StatusCode" },
                values: new object[,]
                {
                    { 1, "Open", true, false, 1, "Open" },
                    { 2, "In Progress", true, false, 2, "InProgress" },
                    { 3, "Stalled", true, false, 3, "Stalled" },
                    { 4, "Waiting on response", true, false, 4, "WaitingOn" },
                    { 5, "Under review", true, false, 5, "UnderReview" },
                    { 6, "Complete", true, true, 6, "Complete" },
                    { 7, "Cancelled", true, true, 7, "Cancelled" }
                });

            migrationBuilder.InsertData(
                table: "SubtaskStatuses",
                columns: new[] { "StatusId", "DisplayName", "IsActive", "IsTerminal", "SortOrder", "StatusCode" },
                values: new object[,]
                {
                    { 1, "Open", true, false, 1, "Open" },
                    { 2, "In Progress", true, false, 2, "InProgress" },
                    { 3, "Stalled", true, false, 3, "Stalled" },
                    { 4, "Waiting on response", true, false, 4, "WaitingOn" },
                    { 5, "Under review", true, false, 5, "UnderReview" },
                    { 6, "Complete", true, true, 6, "Complete" },
                    { 7, "Cancelled", true, true, 7, "Cancelled" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_AdObjectId",
                table: "AppUsers",
                column: "AdObjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_SamAccountName",
                table: "AppUsers",
                column: "SamAccountName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_ChangedAt",
                table: "AuditEvents",
                column: "ChangedAt");

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_ChangedByUserId",
                table: "AuditEvents",
                column: "ChangedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_CharterId",
                table: "AuditEvents",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_EntityType_EntityId_ChangedAt",
                table: "AuditEvents",
                columns: new[] { "EntityType", "EntityId", "ChangedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_CharterStatuses_StatusCode",
                table: "CharterStatuses",
                column: "StatusCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CharterStatusHistories_CharterId_ChangedAt",
                table: "CharterStatusHistories",
                columns: new[] { "CharterId", "ChangedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Priorities_PriorityCode",
                table: "Priorities",
                column: "PriorityCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCharters_CharterNumber",
                table: "ProjectCharters",
                column: "CharterNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCharters_IsArchived",
                table: "ProjectCharters",
                column: "IsArchived");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCharters_OwnerUserId",
                table: "ProjectCharters",
                column: "OwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCharters_PriorityId",
                table: "ProjectCharters",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCharters_StatusId",
                table: "ProjectCharters",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCharters_TargetDate",
                table: "ProjectCharters",
                column: "TargetDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_AssignedToUserId",
                table: "ProjectTasks",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_CharterId",
                table: "ProjectTasks",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_IsArchived",
                table: "ProjectTasks",
                column: "IsArchived");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_PriorityId",
                table: "ProjectTasks",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_StatusId",
                table: "ProjectTasks",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_TaskNumber",
                table: "ProjectTasks",
                column: "TaskNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTaskStatuses_StatusCode",
                table: "ProjectTaskStatuses",
                column: "StatusCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subtasks_AssignedToUserId",
                table: "Subtasks",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtasks_CharterId",
                table: "Subtasks",
                column: "CharterId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtasks_PriorityId",
                table: "Subtasks",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtasks_StatusId",
                table: "Subtasks",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtasks_SubtaskNumber",
                table: "Subtasks",
                column: "SubtaskNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subtasks_TaskId",
                table: "Subtasks",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_SubtaskStatuses_StatusCode",
                table: "SubtaskStatuses",
                column: "StatusCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditEvents");

            migrationBuilder.DropTable(
                name: "CharterStatusHistories");

            migrationBuilder.DropTable(
                name: "Subtasks");

            migrationBuilder.DropTable(
                name: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "SubtaskStatuses");

            migrationBuilder.DropTable(
                name: "ProjectCharters");

            migrationBuilder.DropTable(
                name: "ProjectTaskStatuses");

            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "CharterStatuses");

            migrationBuilder.DropTable(
                name: "Priorities");
        }
    }
}
