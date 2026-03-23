$baseUrl = "https://portfolio-backend-n6fi.onrender.com/api"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJuYmYiOjE3NzM0ODM4MjksImV4cCI6MTc3MzU3MDIyOSwiaWF0IjoxNzczNDgzODI5LCJpc3MiOiJodHRwczovL3BvcnRmb2xpby1iYWNrZW5kLW42Zmkub25yZW5kZXIuY29tIiwiYXVkIjoiaHR0cHM6Ly9wb3J0Zm9saW8tYmFja2VuZC1uNmZpLm9ucmVuZGVyLmNvbSJ9.k-H8fMlyhI79Wlpx8p7wFm_yAn-zPIWE6l3SHuAo7_zR2HoM"

function Post-Data($path, $item) {
    $url = "$baseUrl/$path"
    $json = $item | ConvertTo-Json -Depth 10
    Write-Host "Posting to $url..."
    try {
        Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    } catch {
        Write-Error $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.ReadToEnd()
        }
    }
}

# 1. Profile
$profile = @{
    fullName = "Dharanidharan.k"
    title = "Full Stack Developer"
    bio = "B Tech IT. Exploring emerging technologies & AI innovations. Blogging about software development & personal growth."
    leadershipTitle = "Student Forum – Cultural President"
    leadershipBio = "Sep 2024 – May 2025"
}
Post-Data "Profiles" $profile

# 2. About
$about = @{
    description = "I am a software engineer with a deep passion for building high-quality, modern web applications. With expertise in full-stack development, I strive to create seamless user experiences and robust backend systems."
}
Post-Data "Abouts" $about

# 3. Education
$edu = @{
    institution = "Alpha College Of Engineering"
    degree = "B.tech Information System"
    startDate = "2022-11-01"
    endDate = "2026-05-01"
    description = "Chennai, Tamilnadu"
    orderIndex = 1
}
Post-Data "Educations" $edu

# 4. Skills
$skills = @(
    @{ name = "Java"; category = "Languages"; proficiencyLevel = 90; orderIndex = 1 },
    @{ name = "JavaScript"; category = "Languages"; proficiencyLevel = 85; orderIndex = 2 },
    @{ name = "TypeScript"; category = "Languages"; proficiencyLevel = 80; orderIndex = 3 },
    @{ name = "Python"; category = "Languages"; proficiencyLevel = 75; orderIndex = 4 },
    @{ name = "HTML"; category = "Frontend"; proficiencyLevel = 95; orderIndex = 5 },
    @{ name = "CSS"; category = "Frontend"; proficiencyLevel = 90; orderIndex = 6 },
    @{ name = "React.js"; category = "Frontend"; proficiencyLevel = 85; orderIndex = 7 },
    @{ name = "Springboot"; category = "Backend"; proficiencyLevel = 80; orderIndex = 8 },
    @{ name = ".NET"; category = "Backend"; proficiencyLevel = 80; orderIndex = 9 },
    @{ name = "SQL"; category = "Database"; proficiencyLevel = 85; orderIndex = 10 },
    @{ name = "PostgreSQL"; category = "Database"; proficiencyLevel = 85; orderIndex = 11 },
    @{ name = "MySQL"; category = "Database"; proficiencyLevel = 80; orderIndex = 12 },
    @{ name = "Git"; category = "Tools & Platforms"; proficiencyLevel = 90; orderIndex = 13 },
    @{ name = "REST APIs"; category = "Tools & Platforms"; proficiencyLevel = 90; orderIndex = 14 },
    @{ name = "Canva"; category = "Tools & Platforms"; proficiencyLevel = 70; orderIndex = 15 }
)
foreach ($s in $skills) { Post-Data "Skills" $s }

# 5. Projects
$projects = @(
    @{
        title = "Service Booking App"
        description = "Developed REST APIs and database operations for scheduling services. Improved booking efficiency and streamlined the user experience."
        techStack = "PostgreSQL, Spring Boot, React"
        orderIndex = 1
    },
    @{
        title = "MultiMart E-commerce website"
        description = "Built a scalable, responsive e-commerce platform with modern UI/UX. Implemented secure checkout, product browsing, and optimized navigation for all devices. Designed with performance, scalability, and customer engagement in mind."
        techStack = "React, SQL, .Net Core"
        orderIndex = 2
    }
)
foreach ($p in $projects) { Post-Data "Projects" $p }

# 6. Experience
$exp = @{
    company = "Conprg Technology"
    role = "Full Stack web Developer intern"
    startDate = "2025-06-01"
    endDate = "2025-08-01"
    description = "Designed and developed full-stack web applications using .NET Core, SQL, and React.js. Enhanced system performance by optimizing APIs and database queries."
    orderIndex = 1
}
Post-Data "Experiences" $exp

# 7. Achievements (Courses)
$courses = @(
    @{ title = "Java with SpringBoot"; issuer = "Naanmudhalvan"; dateAchieved = "2024-01-01"; orderIndex = 1 },
    @{ title = "Cisco Packet Tracer"; issuer = "Cisco Networking Academy"; dateAchieved = "2024-01-01"; orderIndex = 2 },
    @{ title = "Microsoft Office Essentials"; issuer = "Naanmudhalvan"; dateAchieved = "2024-01-01"; orderIndex = 3 }
)
foreach ($c in $courses) { Post-Data "Achievements" $c }
