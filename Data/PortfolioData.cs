using NishatPortfolio.Models;

namespace NishatPortfolio.Data;

/// <summary>
/// All portfolio content in one place. Edit this file to update the site.
/// </summary>
public static class PortfolioData
{
    public static PortfolioViewModel Get() => Model;

    private static readonly PortfolioViewModel Model = new()
    {
        Name = "Nishat Tasnim Ema",
        Eyebrow = "Final-year CSE · Information Systems · AIUB, Dhaka",
        Intro = "I'm Nishat Tasnim Ema, a machine learning researcher and data science student. I clean and explore data carefully, compare models honestly, and explain what the results mean, from IoT climate stations to heart-disease classifiers.",
        LinkedInUrl = "https://www.linkedin.com/in/nishat-tasnim-ema-106a5a2b7",
        GitHubUrl = "https://github.com/Nishat-Tasnim-Ema",

        Stats = new[]
        {
            new Stat("1", "IEEE paper accepted"),
            new Stat("3", "research works"),
            new Stat("7", "projects"),
            new Stat("3.62", "CGPA"),
        },
        HeroTags = new[] { "Python", "R", "XGBoost", "CatBoost", "SHAP", "ESP32", "LaTeX" },

        Focus = new[]
        {
            new FocusArea("Healthcare prediction", "Predicting disease risk from clinical data",
                "Heart-disease detection with gradient-boosted trees, and maternal health risk prediction with SHAP explanations.",
                "Heart-disease manuscript in revision"),
            new FocusArea("Environmental monitoring", "Sensors that read the climate",
                "EcoSense, an ESP32/Arduino station for smart climate observation, plus an ML weather forecaster with a Telegram bot.",
                "EcoSense accepted at IEEE ICRPSET-2026"),
            new FocusArea("Computer vision", "Seeing patterns in images",
                "Computer Vision and Pattern Recognition is my next course, building on the maths I used in OpenGL graphics work.",
                "Starting next semester"),
            new FocusArea("LLMs for SE", "Language models for software engineering",
                "Exploring how large language models can support the way software is designed, written and tested.",
                "Exploring thesis directions"),
        },

        Publications = new[]
        {
            new Publication(PublicationStatus.Accepted, "Sept 2026",
                "EcoSense: IoT-Based Environmental Monitoring Station for Smart Climate Observation",
                "IEEE 9th ICRPSET-2026, University of Rajshahi · accepted for presentation",
                new[]
                {
                    "Designed an IoT-based station that monitors environmental conditions for smart climate observation",
                    "Worked with ESP32/Arduino microcontrollers and environmental sensors",
                },
                new[] { new MetaItem("Co-author", "Anindo Mahmood"), new MetaItem("Supervisor", "Md Sajid Hossain"), new MetaItem("Hardware", "ESP32 · Arduino · sensors") },
                "What is EcoSense?"),
            new Publication(PublicationStatus.InRevision, "Sept 2026",
                "A Comparative Study of Machine Learning Algorithms for Early Detection of Heart Disease",
                "Manuscript under revision for resubmission",
                new[]
                {
                    "Compared Logistic Regression, Random Forest, XGBoost and CatBoost on UCI Heart Disease and a Kaggle dataset",
                    "Best so far: CatBoost at 90.76% accuracy",
                },
                new[] { new MetaItem("Models", "LR · RF · XGBoost · CatBoost"), new MetaItem("Data", "UCI Heart Disease · Kaggle"), new MetaItem("Best", "CatBoost 90.76%") },
                "Best heart-disease model?"),
            new Publication(PublicationStatus.Ongoing, "Oct 2026",
                "Maternal Health Risk Prediction Using Optimised and Cross-Validated Machine Learning Classifiers",
                "Research proposal · Machine Learning course, AIUB",
                new[]
                {
                    "KNN, Random Forest, SVM and XGBoost on a 6,103-record maternal health dataset",
                    "Hyperparameter tuning, stratified cross-validation and SHAP for explainability",
                },
                new[] { new MetaItem("Co-author", "Anindo Mahmood"), new MetaItem("Supervisor", "Sharfuddin Mahmood"), new MetaItem("Data", "6,103 records") },
                "Tell me about the maternal health study"),
        },
        ResearchInterests = "Machine Learning · Artificial Intelligence · Data Mining · Computer Vision & Pattern Recognition · Information Systems · Healthcare Prediction · Environmental Monitoring · LLMs for Software Engineering",

        HeartDiseaseResults = new[]
        {
            new ModelResult("CatBoost", "CatBoost", 90.76),
            new ModelResult("XGBoost", "XGBoost", 89.13),
            new ModelResult("Logistic Regression", "Logistic Reg.", 88.59),
            new ModelResult("Random Forest", "Random Forest", 88.59),
        },
        BaselineModel = "Logistic Regression",

        Projects = new[]
        {
            new Project("WeatherStation", "ML", "Python · Telegram API",
                "Separate ML models predict temperature, humidity and rain; users get a forecast via the /weather command. Fixed an event-loop block that caused timeouts.", "WeatherStation"),
            new Project("Machine Learning Notebooks", "ML", "Python · Colab",
                "Heart-disease prediction, Naive Bayes classification and insurance data analysis.", "MachineLearning"),
            new Project("Data Science Projects", "ML", "R",
                "Cleaning, preprocessing, exploratory analysis, statistics, visualization and model evaluation in R.", "DataScience"),
            new Project("WorkPulse", "Web", "PHP · MySQL · JS",
                "Role-based task management with Admin, Manager, Team Leader and Employee modules, auth and a relational database. v1.0.0, team of three.", "WorkPulse"),
            new Project("WayFinder", "Web", "HTML5 · CSS3",
                "A responsive tourism website exploring Bangladesh, with home, login and sign-up pages, built with Git as a team of three.", null),
            new Project("Waves of Cox's Bazar", "Graphics", "C++ · OpenGL · GLUT",
                "An interactive 2D scene of the world's longest natural sea beach: changing weather, custom orthographic coordinates, transitions and synced audio.", "Graphics-Project"),
            new Project("HR Management System", "Desktop", "C# · SQL",
                "A Windows Forms desktop app on a SQL database, built with encapsulation, inheritance and polymorphism for OOP 2.", "OOP2-Projects"),
        },

        Skills = new[]
        {
            new SkillGroup("Programming", new[] { "Python", "R", "C", "C++", "C#", "Java", "JavaScript", "PHP" }),
            new SkillGroup("Machine learning", new[] { "Linear & logistic regression", "Trees & ensembles", "SVM", "k-NN", "XGBoost", "CatBoost", "SHAP" }),
            new SkillGroup("IoT & hardware", new[] { "ESP32", "Arduino", "Environmental sensors", "Proteus", "Tinkercad" }),
            new SkillGroup("Databases", new[] { "MySQL", "SQL Server", "Oracle", "MongoDB" }),
            new SkillGroup("Development & graphics", new[] { "C# Windows Forms", "HTML5", "CSS3", "PHP", "OpenGL", "GLUT" }),
            new SkillGroup("Tools", new[] { "Git", "GitHub", "VS Code", "Visual Studio", "Google Colab", "Kaggle", "Overleaf", "Linux", "Figma" }),
        },

        CreditsDone = 119,
        CreditsTotal = 148,
        Timeline = new[]
        {
            new TimelineItem("Sept 2026", "EcoSense accepted at IEEE ICRPSET-2026", "First accepted paper, University of Rajshahi.", "--sage"),
            new TimelineItem("Apr 2024 – Jun 2025", "General Member, IEEE AIUB Student Branch", "Research-skill workshops, academic writing and technical seminars.", "--accent"),
            new TimelineItem("Aug 2019 – Dec 2021", "HSC, Barishal Govt. Women's College", "Science · GPA 5.00 / 5.00", "--border2"),
            new TimelineItem("Jan 2016 – Dec 2018", "SSC, Bauphal Adarsha Girls Secondary School", "Science · GPA 5.00 / 5.00", "--border2"),
        },
        Certifications = new[]
        {
            new Credential("Figma Design System", "Grameenphone Academy · Certificate of Excellence", "Nov 2026"),
            new Credential("Python Essentials 1", "Cisco Networking Academy & Python Institute", "Oct 2026"),
            new Credential("Personal Branding in AI Era", "Grameenphone Academy · Certificate of Excellence", "Oct 2026"),
            new Credential("IT Essentials: PC Hardware and Software", "Cisco Networking Academy", "Dec 2023"),
        },
        Workshops = new[]
        {
            new Credential("Getting Started with LaTeX", "Webinar", "7 Nov 2025"),
            new Credential("How to Secure an Erasmus Mundus Scholarship", "Webinar", "8 Sep 2025"),
            new Credential("From Idea to Paper: Research Writing", "Workshop", "21 Aug 2025"),
            new Credential("Unlocking Research: A Beginner's Blueprint", "Webinar", "9 Jul 2025"),
        },

        Contact = new[]
        {
            new ContactItem("Email", "ntasnimema01521@gmail.com", null),
            new ContactItem("GitHub ↗", "Nishat-Tasnim-Ema", "https://github.com/Nishat-Tasnim-Ema"),
            new ContactItem("LinkedIn ↗", "nishat-tasnim-ema", "https://www.linkedin.com/in/nishat-tasnim-ema-106a5a2b7"),
            new ContactItem("Reference", "Md Sajid Hossain, Senior Assistant Professor, AIUB", null),
            new ContactItem("Languages", "Bengali (native) · English (professional)", null),
        },
    };
}
