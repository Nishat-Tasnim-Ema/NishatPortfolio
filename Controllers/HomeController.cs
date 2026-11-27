using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NishatPortfolio.Data;
using NishatPortfolio.Models;

namespace NishatPortfolio.Controllers;

public class HomeController : Controller
{
    private readonly IWebHostEnvironment _env;

    public HomeController(IWebHostEnvironment env) => _env = env;

    public IActionResult Index() => View(PortfolioData.Get());

    /// <summary>Downloads the CV PDF from wwwroot/files.</summary>
    [HttpGet("/cv")]
    public IActionResult DownloadCv()
    {
        var path = Path.Combine(_env.WebRootPath, "files", "Nishat_Tasnim_Ema_CV.pdf");
        if (!System.IO.File.Exists(path)) return NotFound();
        return PhysicalFile(path, "application/pdf", "Nishat_Tasnim_Ema_CV.pdf");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() =>
        View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
}
