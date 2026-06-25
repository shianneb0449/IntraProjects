using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IntraProjects.Infrastructure.Persistence;
using IntraProjects.Domain.Entities;

namespace IntraProjects.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly IntraProjectsDbContext _db;

    public TasksController(IntraProjectsDbContext db)
    {
        _db = db;
    }

    // GET api/tasks?charterId=1
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? charterId,
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25)
    {
        var query = _db.ProjectTasks
            .Include(t => t.Status)
            .Include(t => t.Priority)
            .Include(t => t.Charter)
            .Include(t => t.AssignedTo)
            .Include(t => t.Subtasks)
            .Where(t => !t.IsArchived);

        if (charterId.HasValue)
            query = query.Where(t => t.CharterId == charterId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(t => t.Status.StatusCode == status);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(t =>
                t.Title.Contains(search) ||
                t.TaskNumber.Contains(search) ||
                (t.Requestor != null && t.Requestor.Contains(search)));

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.TaskId,
                t.TaskNumber,
                t.CharterId,
                CharterNumber = t.Charter.CharterNumber,
                CharterTitle  = t.Charter.Title,
                t.Title,
                Status        = t.Status.DisplayName,
                StatusCode    = t.Status.StatusCode,
                Priority      = t.Priority.DisplayName,
                PriorityCode  = t.Priority.PriorityCode,
                t.Requestor,
                t.RequestorEmail,
                t.Department,
                t.Urgency,
                AssignedToDisplayName = t.AssignedTo != null ? t.AssignedTo.DisplayName : null,
                t.PrimaryResourceLoad,
                t.DueDate,
                t.TravelNeeded,
                t.ScopeCreep,
                t.ApprovalStatus,
                t.CreatedAt,
                SubtaskCount          = t.Subtasks.Count(s => !s.IsArchived),
                CompletedSubtaskCount = t.Subtasks.Count(s => !s.IsArchived && s.Status.StatusCode == "Complete"),
            })
            .ToListAsync();

        return Ok(new { items, totalCount = total, pageNumber = page, pageSize });
    }

    // GET api/tasks/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _db.ProjectTasks
            .Include(t => t.Status)
            .Include(t => t.Priority)
            .Include(t => t.Charter)
            .Include(t => t.AssignedTo)
            .Include(t => t.Subtasks).ThenInclude(s => s.Status)
            .Where(t => t.TaskId == id && !t.IsArchived)
            .FirstOrDefaultAsync();

        if (task is null) return NotFound();

        return Ok(new
        {
            task.TaskId,
            task.TaskNumber,
            task.CharterId,
            CharterNumber         = task.Charter.CharterNumber,
            CharterTitle          = task.Charter.Title,
            task.Title,
            task.Description,
            task.ProjectObjectiveGoal,
            Status                = task.Status.DisplayName,
            StatusCode            = task.Status.StatusCode,
            Priority              = task.Priority.DisplayName,
            PriorityCode          = task.Priority.PriorityCode,
            task.Requestor,
            task.RequestorEmail,
            task.Department,
            task.Team,
            task.Urgency,
            AssignedToDisplayName = task.AssignedTo?.DisplayName,
            task.PrimaryResourceLoad,
            task.DueDate,
            task.ReminderDate,
            task.TravelNeeded,
            task.ScopeCreep,
            task.ReviewNeeded,
            task.ApprovalStatus,
            task.ApprovalComments,
            task.NextStepSummary,
            task.StalledBy,
            task.StalledReason,
            task.CurrentlyWaitingOn,
            task.ProjectFolderDirectory,
            task.CreatedAt,
            task.ModifiedAt,
            Subtasks = task.Subtasks.Where(s => !s.IsArchived).Select(s => new
            {
                s.SubtaskId,
                s.SubtaskNumber,
                s.Title,
                Status   = s.Status.DisplayName,
                s.DueDate,
                s.Requestor,
            }),
        });
    }

    // POST api/tasks
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest("Title is required.");

        var charter = await _db.ProjectCharters.FindAsync(request.CharterId);
        if (charter is null)
            return BadRequest($"Charter {request.CharterId} not found.");

        var count = await _db.ProjectTasks.CountAsync();
        var taskNumber = $"TSK-{(count + 1):D4}";

        var task = new ProjectTask
        {
            TaskNumber           = taskNumber,
            CharterId            = request.CharterId,
            Title                = request.Title,
            Description          = request.Description,
            ProjectObjectiveGoal = request.ProjectObjectiveGoal,
            StatusId             = request.StatusId,
            PriorityId           = request.PriorityId,
            Requestor            = request.Requestor,
            RequestorEmail       = request.RequestorEmail,
            Department           = request.Department,
            Team                 = request.Team,
            Urgency              = request.Urgency,
            AssignedToUserId     = request.AssignedToUserId,
            PrimaryResourceLoad  = request.PrimaryResourceLoad,
            DueDate              = request.DueDate,
            TravelNeeded         = request.TravelNeeded,
            ScopeCreep           = request.ScopeCreep,
            ProjectFolderDirectory = request.ProjectFolderDirectory,
            CreatedByUserId      = request.CreatedByUserId,
            ModifiedByUserId     = request.CreatedByUserId,
        };

        _db.ProjectTasks.Add(task);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = task.TaskId },
            new { task.TaskId, task.TaskNumber });
    }

    // PATCH api/tasks/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeTaskStatusRequest request)
    {
        var task = await _db.ProjectTasks.FindAsync(id);
        if (task is null) return NotFound();

        task.StatusId        = request.StatusId;
        task.ModifiedAt      = DateTimeOffset.UtcNow;
        task.ModifiedByUserId = request.ChangedByUserId;

        if (request.StatusId == 6) // Complete
            task.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // PATCH api/tasks/{id}/assign
    [HttpPatch("{id}/assign")]
    public async Task<IActionResult> Assign(int id, [FromBody] AssignTaskRequest request)
    {
        var task = await _db.ProjectTasks.FindAsync(id);
        if (task is null) return NotFound();

        task.AssignedToUserId    = request.AssignedToUserId;
        task.PrimaryResourceLoad = request.ResourceLoad;
        task.ModifiedAt          = DateTimeOffset.UtcNow;
        task.ModifiedByUserId    = request.ChangedByUserId;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE api/tasks/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Archive(int id, [FromBody] ArchiveTaskRequest request)
    {
        var task = await _db.ProjectTasks.FindAsync(id);
        if (task is null) return NotFound();

        task.IsArchived       = true;
        task.ArchivedDate     = DateTimeOffset.UtcNow;
        task.ArchivedByUserId = request.ArchivedByUserId;
        task.ModifiedAt       = DateTimeOffset.UtcNow;
        task.ModifiedByUserId = request.ArchivedByUserId;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateTaskRequest(
    int CharterId,
    string Title,
    string? Description,
    string? ProjectObjectiveGoal,
    int StatusId,
    int PriorityId,
    string? Requestor,
    string? RequestorEmail,
    string? Department,
    string? Team,
    string? Urgency,
    int? AssignedToUserId,
    string? PrimaryResourceLoad,
    DateOnly? DueDate,
    bool TravelNeeded,
    bool ScopeCreep,
    string? ProjectFolderDirectory,
    int CreatedByUserId
);

public record ChangeTaskStatusRequest(int StatusId, int ChangedByUserId);
public record AssignTaskRequest(int? AssignedToUserId, string? ResourceLoad, int ChangedByUserId);
public record ArchiveTaskRequest(int ArchivedByUserId);
