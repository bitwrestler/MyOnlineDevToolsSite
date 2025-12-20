# ConversionTools

## TODO

High-level steps
•	Register and enable Blazor Server in Program.cs.
•	Add Blazor host page (_Host.cshtml), App.razor, layout and imports.
•	Replace the Razor Page UI with a Blazor component (Pages/Index.razor) that uses two‑way binding and consumes an IAsyncEnumerable "stream" from the service.
•	Add a small ConversionProgress model and extend IDateTimeConversionService + implementation to provide a ConvertWithProgress async stream.
•	Remove or rename the existing Pages/Index.cshtml and Pages/Index.cshtml.cs to avoid route conflicts (I mark this step below).

-----


using ConversionToolsWeb.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// Register your services (keep existing lifetimes or change if needed)
builder.Services.AddSingleton<IDateTimeParserService, DateTimeParserService>();
builder.Services.AddSingleton<IDateTimeConversionService, DateTimeConversionService>();
builder.Services.AddSingleton<ITimeZoneInfoResolver, TimeZoneInfoResolver>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host"); // Blazor host

app.Run();

-----

<Router AppAssembly="@typeof(App).Assembly">
    <Found Context="routeData">
        <RouteView RouteData="@routeData" DefaultLayout="@typeof(Shared.MainLayout)" />
    </Found>
    <NotFound>
        <p>Sorry, there's nothing at this address.</p>
    </NotFound>
</Router>

---

@inherits LayoutComponentBase

<div class="page">
    <div class="content px-4">
        @Body
    </div>
</div>

-----

@using System.Threading
@using ConversionToolsWeb.Models
@using ConversionToolsWeb.Services
@using Microsoft.AspNetCore.Components
@using Microsoft.AspNetCore.Components.Web

------


namespace ConversionToolsWeb.Models
{
    public class ConversionProgress
    {
        public string Status { get; set; } = string.Empty;
        public string? Kind { get; set; }
        public long? ResultTicks { get; set; }
        public DateTime? ResultDate { get; set; }
        public string? Error { get; set; }
    }
}


-----


using ConversionToolsWeb.Models;
using System.Runtime.CompilerServices;

namespace ConversionToolsWeb.Services
{
    public class DateTimeConversionService : IDateTimeConversionService
    {
        private IDateTimeParserService _dateTimeParserService;

        public DateTimeConversionService(IDateTimeParserService dateTimeParserService)
        {
            _dateTimeParserService = dateTimeParserService;
        }

        public long ToTicks(string dateTime, string timeZoneId)
        {
            return ToTicks(_dateTimeParserService.Parse(dateTime), timeZoneId);
        }

        public long ToTicks(DateTime dateTime, string timeZoneId)
        {
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId)).Ticks;
        }

        public DateTime FromTicks(long ticks, string timeZoneId)
        {
            var utcDateTime = new DateTime(ticks);
            return TimeZoneInfo.ConvertTime(utcDateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
        }

        // Example streaming implementation; yields progress and final result
        public async IAsyncEnumerable<ConversionProgress> ConvertWithProgress(string? dateTime, long? ticks, string timeZoneId, [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            yield return new ConversionProgress { Status = "started" };

            // small simulated work step
            await Task.Delay(200, cancellationToken);
            if (!string.IsNullOrWhiteSpace(dateTime))
            {
                yield return new ConversionProgress { Status = "parsing", Kind = "DateToTicks" };
                await Task.Delay(200, cancellationToken);

                var resultTicks = ToTicks(dateTime, timeZoneId);
                yield return new ConversionProgress { Status = "done", Kind = "DateToTicks", ResultTicks = resultTicks };
            }
            else if (ticks.HasValue)
            {
                yield return new ConversionProgress { Status = "converting", Kind = "TicksToDate" };
                await Task.Delay(200, cancellationToken);

                var resultDate = FromTicks(ticks.Value, timeZoneId);
                yield return new ConversionProgress { Status = "done", Kind = "TicksToDate", ResultDate = resultDate };
            }
            else
            {
                yield return new ConversionProgress { Status = "error", Error = "Provide either a date/time or ticks to convert." };
            }
        }
    }
}

-----

@page "/"
@inject IDateTimeConversionService ConversionService
@inject ITimeZoneInfoResolver TzResolver

<h3>DateTime Conversion Tools (Blazor Server)</h3>

<div class="grid">
    <div>Date/Time</div>
    <div>Ticks</div>
    <div>TimeZone</div>
    <div>Action</div>
</div>

<div class="grid">
    <input @bind="DateEntry" placeholder="Date/Time" id="dateEntry" />
    <input @bind="TicksEntry" type="number" id="ticksEntry" />
    <select @bind="SelectedTimeZone" id="timezoneSelect">
        @foreach (var tz in SupportedTimeZones)
        {
            <option value="@tz">@tz</option>
        }
    </select>
    <button @onclick="StartConvert" disabled="@IsRunning">Convert</button>
</div>

@if (IsRunning)
{
    <p>Converting…</p>
}

<ul>
    @foreach (var p in Progress)
    {
        <li>
            @p.Status
            @if (p.Kind == "DateToTicks" && p.ResultTicks.HasValue)
            {
                <span> — ticks: @p.ResultTicks</span>
            }
            else if (p.Kind == "TicksToDate" && p.ResultDate.HasValue)
            {
                <span> — date: @p.ResultDate</span>
            }
            else if (!string.IsNullOrEmpty(p.Error))
            {
                <span> — error: @p.Error</span>
            }
        </li>
    }
</ul>

@code {
    private string? DateEntry { get; set; }
    private long? TicksEntry { get; set; }
    private string SelectedTimeZone { get; set; } = "UTC";
    private IEnumerable<string> SupportedTimeZones => TzResolver.SupportedTimeZones;
    private List<ConversionProgress> Progress { get; } = new();
    private bool IsRunning;

    private async Task StartConvert()
    {
        Progress.Clear();
        IsRunning = true;
        StateHasChanged();

        try
        {
            await foreach (var item in ConversionService.ConvertWithProgress(DateEntry, TicksEntry, SelectedTimeZone, CancellationToken.None))
            {
                Progress.Add(item);
                StateHasChanged(); // ensure UI updates for each streamed item
            }
        }
        finally
        {
            IsRunning = false;
            StateHasChanged();
        }
    }
}



------


•	Delete or rename Pages/Index.cshtml and Pages/Index.cshtml.cs. If you keep them, the Razor Page route and Blazor route for / will conflict.
Notes and recommendations
•	Blazor Server already uses SignalR for the circuit. Using an IAsyncEnumerable<T> from the server service and consuming it in a component as shown provides progressive updates streamed back to the client without a full page refresh.
•	You can refine the streaming model — accept a CancellationToken from the component for user cancellation, or stream finer-grained progress objects.
•	Keep service lifetimes appropriate: stateless services can be Singleton; if you add scoped/per-request state prefer Scoped.
•	Rebuild the project after adding files so the Razor/Blazor compilation picks up new components.
•	If you prefer a migration path, I can:
•	generate all files in your workspace and remove the old Index cshtml files,
•	or show how to cancel an in‑flight conversion from the UI,
•	or adapt the stream to push JSON strings instead of typed model objects.