using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapGet("/graph/{number}", (long? number) =>
{
    if (number is null or 0)
    {
        return Results.NotFound();
    }

    List<string> expressions = new List<string>();
    List<string> dots = new List<string>();
    long? highestValue = number;
    for (int i = 0; number != 1; i++)
    {
        long? prevNumber = number;
        number = (number % 2 == 0) ? number / 2 : number * 3 + 1;
        highestValue = (number > highestValue) ? number : highestValue;
        string expr = $"(x - {i})/({i + 1} - {i})=(y - {prevNumber})/({number} - {prevNumber}) \\left\\{{{i} < x < {i + 1}\\right\\}}";
        expressions.Add(expr);
        string dot = $"A=({i}, {prevNumber})";
        dots.Add(dot);
    }
    dots.Add($"A=({expressions.Count()}, 1)");
    return Results.Json(new {expressions, dots, highestValue});
});

app.Run();