using Microsoft.EntityFrameworkCore;
using IntraProjects.Domain.Entities;

namespace IntraProjects.Infrastructure.Persistence;

public class IntraProjectsDbContext : DbContext
{
    public IntraProjectsDbContext(DbContextOptions<IntraProjectsDbContext> options)
        : base(options) { }

    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<ProjectCharter> ProjectCharters => Set<ProjectCharter>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<Subtask> Subtasks => Set<Subtask>();
    public DbSet<AuditEvent> AuditEvents => Set<AuditEvent>();
    public DbSet<CharterStatus> CharterStatuses => Set<CharterStatus>();
    public DbSet<ProjectTaskStatus> ProjectTaskStatuses => Set<ProjectTaskStatus>();
    public DbSet<SubtaskStatus> SubtaskStatuses => Set<SubtaskStatus>();
    public DbSet<Priority> Priorities => Set<Priority>();
    public DbSet<CharterStatusHistory> CharterStatusHistories => Set<CharterStatusHistory>();
    public DbSet<CharterTeamMember> CharterTeamMembers => Set<CharterTeamMember>();
    public DbSet<CharterMilestone> CharterMilestones => Set<CharterMilestone>();
    public DbSet<CharterCostItem> CharterCostItems => Set<CharterCostItem>();
    public DbSet<CharterVendorPro> CharterVendorPros => Set<CharterVendorPro>();
    public DbSet<CharterVendorCon> CharterVendorCons => Set<CharterVendorCon>();
    public DbSet<CharterVendorReference> CharterVendorReferences => Set<CharterVendorReference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>(e =>
        {
            e.HasKey(x => x.UserId);
            e.HasIndex(x => x.AdObjectId).IsUnique();
            e.HasIndex(x => x.SamAccountName).IsUnique();
            e.Property(x => x.SamAccountName).HasMaxLength(50).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(150).IsRequired();
            e.Property(x => x.Email).HasMaxLength(200).IsRequired();
            e.Property(x => x.Department).HasMaxLength(100);
        });

        modelBuilder.Entity<ProjectCharter>(e =>
        {
            e.HasKey(x => x.CharterId);
            e.HasIndex(x => x.CharterNumber).IsUnique();
            e.Property(x => x.CharterNumber).HasMaxLength(20).IsRequired();
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.Department).HasMaxLength(100);
            e.Property(x => x.ArchiveReason).HasMaxLength(500);
            e.Property(x => x.VendorName).HasMaxLength(200);
            e.Property(x => x.ProductName).HasMaxLength(200);
            e.Property(x => x.OneTimeCosts).HasColumnType("decimal(12,2)");
            e.Property(x => x.AnnualPrice).HasColumnType("decimal(12,2)");
            e.HasOne(x => x.Owner).WithMany(u => u.OwnedCharters).HasForeignKey(x => x.OwnerUserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Status).WithMany().HasForeignKey(x => x.StatusId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Priority).WithMany().HasForeignKey(x => x.PriorityId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.StatusId);
            e.HasIndex(x => x.OwnerUserId);
            e.HasIndex(x => x.IsArchived);
            e.HasIndex(x => x.TargetDate);
        });

        modelBuilder.Entity<ProjectTask>(e =>
        {
            e.HasKey(x => x.TaskId);
            e.HasIndex(x => x.TaskNumber).IsUnique();
            e.Property(x => x.TaskNumber).HasMaxLength(20).IsRequired();
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.HasOne(x => x.Charter).WithMany(c => c.Tasks).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.AssignedTo).WithMany(u => u.AssignedTasks).HasForeignKey(x => x.AssignedToUserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Status).WithMany().HasForeignKey(x => x.StatusId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Priority).WithMany().HasForeignKey(x => x.PriorityId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.CharterId);
            e.HasIndex(x => x.AssignedToUserId);
            e.HasIndex(x => x.IsArchived);
        });

        modelBuilder.Entity<Subtask>(e =>
        {
            e.HasKey(x => x.SubtaskId);
            e.HasIndex(x => x.SubtaskNumber).IsUnique();
            e.Property(x => x.SubtaskNumber).HasMaxLength(20).IsRequired();
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.HasOne(x => x.Task).WithMany(t => t.Subtasks).HasForeignKey(x => x.TaskId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Charter).WithMany().HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Status).WithMany().HasForeignKey(x => x.StatusId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Priority).WithMany().HasForeignKey(x => x.PriorityId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.TaskId);
            e.HasIndex(x => x.CharterId);
            e.HasIndex(x => x.AssignedToUserId);
        });

        modelBuilder.Entity<AuditEvent>(e =>
        {
            e.HasKey(x => x.AuditEventId);
            e.Property(x => x.EntityType).HasMaxLength(50).IsRequired();
            e.Property(x => x.EntityDisplayId).HasMaxLength(20);
            e.Property(x => x.ActionType).HasMaxLength(30).IsRequired();
            e.Property(x => x.FieldName).HasMaxLength(100);
            e.HasOne(x => x.ChangedBy).WithMany().HasForeignKey(x => x.ChangedByUserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Charter).WithMany(c => c.AuditEvents).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => new { x.EntityType, x.EntityId, x.ChangedAt });
            e.HasIndex(x => x.ChangedAt);
        });

        modelBuilder.Entity<CharterStatus>(e =>
        {
            e.HasKey(x => x.StatusId);
            e.HasIndex(x => x.StatusCode).IsUnique();
            e.Property(x => x.StatusCode).HasMaxLength(30).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(50).IsRequired();
        });

        modelBuilder.Entity<ProjectTaskStatus>(e =>
        {
            e.HasKey(x => x.StatusId);
            e.HasIndex(x => x.StatusCode).IsUnique();
            e.Property(x => x.StatusCode).HasMaxLength(30).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(50).IsRequired();
        });

        modelBuilder.Entity<SubtaskStatus>(e =>
        {
            e.HasKey(x => x.StatusId);
            e.HasIndex(x => x.StatusCode).IsUnique();
            e.Property(x => x.StatusCode).HasMaxLength(30).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(50).IsRequired();
        });

        modelBuilder.Entity<Priority>(e =>
        {
            e.HasKey(x => x.PriorityId);
            e.HasIndex(x => x.PriorityCode).IsUnique();
            e.Property(x => x.PriorityCode).HasMaxLength(20).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(30).IsRequired();
            e.Property(x => x.ColorHex).HasMaxLength(7);
        });

        modelBuilder.Entity<CharterStatus>().HasData(
            new CharterStatus { StatusId = 1, StatusCode = "Draft",     DisplayName = "Draft",     SortOrder = 1, IsTerminal = false },
            new CharterStatus { StatusId = 2, StatusCode = "Active",    DisplayName = "Active",    SortOrder = 2, IsTerminal = false },
            new CharterStatus { StatusId = 3, StatusCode = "OnHold",    DisplayName = "On Hold",   SortOrder = 3, IsTerminal = false },
            new CharterStatus { StatusId = 4, StatusCode = "Completed", DisplayName = "Completed", SortOrder = 4, IsTerminal = true  },
            new CharterStatus { StatusId = 5, StatusCode = "Cancelled", DisplayName = "Cancelled", SortOrder = 5, IsTerminal = true  }
        );

        modelBuilder.Entity<ProjectTaskStatus>().HasData(
            new ProjectTaskStatus { StatusId = 1, StatusCode = "Open",        DisplayName = "Open",                SortOrder = 1, IsTerminal = false },
            new ProjectTaskStatus { StatusId = 2, StatusCode = "InProgress",  DisplayName = "In Progress",         SortOrder = 2, IsTerminal = false },
            new ProjectTaskStatus { StatusId = 3, StatusCode = "Stalled",     DisplayName = "Stalled",             SortOrder = 3, IsTerminal = false },
            new ProjectTaskStatus { StatusId = 4, StatusCode = "WaitingOn",   DisplayName = "Waiting on response", SortOrder = 4, IsTerminal = false },
            new ProjectTaskStatus { StatusId = 5, StatusCode = "UnderReview", DisplayName = "Under review",        SortOrder = 5, IsTerminal = false },
            new ProjectTaskStatus { StatusId = 6, StatusCode = "Complete",    DisplayName = "Complete",            SortOrder = 6, IsTerminal = true  },
            new ProjectTaskStatus { StatusId = 7, StatusCode = "Cancelled",   DisplayName = "Cancelled",           SortOrder = 7, IsTerminal = true  }
        );

        modelBuilder.Entity<SubtaskStatus>().HasData(
            new SubtaskStatus { StatusId = 1, StatusCode = "Open",        DisplayName = "Open",                SortOrder = 1, IsTerminal = false },
            new SubtaskStatus { StatusId = 2, StatusCode = "InProgress",  DisplayName = "In Progress",         SortOrder = 2, IsTerminal = false },
            new SubtaskStatus { StatusId = 3, StatusCode = "Stalled",     DisplayName = "Stalled",             SortOrder = 3, IsTerminal = false },
            new SubtaskStatus { StatusId = 4, StatusCode = "WaitingOn",   DisplayName = "Waiting on response", SortOrder = 4, IsTerminal = false },
            new SubtaskStatus { StatusId = 5, StatusCode = "UnderReview", DisplayName = "Under review",        SortOrder = 5, IsTerminal = false },
            new SubtaskStatus { StatusId = 6, StatusCode = "Complete",    DisplayName = "Complete",            SortOrder = 6, IsTerminal = true  },
            new SubtaskStatus { StatusId = 7, StatusCode = "Cancelled",   DisplayName = "Cancelled",           SortOrder = 7, IsTerminal = true  }
        );

        modelBuilder.Entity<Priority>().HasData(
            new Priority { PriorityId = 1, PriorityCode = "Critical", DisplayName = "Critical", SortOrder = 1, ColorHex = "#ef4444" },
            new Priority { PriorityId = 2, PriorityCode = "High",     DisplayName = "High",     SortOrder = 2, ColorHex = "#f97316" },
            new Priority { PriorityId = 3, PriorityCode = "Medium",   DisplayName = "Medium",   SortOrder = 3, ColorHex = "#eab308" },
            new Priority { PriorityId = 4, PriorityCode = "Low",      DisplayName = "Low",      SortOrder = 4, ColorHex = "#64748b" }
        );

        modelBuilder.Entity<CharterStatusHistory>(e =>
        {
            e.HasKey(x => x.HistoryId);
            e.HasOne(x => x.Charter).WithMany(c => c.StatusHistory).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => new { x.CharterId, x.ChangedAt });
        });

        modelBuilder.Entity<CharterTeamMember>(e =>
        {
            e.HasKey(x => x.TeamMemberId);
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Role).HasMaxLength(100);
            e.Property(x => x.EstimatedHours).HasColumnType("decimal(8,2)");
            e.HasOne(x => x.Charter).WithMany(c => c.TeamMembers).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => x.CharterId);
        });

        modelBuilder.Entity<CharterMilestone>(e =>
        {
            e.HasKey(x => x.MilestoneId);
            e.Property(x => x.Description).HasMaxLength(500).IsRequired();
            e.HasOne(x => x.Charter).WithMany(c => c.Milestones).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => x.CharterId);
        });

        modelBuilder.Entity<CharterCostItem>(e =>
        {
            e.HasKey(x => x.CostItemId);
            e.Property(x => x.Description).HasMaxLength(300).IsRequired();
            e.Property(x => x.Amount).HasColumnType("decimal(12,2)");
            e.HasOne(x => x.Charter).WithMany(c => c.CostItems).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => x.CharterId);
        });

        modelBuilder.Entity<CharterVendorPro>(e =>
        {
            e.HasKey(x => x.VendorProId);
            e.Property(x => x.Text).HasMaxLength(500).IsRequired();
            e.HasOne(x => x.Charter).WithMany(c => c.VendorPros).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CharterVendorCon>(e =>
        {
            e.HasKey(x => x.VendorConId);
            e.Property(x => x.Text).HasMaxLength(500).IsRequired();
            e.HasOne(x => x.Charter).WithMany(c => c.VendorCons).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CharterVendorReference>(e =>
        {
            e.HasKey(x => x.VendorReferenceId);
            e.Property(x => x.Contact).HasMaxLength(200).IsRequired();
            e.Property(x => x.ContactInfo).HasMaxLength(200);
            e.HasOne(x => x.Charter).WithMany(c => c.VendorReferences).HasForeignKey(x => x.CharterId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
