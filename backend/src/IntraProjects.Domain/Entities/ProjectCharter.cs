namespace IntraProjects.Domain.Entities;

public class ProjectCharter
{
    public int CharterId { get; set; }
    public string CharterNumber { get; set; } = string.Empty;  // CHR-0041
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Department { get; set; }
    public string? ProblemStatement { get; set; }
    public string? GoalStatement { get; set; }
    public string? ProjectApproach { get; set; }

    public int OwnerUserId { get; set; }
    public AppUser Owner { get; set; } = null!;

    public int StatusId { get; set; }
    public CharterStatus Status { get; set; } = null!;

    public int PriorityId { get; set; }
    public Priority Priority { get; set; } = null!;

    public DateOnly? StartDate { get; set; }
    public DateOnly? TargetDate { get; set; }
    public DateOnly? ActualCloseDate { get; set; }

    public bool IsArchived { get; set; } = false;
    public DateTimeOffset? ArchivedDate { get; set; }
    public int? ArchivedByUserId { get; set; }
    public string? ArchiveReason { get; set; }

    public int CreatedByUserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public int ModifiedByUserId { get; set; }
    public DateTimeOffset ModifiedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation
    public ICollection<ProjectTask> Tasks { get; set; } = [];
    public ICollection<CharterStatusHistory> StatusHistory { get; set; } = [];
    public ICollection<AuditEvent> AuditEvents { get; set; } = [];
}
