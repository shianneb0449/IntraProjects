using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IntraProjects.Infrastructure.Persistence;

namespace IntraProjects.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupsController : ControllerBase
{
    private readonly IntraProjectsDbContext _db;
    public LookupsController(IntraProjectsDbContext db) { _db = db; }

    [HttpGet("charter-statuses")]
    public async Task<IActionResult> CharterStatuses()
    {
        var data = await _db.CharterStatuses
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new { s.StatusId, s.StatusCode, s.DisplayName, s.IsTerminal })
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("task-statuses")]
    public async Task<IActionResult> TaskStatuses()
    {
        var data = await _db.ProjectTaskStatuses
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new { s.StatusId, s.StatusCode, s.DisplayName, s.IsTerminal })
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("subtask-statuses")]
    public async Task<IActionResult> SubtaskStatuses()
    {
        var data = await _db.SubtaskStatuses
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new { s.StatusId, s.StatusCode, s.DisplayName, s.IsTerminal })
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("priorities")]
    public async Task<IActionResult> Priorities()
    {
        var data = await _db.Priorities
            .OrderBy(p => p.SortOrder)
            .Select(p => new { p.PriorityId, p.PriorityCode, p.DisplayName, p.ColorHex })
            .ToListAsync();
        return Ok(data);
    }
}
