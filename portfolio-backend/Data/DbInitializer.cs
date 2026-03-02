using portfolio_backend.Models;
using System;
using System.Linq;

namespace portfolio_backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            var admin = context.Users.FirstOrDefault(u => u.Username == "admin");
            if (admin == null)
            {
                admin = new User
                {
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(admin);
                Console.WriteLine("Seeded default admin user.");
            }
            else
            {
                admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
                context.Users.Update(admin);
                Console.WriteLine("Updated default admin user password.");
            }

            context.SaveChanges();

            // Seed Profile
            if (!context.Profiles.Any())
            {
                context.Profiles.Add(new Profile
                {
                    FullName = "Dharanidharan K",
                    Title = "Full Stack Developer",
                    Bio = "I transform complex problems into elegant, scalable software. Specialized in building high-performance, product-ready applications with .NET Core, Spring Boot, and React.js.",
                    AvatarUrl = "/uploads/dharani.jpg", // We will save the image here
                    ResumeUrl = "/uploads/resume.pdf", // User can upload this later
                    LeadershipTitle = "Cultural President – Student Forum",
                    LeadershipBio = "Led student forum initiatives and cultural events from Sep 2024 to May 2025."
                });
                Console.WriteLine("Seeded Dharanidharan's profile.");
            }

            // Seed About
            if (!context.Abouts.Any())
            {
                context.Abouts.Add(new About
                {
                    Description = "I am a results-driven Full Stack Developer currently pursuing my B.Tech in Information Systems at Alpha College of Engineering (2022–2026). With a strong foundation in Java and SQL, I focus on building efficient, secure, and user-centric web applications. My goal is to build software that solves real-world problems while maintaining high standards of code quality and system performance.",
                    Highlights = "Full Stack Development,System Design,AI-powered Web Applications,Scalable Backend Architecture"
                });
                Console.WriteLine("Seeded about section.");
            }

            // Seed Skills
            if (!context.Skills.Any())
            {
                context.Skills.AddRange(
                    new Skill { Name = "Java", Category = "Languages", ProficiencyLevel = 90, OrderIndex = 1 },
                    new Skill { Name = "SQL", Category = "Languages", ProficiencyLevel = 85, OrderIndex = 2 },
                    new Skill { Name = "React.js", Category = "Frontend", ProficiencyLevel = 90, OrderIndex = 3 },
                    new Skill { Name = "HTML & CSS", Category = "Frontend", ProficiencyLevel = 95, OrderIndex = 4 },
                    new Skill { Name = "Spring Boot", Category = "Backend", ProficiencyLevel = 85, OrderIndex = 5 },
                    new Skill { Name = ".NET Core", Category = "Backend", ProficiencyLevel = 80, OrderIndex = 6 },
                    new Skill { Name = "MySQL", Category = "Database", ProficiencyLevel = 85, OrderIndex = 7 },
                    new Skill { Name = "PostgreSQL", Category = "Database", ProficiencyLevel = 80, OrderIndex = 8 },
                    new Skill { Name = "GitHub", Category = "Tools", ProficiencyLevel = 90, OrderIndex = 9 },
                    new Skill { Name = "Postman", Category = "Tools", ProficiencyLevel = 85, OrderIndex = 10 }
                );
                Console.WriteLine("Seeded skills.");
            }

            // Seed Projects
            if (!context.Projects.Any())
            {
                context.Projects.AddRange(
                    new Project
                    {
                        Title = "Service Booking Application",
                        Description = "**Details:**\n- Developed RESTful APIs for service scheduling and booking management\n- Designed normalized database schema\n- Optimized SQL queries to improve response time\n- Built responsive React UI for better user interaction",
                        ImageUrl = "https://via.placeholder.com/600x400?text=Service+Booking+App",
                        GithubUrl = "https://github.com/Dharanidharan0023",
                        TechStack = "Spring Boot, React, PostgreSQL",
                        OrderIndex = 1,
                        IsPublished = true
                    },
                    new Project
                    {
                        Title = "MultiMart E-Commerce Website",
                        Description = "**Details:**\n- Developed product listing, cart, and checkout system\n- Implemented secure user authentication\n- Optimized database queries\n- Improved performance and responsiveness",
                        ImageUrl = "https://via.placeholder.com/600x400?text=MultiMart",
                        GithubUrl = "https://github.com/Dharanidharan0023",
                        TechStack = "React, .NET Core, SQL",
                        OrderIndex = 2,
                        IsPublished = true
                    }
                );
                Console.WriteLine("Seeded projects.");
            }

            // Seed Experience
            if (!context.Experiences.Any())
            {
                context.Experiences.AddRange(
                    new Experience
                    {
                        Company = "Conprg Technology",
                        Role = "Full Stack Web Developer Intern",
                        StartDate = new DateTime(2025, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                        EndDate = new DateTime(2025, 8, 31, 0, 0, 0, DateTimeKind.Utc),
                        IsCurrent = false,
                        Description = "- Developed full-stack web applications using .NET Core, React.js, and SQL\n- Built and consumed REST APIs\n- Optimized database queries\n- Improved application performance",
                        OrderIndex = 1
                    }
                );
                Console.WriteLine("Seeded experience.");
            }

            // Seed Education
            if (!context.Educations.Any())
            {
                context.Educations.Add(new Education
                {
                    Degree = "B.Tech in Information Systems",
                    Institution = "Alpha College of Engineering, Chennai",
                    StartDate = new DateTime(2022, 11, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc),
                    Description = "Focused on building a strong foundation in information systems and full stack development.",
                    OrderIndex = 1
                });
                Console.WriteLine("Seeded education.");
            }

            // Seed Achievements
            if (!context.Achievements.Any())
            {
                context.Achievements.AddRange(
                    new Achievement
                    {
                        Title = "Smart India Hackathon 2025 – Grand Finale",
                        Issuer = "Ministry of Education & AICTE",
                        DateAchieved = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                        Description = "- National-level innovation challenge\n- Prototype-based solution under time constraints\n- High-pressure team collaboration",
                        Url = "#", // Placeholder for certificate
                        OrderIndex = 1
                    },
                    new Achievement
                    {
                        Title = "Runner-Up – Naan Mudhalvan Hackathon (Level 2)",
                        Issuer = "Naan Mudhalvan",
                        DateAchieved = new DateTime(2024, 12, 1, 0, 0, 0, DateTimeKind.Utc),
                        Description = "Secured runner-up position in Spring Boot development and earned an internship opportunity.",
                        Url = "#",
                        OrderIndex = 2
                    }
                );
                Console.WriteLine("Seeded achievements.");
            }

            // Seed Contacts
            if (!context.Contacts.Any())
            {
                context.Contacts.AddRange(
                    new Contact { Type = "Email", Value = "ksdharanidharan2005@gmail.com", Label = "Professional", OrderIndex = 1 },
                    new Contact { Type = "GitHub", Value = "https://github.com/Dharanidharan0023", Label = "Code", OrderIndex = 2 },
                    new Contact { Type = "LinkedIn", Value = "https://linkedin.com/in/dharanidharan-k0023", Label = "Connect", OrderIndex = 3 }
                );
            }

            context.SaveChanges();
        }
    }
}
