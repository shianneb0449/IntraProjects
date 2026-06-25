using Microsoft.EntityFrameworkCore;
using IntraProjects.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<IntraProjectsDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("IntraProjects"),
        sql => sql.MigrationsAssembly("IntraProjects.Infrastructure")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "https://intra-projects.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
