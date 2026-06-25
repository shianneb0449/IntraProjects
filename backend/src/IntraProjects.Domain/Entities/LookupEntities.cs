namespace IntraProjects.Domain.Entities;

public class CharterStatus
{
    public int StatusId { get; set; }
    public string StatusCode { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsTerminal { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ProjectTaskStatus
{
    public int StatusId { get; set; }
    public string StatusCode { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsTerminal { get; set; }
    public bool IsActive { get; set; } = true;
}

public class SubtaskStatus
{
    public int StatusId { get; set; }
    public string StatusCode { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsTerminal { get; set; }
    public bool IsActive { get; set; } = true;
}

public class Priority
{
    public int PriorityId { get; set; }
    public string PriorityCode { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public string? ColorHex { get; set; }
}

public class CharterStatusHistory
{
    public int HistoryId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public int? FromStatusId { get; set; }
    public int ToStatusId { get; set; }
    public int ChangedByUserId { get; set; }
    public DateTimeOffset ChangedAt { get; set; } = DateTimeOffset.UtcNow;
    public string? Notes { get; set; }
}
