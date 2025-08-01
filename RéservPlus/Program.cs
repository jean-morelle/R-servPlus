using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using RéservPlus.Infrastructure.Repositories;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Infrastructure.Data;
using RéservPlus.Application.Services;
using RéservPlus.Application.Mappings;
using Microsoft.Extensions.DependencyInjection;
using RéservPlus.Application.Interfaces;
using RéservPlus.Application.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Ajouter les services MVC
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.MaxDepth = 32;
    });

// Configuration JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

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
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["OAuth:Google:ClientId"] ?? "";
        options.ClientSecret = builder.Configuration["OAuth:Google:ClientSecret"] ?? "";
    })
    .AddFacebook(options =>
    {
        options.AppId = builder.Configuration["OAuth:Facebook:AppId"] ?? "";
        options.AppSecret = builder.Configuration["OAuth:Facebook:AppSecret"] ?? "";
    });

builder.Services.AddAuthorization(options =>
{
    // Politique pour les administrateurs
    options.AddPolicy("RequireAdmin", policy =>
        policy.RequireRole("Admin"));
    
    // Politique pour les prestataires
    options.AddPolicy("RequirePrestataire", policy =>
        policy.RequireRole("Admin", "Prestataire"));
    
    // Politique pour les utilisateurs authentifiés
    options.AddPolicy("RequireUser", policy =>
        policy.RequireRole("Admin", "User", "Prestataire"));
});

// Ajouter Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "RéservPlus API",
        Version = "v1",
        Description = "API pour l'application de réservation RéservPlus"
    });

    // Configuration Swagger pour JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            Array.Empty<string>()
        }
    });
});

// Configuration de la base de données
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configuration AutoMapper
//builder.Services.AddAutoMapper(typeof(ServiceMapping), typeof(PrestataireMapping));
// Correction for the AutoMapper configuration issue
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps(AppDomain.CurrentDomain.GetAssemblies());
});
//builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
// Enregistrement des repositories
builder.Services.AddScoped(typeof(IRepertory<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IPrestataireRepository, PrestataireRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPaiementRepository, PaiementRepository>();
builder.Services.AddScoped<IDisponibiliteRepository, DisponibiliteRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Enregistrement des services
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IPrestataireService, PrestataireService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPaiementService, PaiementService>();
builder.Services.AddScoped<IDisponibiliteService, DisponibiliteService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IExternalAuthService, ExternalAuthService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Configuration HttpClient pour l'authentification externe
builder.Services.AddHttpClient();

// Configuration CORS pour Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200",
                "http://localhost:52533",
                "https://localhost:52533"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true); // Temporaire pour le développement
        });
});

var app = builder.Build();

// Configuration Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "RéservPlus API V1");
    });
}

// Configuration CORS - DOIT être en premier
app.UseCors("AllowAngular");

app.UseHttpsRedirection();

// Configuration du routage
app.UseRouting();

// Configuration de l'authentification et autorisation
app.UseAuthentication();
app.UseAuthorization();

// Configuration des contrôleurs
app.MapControllers();

// Endpoint de test
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi()
.WithTags("Test");

// Initialisation de la base de données et création de l'admin par défaut
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
    
    try
    {
        Console.WriteLine("🔧 Initialisation de la base de données...");
        
        // Créer la base de données si elle n'existe pas
        context.Database.EnsureCreated();
        Console.WriteLine("✅ Base de données créée/connectée avec succès.");
        
        // Créer un utilisateur administrateur par défaut s'il n'existe pas
        var adminEmail = "admin@reservplus.com";
        var existingAdmin = await userService.GetByEmailAsync(adminEmail);
        
        if (existingAdmin == null)
        {
            Console.WriteLine("👤 Création de l'utilisateur administrateur...");
            var adminUser = new CreateUserDto
            {
                Nom = "Administrateur",
                Prenom = "Système",
                Email = adminEmail,
                MotDePasse = "Admin123!",
                Role = "Admin",
                EstActif = true
            };
            
            await userService.CreateAsync(adminUser);
            Console.WriteLine("✅ Utilisateur administrateur créé avec succès!");
            Console.WriteLine($"📧 Email: {adminEmail}");
            Console.WriteLine("🔑 Mot de passe: Admin123!");
        }
        else
        {
            Console.WriteLine("✅ L'utilisateur administrateur existe déjà.");
            Console.WriteLine($"📧 Email: {existingAdmin.Email}");
            Console.WriteLine($"👤 Nom: {existingAdmin.Prenom} {existingAdmin.Nom}");
            Console.WriteLine($"🔐 Rôle: {existingAdmin.Role}");
        }
        
        Console.WriteLine("🚀 Application prête à recevoir des requêtes!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erreur lors de l'initialisation: {ex.Message}");
        Console.WriteLine($"📋 Type d'erreur: {ex.GetType().Name}");
        
        if (ex.InnerException != null)
        {
            Console.WriteLine($"🔍 Erreur interne: {ex.InnerException.Message}");
        }
    }
}

app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}