using DocuPacker.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DocuPacker Service
var contetRootPath = builder.Environment.ContentRootPath;
var isDevelopment = builder.Environment.IsDevelopment();
builder.Services.AddDocuPacker(options =>
{
    options.InputDir = Path.Combine(contetRootPath, "../Docs/md");
    options.OutputDir = Path.Combine(contetRootPath, "../Docs/json");
    if (isDevelopment)
    {
        options.IndexDir = Path.Combine(contetRootPath, "../TechLogAngularStandalone/src/assets");
    }
    else
    {
        options.IndexDir = Path.Combine(contetRootPath, "../TechLogAngularStandalone/dist/assets");
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
