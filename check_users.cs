using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL")));

using var host = builder.Build();
using var scope = host.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

var userCount = await db.Users.CountAsync();
Console.WriteLine($"Total users: {userCount}");

var users = await db.Users.ToListAsync();
foreach (var user in users)
{
    Console.WriteLine($"User: {user.Username}, Role: {user.Role}, CreatedAt: {user.CreatedAt}");
}
