namespace IntraProjects.Domain.Entities;

public class AuditEvent
{
    public int AuditEventId { get; set; }
    public Guid EventId { get; set; } = Guid.NewGuid();
    public string EntityType { get; set; } = string.Empty;   // Charter, Task, Subtask
    public int EntityId { get; set; }
    public string? EntityDisplayId { get; set; }              // CHR-0041
    public string ActionType { get; set; } = string.Empty;   // Created, Updated, StatusChanged
    public string? FieldName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public int ChangedByUserId { get; set; }
    public AppUser ChangedBy { get; set; } = null!;
    public DateTimeOffset ChangedAt { get; set; } = DateTimeOffset.UtcNow;
    public Guid? CorrelationId { get; set; }

    // Optional FK to charter for filtering
    public int? CharterId { get; set; }
    public ProjectCharter? Charter { get; set; }
}
