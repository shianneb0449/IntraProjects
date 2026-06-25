using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IntraProjects.Infrastructure.Persistence;
using IntraProjects.Domain.Entities;

namespace IntraProjects.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChartersController : ControllerBase
{
    private readonly IntraProjectsDbContext _db;

    public ChartersController(IntraProjectsDbContext db)
    {
        _db = db;
    }

    // GET api/charters
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25)
    {
        var query = _db.ProjectCharters
            .Include(c => c.Status)
            .Include(c => c.Priority)
            .Include(c => c.Owner)
            .Include(c => c.Tasks)
            .Where(c => !c.IsArchived);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(c => c.Status.StatusCode == status);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(c =>
                c.Title.Contains(search) ||
                c.CharterNumber.Contains(search) ||
                (c.Department != null && c.Department.Contains(search)));

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new
            {
                c.CharterId,
                c.CharterNumber,
                c.Title,
                c.Department,
                Status = c.Status.DisplayName,
                StatusCode = c.Status.StatusCode,
                Priority = c.Priority.DisplayName,
                PriorityCode = c.Priority.PriorityCode,
                OwnerDisplayName = c.Owner.DisplayName,
                c.StartDate,
                c.TargetDate,
                c.IsArchived,
                c.CreatedAt,
                TaskCount = c.Tasks.Count(t => !t.IsArchived),
                CompletedTaskCount = c.Tasks.Count(t => !t.IsArchived && t.Status.StatusCode == "Complete"),
            })
            .ToListAsync();

        return Ok(new { items, totalCount = total, pageNumber = page, pageSize });
    }

    // GET api/charters/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var charter = await _db.ProjectCharters
            .Include(c => c.Status)
            .Include(c => c.Priority)
            .Include(c => c.Owner)
            .Include(c => c.Tasks).ThenInclude(t => t.Status)
            .Include(c => c.Tasks).ThenInclude(t => t.Priority)
            .Include(c => c.StatusHistory)
            .Where(c => c.CharterId == id && !c.IsArchived)
            .FirstOrDefaultAsync();

        if (charter is null) return NotFound();

        return Ok(new
        {
            charter.CharterId,
            charter.CharterNumber,
            charter.Title,
            charter.Description,
            charter.Department,
            charter.ProblemStatement,
            charter.GoalStatement,
            charter.ProjectApproach,
            Status = charter.Status.DisplayName,
            StatusCode = charter.Status.StatusCode,
            Priority = charter.Priority.DisplayName,
            PriorityCode = charter.Priority.PriorityCode,
            OwnerDisplayName = charter.Owner.DisplayName,
            charter.StartDate,
            charter.TargetDate,
            charter.ActualCloseDate,
            charter.CreatedAt,
            charter.ModifiedAt,
            Tasks = charter.Tasks.Where(t => !t.IsArchived).Select(t => new
            {
                t.TaskId,
                t.TaskNumber,
                t.Title,
                Status = t.Status.DisplayName,
                Priority = t.Priority.DisplayName,
                t.DueDate,
                t.Requestor,
            }),
        });
    }

    // POST api/charters
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCharterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest("Title is required.");

        var count = await _db.ProjectCharters.CountAsync();
        var charterNumber = $"CHR-{(count + 1):D4}";

        var charter = new ProjectCharter
        {
            CharterNumber    = charterNumber,
            Title            = request.Title,
            Department       = request.Department,
            ProblemStatement = request.ProblemStatement,
            GoalStatement    = request.GoalStatement,
            ProjectApproach  = request.ProjectApproach,
            OwnerUserId      = request.OwnerUserId,
            StatusId         = request.StatusId,
            PriorityId       = request.PriorityId,
            StartDate        = request.StartDate,
            TargetDate       = request.TargetDate,
            CreatedByUserId  = request.OwnerUserId,
            ModifiedByUserId = request.OwnerUserId,
        };

        _db.ProjectCharters.Add(charter);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = charter.CharterId }, new { charter.CharterId, charter.CharterNumber });
    }

    // PATCH api/charters/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeStatusRequest request)
    {
        var charter = await _db.ProjectCharters.FindAsync(id);
        if (charter is null) return NotFound();

        var oldStatusId = charter.StatusId;
        charter.StatusId = request.StatusId;
        charter.ModifiedAt = DateTimeOffset.UtcNow;
        charter.ModifiedByUserId = request.ChangedByUserId;

        _db.CharterStatusHistories.Add(new CharterStatusHistory
        {
            CharterId       = id,
            FromStatusId    = oldStatusId,
            ToStatusId      = request.StatusId,
            ChangedByUserId = request.ChangedByUserId,
            Notes           = request.Notes,
        });

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE api/charters/{id} (archive)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Archive(int id, [FromBody] ArchiveRequest request)
    {
        var charter = await _db.ProjectCharters.FindAsync(id);
        if (charter is null) return NotFound();

        charter.IsArchived       = true;
        charter.ArchivedDate     = DateTimeOffset.UtcNow;
        charter.ArchivedByUserId = request.ArchivedByUserId;
        charter.ArchiveReason    = request.Reason;
        charter.ModifiedAt       = DateTimeOffset.UtcNow;
        charter.ModifiedByUserId = request.ArchivedByUserId;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateCharterRequest(
    string Title,
    string? Department,
    string? ProblemStatement,
    string? GoalStatement,
    string? ProjectApproach,
    int OwnerUserId,
    int StatusId,
    int PriorityId,
    DateOnly? StartDate,
    DateOnly? TargetDate
);

public record ChangeStatusRequest(int StatusId, int ChangedByUserId, string? Notes);
public record ArchiveRequest(int ArchivedByUserId, string? Reason);
