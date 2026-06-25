using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IntraProjects.Infrastructure.Persistence;

namespace IntraProjects.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IntraProjectsDbContext _db;
    public UsersController(IntraProjectsDbContext db) { _db = db; }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string? search)
    {
        var query = _db.AppUsers.Where(u => u.IsActive);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(u =>
                u.DisplayName.Contains(search) ||
                u.SamAccountName.Contains(search) ||
                u.Email.Contains(search));

        var users = await query
            .OrderBy(u => u.DisplayName)
            .Take(20)
            .Select(u => new { u.UserId, u.SamAccountName, u.DisplayName, u.Email, u.Department })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _db.AppUsers.FindAsync(id);
        if (user is null) return NotFound();
        return Ok(new { user.UserId, user.SamAccountName, user.DisplayName, user.Email, user.Department });
    }
}
