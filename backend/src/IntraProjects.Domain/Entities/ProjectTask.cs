namespace IntraProjects.Domain.Entities;

public class ProjectTask
{
    public int TaskId { get; set; }
    public string TaskNumber { get; set; } = string.Empty;  // TSK-0188

    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ProjectObjectiveGoal { get; set; }

    public int StatusId { get; set; }
    public ProjectTaskStatus Status { get; set; } = null!;

    public int PriorityId { get; set; }
    public Priority Priority { get; set; } = null!;

    public string? Requestor { get; set; }
    public string? RequestorEmail { get; set; }
    public string? Department { get; set; }
    public string? Team { get; set; }
    public string? Urgency { get; set; }

    public int? AssignedToUserId { get; set; }
    public AppUser? AssignedTo { get; set; }
    public string? PrimaryResourceLoad { get; set; }

    public int? SecondaryResourceUserId { get; set; }
    public string? SecondaryResourceLoad { get; set; }

    public DateOnly? StartDate { get; set; }
    public DateOnly? DueDate { get; set; }
    public DateOnly? CompletedDate { get; set; }
    public DateOnly? ReminderDate { get; set; }

    public string? ProjectFolderDirectory { get; set; }
    public bool TravelNeeded { get; set; }
    public bool ScopeCreep { get; set; }
    public bool ReviewNeeded { get; set; }

    public string? ApprovalStatus { get; set; }
    public string? ApprovalComments { get; set; }
    public int? ApproverUserId { get; set; }

    public string? NextStepSummary { get; set; }
    public string? StalledBy { get; set; }
    public string? StalledReason { get; set; }
    public string? CurrentlyWaitingOn { get; set; }

    public int SortOrder { get; set; } = 0;
    public bool IsArchived { get; set; } = false;
    public DateTimeOffset? ArchivedDate { get; set; }
    public int? ArchivedByUserId { get; set; }

    public int CreatedByUserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public int ModifiedByUserId { get; set; }
    public DateTimeOffset ModifiedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation
    public ICollection<Subtask> Subtasks { get; set; } = [];
}
