using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IntraProjects.Infrastructure.Persistence;
using IntraProjects.Domain.Entities;

namespace IntraProjects.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubtasksController : ControllerBase
{
    private readonly IntraProjectsDbContext _db;

    public SubtasksController(IntraProjectsDbContext db)
    {
        _db = db;
    }

    // GET api/subtasks?taskId=1
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? taskId,
        [FromQuery] int? charterId,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25)
    {
        var query = _db.Subtasks
            .Include(s => s.Status)
            .Include(s => s.Priority)
            .Include(s => s.Task)
            .Include(s => s.Charter)
            .Include(s => s.AssignedTo)
            .Where(s => !s.IsArchived);

        if (taskId.HasValue)
            query = query.Where(s => s.TaskId == taskId.Value);

        if (charterId.HasValue)
            query = query.Where(s => s.CharterId == charterId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(s => s.Status.StatusCode == status);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                s.SubtaskId,
                s.SubtaskNumber,
                s.TaskId,
                TaskNumber            = s.Task.TaskNumber,
                TaskTitle             = s.Task.Title,
                s.CharterId,
                CharterNumber         = s.Charter.CharterNumber,
                CharterTitle          = s.Charter.Title,
                s.Title,
                Status                = s.Status.DisplayName,
                StatusCode            = s.Status.StatusCode,
                Priority              = s.Priority.DisplayName,
                s.Requestor,
                s.Urgency,
                AssignedToDisplayName = s.AssignedTo != null ? s.AssignedTo.DisplayName : null,
                s.DueDate,
                s.TravelNeeded,
                s.ScopeCreep,
                s.ApprovalStatus,
                s.CreatedAt,
            })
            .ToListAsync();

        return Ok(new { items, totalCount = total, pageNumber = page, pageSize });
    }

    // GET api/subtasks/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var subtask = await _db.Subtasks
            .Include(s => s.Status)
            .Include(s => s.Priority)
            .Include(s => s.Task)
            .Include(s => s.Charter)
            .Include(s => s.AssignedTo)
            .Where(s => s.SubtaskId == id && !s.IsArchived)
            .FirstOrDefaultAsync();

        if (subtask is null) return NotFound();

        return Ok(new
        {
            subtask.SubtaskId,
            subtask.SubtaskNumber,
            subtask.TaskId,
            TaskNumber            = subtask.Task.TaskNumber,
            subtask.CharterId,
            CharterNumber         = subtask.Charter.CharterNumber,
            subtask.Title,
            subtask.Description,
            subtask.ProjectObjectiveGoal,
            Status                = subtask.Status.DisplayName,
            StatusCode            = subtask.Status.StatusCode,
            Priority              = subtask.Priority.DisplayName,
            subtask.Requestor,
            subtask.RequestorEmail,
            subtask.Department,
            subtask.Urgency,
            AssignedToDisplayName = subtask.AssignedTo?.DisplayName,
            subtask.DueDate,
            subtask.TravelNeeded,
            subtask.ScopeCreep,
            subtask.ApprovalStatus,
            subtask.NextStepSummary,
            subtask.StalledBy,
            subtask.StalledReason,
            subtask.CreatedAt,
            subtask.ModifiedAt,
        });
    }

    // POST api/subtasks
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubtaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest("Title is required.");

        var task = await _db.ProjectTasks.FindAsync(request.TaskId);
        if (task is null)
            return BadRequest($"Task {request.TaskId} not found.");

        var count = await _db.Subtasks.CountAsync();
        var subtaskNumber = $"SUB-{(count + 1):D4}";

        var subtask = new Subtask
        {
            SubtaskNumber        = subtaskNumber,
            TaskId               = request.TaskId,
            CharterId            = task.CharterId,
            Title                = request.Title,
            Description          = request.Description,
            ProjectObjectiveGoal = request.ProjectObjectiveGoal,
            StatusId             = request.StatusId,
            PriorityId           = request.PriorityId,
            Requestor            = request.Requestor,
            RequestorEmail       = request.RequestorEmail,
            Department           = request.Department,
            Urgency              = request.Urgency,
            AssignedToUserId     = request.AssignedToUserId,
            PrimaryResourceLoad  = request.PrimaryResourceLoad,
            DueDate              = request.DueDate,
            TravelNeeded         = request.TravelNeeded,
            ScopeCreep           = request.ScopeCreep,
            CreatedByUserId      = request.CreatedByUserId,
            ModifiedByUserId     = request.CreatedByUserId,
        };

        _db.Subtasks.Add(subtask);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = subtask.SubtaskId },
            new { subtask.SubtaskId, subtask.SubtaskNumber });
    }

    // PATCH api/subtasks/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeSubtaskStatusRequest request)
    {
        var subtask = await _db.Subtasks.FindAsync(id);
        if (subtask is null) return NotFound();

        subtask.StatusId         = request.StatusId;
        subtask.ModifiedAt       = DateTimeOffset.UtcNow;
        subtask.ModifiedByUserId = request.ChangedByUserId;

        if (request.StatusId == 6)
            subtask.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE api/subtasks/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Archive(int id, [FromBody] ArchiveSubtaskRequest request)
    {
        var subtask = await _db.Subtasks.FindAsync(id);
        if (subtask is null) return NotFound();

        subtask.IsArchived       = true;
        subtask.ArchivedDate     = DateTimeOffset.UtcNow;
        subtask.ModifiedAt       = DateTimeOffset.UtcNow;
        subtask.ModifiedByUserId = request.ArchivedByUserId;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateSubtaskRequest(
    int TaskId,
    string Title,
    string? Description,
    string? ProjectObjectiveGoal,
    int StatusId,
    int PriorityId,
    string? Requestor,
    string? RequestorEmail,
    string? Department,
    string? Urgency,
    int? AssignedToUserId,
    string? PrimaryResourceLoad,
    DateOnly? DueDate,
    bool TravelNeeded,
    bool ScopeCreep,
    int CreatedByUserId
);

public record ChangeSubtaskStatusRequest(int StatusId, int ChangedByUserId);
public record ArchiveSubtaskRequest(int ArchivedByUserId);
