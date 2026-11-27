using Microsoft.AspNetCore.Mvc;
using NishatPortfolio.Models;
using NishatPortfolio.Services;

namespace NishatPortfolio.Controllers;

[ApiController]
[Route("api/assistant")]
public class AssistantController : ControllerBase
{
    private readonly AssistantService _assistant;

    public AssistantController(AssistantService assistant) => _assistant = assistant;

    /// <summary>POST /api/assistant/ask  { "question": "...", "companion": "Bamboo" }</summary>
    [HttpPost("ask")]
    public ActionResult<AssistantReply> Ask([FromBody] AskRequest request)
    {
        if (request.Question is { Length: > 500 })
            return BadRequest(new { error = "Question is too long (500 characters max)." });

        return Ok(_assistant.Ask(request.Question, request.Companion));
    }
}
