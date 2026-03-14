using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using portfolio_backend.Data;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// ----------------------
// 1️⃣ Configure Web Host for Render/Vercel
// ----------------------
var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ----------------------
// 2️⃣ Add Services
// ----------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Register Email Service
builder.Services.AddTransient<portfolio_backend.Services.IEmailService, portfolio_backend.Services.EmailService>();

// ----------------------
// 3️⃣ Swagger with JWT
// ----------------------
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Portfolio API",
        Version = "v1",
        Description = "Backend API for Portfolio Website"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

// ----------------------
// 4️⃣ Database
// ----------------------
var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPass = Environment.GetEnvironmentVariable("DB_PASSWORD");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");

string finalConnectionString;

if (!string.IsNullOrEmpty(dbHost) && !string.IsNullOrEmpty(dbUser) && !string.IsNullOrEmpty(dbPass) && !string.IsNullOrEmpty(dbName))
{
    finalConnectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass};SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    // Handle Render's "postgres://" or "postgresql://" URL format
    if (!string.IsNullOrEmpty(connectionString) && (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://")))
    {
        var databaseUri = new Uri(connectionString);
        var userInfo = databaseUri.UserInfo.Split(':');
        finalConnectionString = $"Host={databaseUri.Host};Port={databaseUri.Port};Database={databaseUri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
    }
    else
    {
        finalConnectionString = connectionString ?? throw new InvalidOperationException("Database connection string not found.");
    }
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(finalConnectionString));

// ----------------------
// 5️⃣ JWT Authentication
// ----------------------
var jwtKey = builder.Configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key not found");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });

builder.Services.AddAuthorization();

// ----------------------
// 6️⃣ CORS
// ----------------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ----------------------
// 7️⃣ Build App
// ----------------------
var app = builder.Build();

// ----------------------
// 8️⃣ Auto-migrate database on startup
// ----------------------
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        app.Logger.LogInformation("Testing database connection...");
        
        if (db.Database.CanConnect())
        {
            app.Logger.LogInformation("Database connection successful. Running migrations...");
            db.Database.Migrate();
            app.Logger.LogInformation("Database migrations completed successfully.");
        }
        else
        {
            app.Logger.LogError("Database is unreachable. Skipping migrations. Please verify the database server is running and accessible via the specified configuration.");
        }
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while attempting to connect to the database or running migrations.");
    }
}

// ----------------------
// 9️⃣ Middleware & Error Handling
// ----------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler(appError =>
    {
        appError.Run(async context =>
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                error = "Internal Server Error",
                message = "An unexpected error occurred. Please try again later."
            });
        });
    });

    app.UseHsts();
}

// ----------------------
// 9️⃣ Support Reverse Proxy (Render/Vercel)
// ----------------------
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// ----------------------
// 🔟 Middleware Pipeline
// ----------------------
app.UseCors();

app.UseStaticFiles();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// ----------------------
// 1️⃣1️⃣ Map Controllers
// ----------------------
app.MapControllers();

// ----------------------
// 1️⃣2️⃣ Run App with Dynamic Port
// ----------------------
app.Run();