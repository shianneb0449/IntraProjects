namespace IntraProjects.Domain.Entities;

public class AppUser
{
    public int UserId { get; set; }
    public string AdObjectId { get; set; } = string.Empty;
    public string SamAccountName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset LastSyncedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation
    public ICollection<ProjectCharter> OwnedCharters { get; set; } = [];
    public ICollection<ProjectTask> AssignedTasks { get; set; } = [];
}
