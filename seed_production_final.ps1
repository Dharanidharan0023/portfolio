$baseUrl = "https://portfolio-backend-n6fi.onrender.com/api"
$username = "admin"
$password = "password123"

Write-Host "Logging in..."
$loginBody = @{ username = $username; password = $password } | ConvertTo-Json
try {
    $loginResp = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResp.token
    Write-Host "Successfully logged in."
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

function Post-Data($path, $item) {
    $url = "$baseUrl/$path"
    $json = $item | ConvertTo-Json -Depth 10
    Write-Host "Posting to $url..."
    try {
        $resp = Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
        Write-Host "SUCCESS" -ForegroundColor Green
        return $resp
    } catch {
        Write-Host "ERROR on $url" -ForegroundColor Red
        if ($_.Exception.Response) {
            $status = $_.Exception.Response.StatusCode
            Write-Host "Status Code: $status"
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $respBody = $reader.ReadToEnd()
            Write-Host "Response Body: $respBody"
        } else {
            Write-Host "Exception: $($_.Exception.Message)"
        }
    }
}

# 1. Profile
Write-Host "`n--- Seeding Profile ---"
$profileData = @{
    fullName = "Dharanidharan.k"
    title = "Full Stack Developer"
    bio = "B Tech Information System student at Alpha College Of Engineering. Full Stack Developer with experience in Java, JavaScript, Python, Spring Boot, and .NET. Passionate about building scalable applications and exploring AI innovations."
    avatarUrl = "" # Add if available
    resumeUrl = "" # Add if available
}
Post-Data "Profiles" $profileData

# 2. About
Write-Host "`n--- Seeding About ---"
$aboutData = @{
    description = "I am a Full Stack Developer currently pursuing B.Tech in Information System. I have a strong foundation in both frontend and backend technologies, with a focus on creating efficient, user-centric solutions. I enjoy collaborating in teams and am always eager to learn new technologies."
    highlights = "Java, Spring Boot, .NET, React.js, PostgreSQL"
}
Post-Data "Abouts" $aboutData

# 3. Education
Write-Host "`n--- Seeding Education ---"
$eduData = @{
    institution = "Alpha College Of Engineering"
    degree = "B.tech Information System"
    startDate = "2022-11-01T00:00:00Z"
    endDate = "2026-05-01T00:00:00Z"
    description = "Chennai, Tamilnadu"
    orderIndex = 1
}
Post-Data "Educations" $eduData

# 4. Skills
Write-Host "`n--- Seeding Skills ---"
$skills = @(
    # Languages
    @{ name = "Java"; category = "Languages"; proficiencyLevel = 90; orderIndex = 1 },
    @{ name = "JavaScript"; category = "Languages"; proficiencyLevel = 85; orderIndex = 2 },
    @{ name = "TypeScript"; category = "Languages"; proficiencyLevel = 80; orderIndex = 3 },
    @{ name = "Python"; category = "Languages"; proficiencyLevel = 75; orderIndex = 4 },
    # Frontend
    @{ name = "HTML"; category = "Frontend"; proficiencyLevel = 95; orderIndex = 5 },
    @{ name = "CSS"; category = "Frontend"; proficiencyLevel = 90; orderIndex = 6 },
    @{ name = "React.js"; category = "Frontend"; proficiencyLevel = 85; orderIndex = 7 },
    # Backend
    @{ name = "Springboot"; category = "Backend"; proficiencyLevel = 80; orderIndex = 8 },
    @{ name = ".NET"; category = "Backend"; proficiencyLevel = 80; orderIndex = 9 },
    # Database
    @{ name = "SQL"; category = "Database"; proficiencyLevel = 85; orderIndex = 10 },
    @{ name = "PostgreSQL"; category = "Database"; proficiencyLevel = 85; orderIndex = 11 },
    @{ name = "MySQL"; category = "Database"; proficiencyLevel = 80; orderIndex = 12 },
    # Tools
    @{ name = "Git"; category = "Tools & Platforms"; proficiencyLevel = 90; orderIndex = 13 },
    @{ name = "REST APIs"; category = "Tools & Platforms"; proficiencyLevel = 90; orderIndex = 14 },
    @{ name = "Canva"; category = "Tools & Platforms"; proficiencyLevel = 70; orderIndex = 15 }
)
foreach ($s in $skills) { Post-Data "Skills" $s }

# 5. Projects
Write-Host "`n--- Seeding Projects ---"
$projects = @(
    @{
        title = "Service Booking App"
        description = "Developed REST APIs and database operations for scheduling services. Improved booking efficiency and streamlined the user experience."
        techStack = "PostgreSQL, Spring Boot, React"
        orderIndex = 1
        isPublished = $true
    },
    @{
        title = "MultiMart E-commerce website"
        description = "Built a scalable, responsive e-commerce platform with modern UI/UX. Implemented secure checkout and product management flow."
        techStack = "React, SQL, .Net Core"
        orderIndex = 2
        isPublished = $true
    }
)
foreach ($p in $projects) { Post-Data "Projects" $p }

# 6. Experience
Write-Host "`n--- Seeding Experience ---"
$expData = @{
    company = "Conprg Technology"
    role = "Full Stack web Developer intern"
    startDate = "2025-06-01T00:00:00Z"
    endDate = "2025-08-01T00:00:00Z"
    description = "Designed and developed full-stack web applications. Collaborated with the team to implement new features and optimize existing code."
    orderIndex = 1
}
Post-Data "Experiences" $expData

# 7. Achievements
Write-Host "`n--- Seeding Achievements ---"
$achievements = @(
    @{ title = "Java with SpringBoot"; issuer = "Naanmudhalvan"; dateAchieved = "2024-01-01T00:00:00Z"; orderIndex = 1; isPublished = $true },
    @{ title = "Cisco Packet Tracer"; issuer = "Cisco Networking Academy"; dateAchieved = "2024-01-01T00:00:00Z"; orderIndex = 2; isPublished = $true },
    @{ title = "Microsoft Office Essentials"; issuer = "Naanmudhalvan"; dateAchieved = "2024-01-01T00:00:00Z"; orderIndex = 3; isPublished = $true }
)
foreach ($a in $achievements) { Post-Data "Achievements" $a }

# 8. Contacts
Write-Host "`n--- Seeding Contacts ---"
$contacts = @(
    @{ type = "Email"; value = "ksdharanidharan2005@gmail.com"; label = "Email"; orderIndex = 1 },
    @{ type = "Phone"; value = "9500153759"; label = "Phone"; orderIndex = 2 },
    @{ type = "GitHub"; value = "https://github.com/Dharanidharan0023"; label = "GitHub"; orderIndex = 3 },
    @{ type = "LinkedIn"; value = "https://linkedin.com/in/dharanidharan-k0023"; label = "LinkedIn"; orderIndex = 4 }
)
foreach ($c in $contacts) { Post-Data "Contacts" $c }

Write-Host "`nSeeding completed successfully!" -ForegroundColor Cyan
