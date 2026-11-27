using NishatPortfolio.Models;

namespace NishatPortfolio.Services;

/// <summary>
/// Answers visitor questions from the CV using keyword matching.
/// Swap Ask() for an LLM call later if you want free-form answers.
/// </summary>
public class AssistantService
{
    private record Entry(string[] Keys, string Answer, string? Action = null);

    private static readonly Entry[] Knowledge =
    {
        new(new[] { "ecosense", "iot", "climate", "environment", "sensor", "esp32", "arduino", "ieee", "icrpset", "accepted", "rajshahi" },
            "EcoSense is an IoT-based environmental monitoring station for smart climate observation, built with ESP32/Arduino and environmental sensors. It's accepted for presentation at IEEE 9th ICRPSET-2026, University of Rajshahi (Sept 2026). Co-author: Anindo Mahmood. Supervisor: Md Sajid Hossain."),
        new(new[] { "heart", "catboost", "xgboost", "disease", "uci", "kaggle", "best", "accuracy", "model", "compare", "result" },
            "Ema compared Logistic Regression, Random Forest, XGBoost and CatBoost on the UCI Heart Disease and a Kaggle dataset. Best so far: CatBoost 90.76%, then XGBoost 89.13%, with LR and RF at 88.59%. The manuscript is under revision for resubmission."),
        new(new[] { "maternal", "pregnan", "shap", "explain", "6,103", "6103", "svm", "knn", "proposal" },
            "The maternal health proposal applies KNN, Random Forest, SVM and XGBoost to a 6,103-record dataset, with hyperparameter tuning, stratified cross-validation and SHAP for explainability. Supervisor: Sharfuddin Mahmood (ML course, AIUB)."),
        new(new[] { "thesis", "next", "future", "goal", "plan", "graduate", "masters", "phd" },
            "Next is an AI/ML-focused thesis. Long term, Ema wants to use data science and AI on meaningful problems in healthcare and the environment."),
        new(new[] { "interest", "area", "topic", "field", "focus" },
            "Research interests: Machine Learning, AI, Data Mining, Computer Vision & Pattern Recognition, Information Systems, Healthcare Prediction, Environmental Monitoring and LLMs for Software Engineering."),
        new(new[] { "education", "university", "aiub", "cgpa", "gpa", "degree", "credit", "semester", "school", "college" },
            "B.Sc. in CSE (Information Systems) at AIUB, final year, CGPA 3.62 with 119 of 148 credits. GPA 5.00 in both HSC and SSC (Science)."),
        new(new[] { "skill", "language", "python", "tool", "stack", "programming" },
            "Python, R, C, C++, C#, Java, JavaScript and PHP; regression, trees & ensembles, SVM and k-NN; MySQL, SQL Server, Oracle, MongoDB; OpenGL; ESP32/Arduino; Git, Colab, Kaggle and Overleaf."),
        new(new[] { "cv", "resume", "download", "pdf" },
            "You can download Ema's full CV as a PDF with the Download CV button in the top bar. I've started the download for you.", "download-cv"),
        new(new[] { "weather", "telegram", "bot" },
            "WeatherStation trains separate models for temperature, humidity and rain and serves forecasts through a Telegram bot. Ema fixed an event-loop blocking bug that caused timeouts."),
        new(new[] { "workpulse", "task management", "php", "mysql" },
            "WorkPulse is a role-based task manager (Admin, Manager, Team Leader, Employee) in PHP/MySQL with authentication, released as v1.0.0 by a team of three."),
        new(new[] { "wayfinder", "tourism" },
            "WayFinder is a responsive HTML5/CSS3 website for exploring Bangladesh tourism, with home, login and sign-up pages, built with Git as a team of three."),
        new(new[] { "opengl", "graphics", "cox", "beach" },
            "Waves of Cox's Bazar is an OpenGL/GLUT 2D simulation of the world's longest natural sea beach, with changing weather, landmarks, transitions and synced audio."),
        new(new[] { "hrms", "hr management", "c#", "desktop", "oop" },
            "The HR Management System is a C# Windows Forms app on a SQL database, built with OOP principles for OOP 2 with Mohammad Sohanur Rahman and Anindo Mahmood."),
        new(new[] { "cert", "certificate", "workshop", "webinar" },
            "Certifications: Figma Design System and Personal Branding in AI Era (Grameenphone Academy), Python Essentials 1 and IT Essentials (Cisco). Workshops via AIUB R&D Club on LaTeX, research writing, Erasmus Mundus and research basics."),
        new(new[] { "contact", "email", "reach", "collaborat", "linkedin", "github", "hire" },
            "Email ntasnimema01521@gmail.com, or reach Ema on LinkedIn or GitHub (Nishat-Tasnim-Ema). Reference: Md Sajid Hossain, Senior Assistant Professor, AIUB."),
        new(new[] { "who are you", "panda", "rabbit", "robot", "companion", "bamboo", "hops" },
            "I'm {name}, Ema's robot research companion. You can switch me between Panda and Rabbit at the top of my desk, drag me anywhere, or press ⌖ to have me follow your cursor."),
        new(new[] { "hello", "hi", "hey", "salam" },
            "Hello! Ask me about EcoSense, the heart-disease models, the maternal health study, or Ema's thesis plans."),
    };

    private const string Fallback =
        "That isn't in Ema's notes yet. Try EcoSense, heart-disease models, maternal health, projects, skills, thesis plans or her CV.";

    public AssistantReply Ask(string? question, string? companion)
    {
        if (string.IsNullOrWhiteSpace(question))
            return new AssistantReply(Fallback, null);

        var text = " " + question.Trim().ToLowerInvariant() + " ";
        Entry? best = null;
        var bestScore = 0;

        foreach (var entry in Knowledge)
        {
            var score = 0;
            foreach (var key in entry.Keys)
            {
                // Short keys ("cv", "hi", "c#") must match a whole word.
                var hit = key.Length < 4
                    ? text.Contains(" " + key + " ") || text.Contains(" " + key + "?")
                    : text.Contains(key);
                if (hit) score += key.Length;
            }
            if (score > bestScore) { bestScore = score; best = entry; }
        }

        if (best is null) return new AssistantReply(Fallback, null);

        var name = string.IsNullOrWhiteSpace(companion) ? "Bamboo" : companion.Trim();
        return new AssistantReply(best.Answer.Replace("{name}", name), best.Action);
    }
}
