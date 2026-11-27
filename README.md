# Nishat Tasnim Ema · Research Portfolio (ASP.NET Core MVC)

A research portfolio site with a draggable robot companion (Panda or Rabbit) that answers questions about the CV.

## Run it

Requires the .NET 8 SDK.

```bash
dotnet run
```

Then open http://localhost:5080. In Visual Studio, open `NishatPortfolio.csproj` and press F5.

## Where things live

| What | File |
|---|---|
| All content (papers, projects, skills, timeline, contact) | `Data/PortfolioData.cs` |
| Page markup | `Views/Home/Index.cshtml` |
| Navbar, footer, companion and chat shell | `Views/Shared/_Layout.cshtml` |
| Companion's answers | `Services/AssistantService.cs` |
| Chat API (`POST /api/assistant/ask`) | `Controllers/AssistantController.cs` |
| CV download (`GET /cv`) | `Controllers/HomeController.cs` |
| The CV file | `wwwroot/files/Nishat_Tasnim_Ema_CV.pdf` |
| Styles (light aqua / dark pink themes) | `wwwroot/css/site.css` |
| Interactions (theme, filters, chart, companion, chat) | `wwwroot/js/site.js` |

## Common edits

- **Update the CV:** replace `wwwroot/files/Nishat_Tasnim_Ema_CV.pdf` (keep the file name).
- **Add a project or paper:** add an entry in `Data/PortfolioData.cs`. Filters update automatically.
- **Teach the companion something new:** add an entry to `Knowledge` in `Services/AssistantService.cs`.
- **Change colors:** edit the CSS variables at the top of `wwwroot/css/site.css`
  (`:root,[data-theme=light]` for light mode, `[data-theme=dark]` for dark mode).

## Chat API

```http
POST /api/assistant/ask
Content-Type: application/json

{ "question": "What is EcoSense?", "companion": "Bamboo" }
```

Response:

```json
{ "answer": "EcoSense is an IoT-based ...", "action": null }
```

`action` is `"download-cv"` when the visitor asks for the CV; the page then starts the download.
