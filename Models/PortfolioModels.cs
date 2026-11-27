namespace NishatPortfolio.Models;

public enum PublicationStatus { Accepted, InRevision, Ongoing }

public record MetaItem(string Label, string Value);

public record Publication(
    PublicationStatus Status,
    string When,
    string Title,
    string Venue,
    IReadOnlyList<string> Points,
    IReadOnlyList<MetaItem> Meta,
    string AskPrompt);

public record FocusArea(string Key, string Heading, string Description, string Now);

public record ModelResult(string Name, string ShortName, double Accuracy);

public record Project(string Title, string Category, string Tag, string Description, string? Repo);

public record SkillGroup(string Name, IReadOnlyList<string> Items);

/// <summary>Tone is a CSS custom property name such as "--sage".</summary>
public record TimelineItem(string When, string Title, string Detail, string Tone);

public record Credential(string Title, string Issuer, string When);

public record Stat(string Value, string Label);

public record ContactItem(string Label, string Value, string? Url);

public class PortfolioViewModel
{
    public required string Name { get; init; }
    public required string Eyebrow { get; init; }
    public required string Intro { get; init; }
    public required string LinkedInUrl { get; init; }
    public required string GitHubUrl { get; init; }
    public required IReadOnlyList<Stat> Stats { get; init; }
    public required IReadOnlyList<string> HeroTags { get; init; }
    public required IReadOnlyList<FocusArea> Focus { get; init; }
    public required IReadOnlyList<Publication> Publications { get; init; }
    public required string ResearchInterests { get; init; }
    public required IReadOnlyList<ModelResult> HeartDiseaseResults { get; init; }
    public required string BaselineModel { get; init; }
    public required IReadOnlyList<Project> Projects { get; init; }
    public required IReadOnlyList<SkillGroup> Skills { get; init; }
    public required IReadOnlyList<TimelineItem> Timeline { get; init; }
    public required IReadOnlyList<Credential> Certifications { get; init; }
    public required IReadOnlyList<Credential> Workshops { get; init; }
    public required IReadOnlyList<ContactItem> Contact { get; init; }
    public int CreditsDone { get; init; }
    public int CreditsTotal { get; init; }
    public int CreditsPercent => CreditsTotal == 0 ? 0 : (int)Math.Round(100.0 * CreditsDone / CreditsTotal);
}

public record AskRequest(string? Question, string? Companion);

public record AssistantReply(string Answer, string? Action);

public class ErrorViewModel
{
    public string? RequestId { get; set; }
    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}
