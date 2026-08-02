using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using Project_Solutions.Data;
using Project_Solutions.Services.Auth;
using Project_Solutions.Services.Email;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. DATABASE — Connect EF Core to SQL Server using the
//    connection string from appsettings.json
// ==========================================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==========================================================
// 2. CONTROLLERS — Enables attribute-routed Web API controllers
//    (everything in the Controllers/ folder)
// ==========================================================
builder.Services.AddControllers();

// ==========================================================
// 3. CUSTOM SERVICES — Register our own services for
//    dependency injection (JWT + Email)
// ==========================================================
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ==========================================================
// 4. JWT AUTHENTICATION — Reads JWT settings from appsettings.json
//    and configures how incoming tokens are validated
// ==========================================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// Enables [Authorize] attribute checks on controllers/endpoints
builder.Services.AddAuthorization();

// ==========================================================
// 5. SWAGGER — API documentation & testing UI, reachable at
//    runtime (required by the project spec)
// ==========================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Adds the "Authorize" button in Swagger so JWT tokens
    // can be tested directly from the Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
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
                }
            },
            new string[] {}
        }
    });
});

// ==========================================================
// 6. CORS (optional but recommended) — allows the frontend
//    (wwwroot, served from the same app) to call the API
//    without being blocked by the browser
// ==========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==========================================================
// 7. MIDDLEWARE PIPELINE — Order matters here!
// ==========================================================

// Enable Swagger UI (visit /swagger to test endpoints)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Serve static files from wwwroot/ (HTML, CSS, JS — the frontend)
app.UseStaticFiles();

// Apply CORS policy
app.UseCors("AllowAll");

// IMPORTANT: Authentication must come BEFORE Authorization
app.UseAuthentication();   // Who are you? (validates the JWT)
app.UseAuthorization();    // Are you allowed to do this? (checks [Authorize])

// Maps all Controller endpoints (Controllers/ folder)
app.MapControllers();

// ==========================================================
// 8. RUN THE APP
// ==========================================================
app.Run();