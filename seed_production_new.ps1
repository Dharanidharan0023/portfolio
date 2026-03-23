$baseUrl = "https://portfolio-backend-n6fi.onrender.com/api"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJuYmYiOjE3NzM0ODg0NDksImV4cCI6MTc3MzU3NDg0OSwiaWF0IjoxNzczNDg4NDQ5LCJpc3MiOiJodHRwczovL3BvcnRmb2xpby1iYWNrZW5kLW42Zmkub25yZW5kZXIuY29tIiwiYXVkIjoiaHR0cHM6Ly9wb3J0Zm9saW8tYmFja2VuZC1uNmZpLm9ucmVuZGVyLmNvbSJ9.7n9bWv9QJ6YID67V-P_y-eR81xAbYpwWA9uSwXafB4E"

# Use the absolute latest token 
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJuYmYiOjE3NzM0OTAzMzAsImV4cCI6MTc3MzU3NjczMCwiaWF0IjoxNzczNDkwMzMwLCJpc3MiOiJodHRwczovL3BvcnRmb2xpby1iYWNrZW5kLW42Zmkub25yZW5kZXIuY29tIiwiYXVkIjoiaHR0cHM6Ly9wb3J0Zm9saW8tYmFja2VuZC1uNmZpLm9ucmVuZGVyLmNvbSJ9.z4_EaPjA-yCIB-A-yM-o8e34uoxgR5PcGDr199Zi138"

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

Write-Host "Seeding Profile..."
Post-Data "Profiles" @{ fullName = "Dharanidharan.k"; title = "Full Stack Developer"; bio = "B Tech IT. Exploring emerging technologies & AI innovations." }

Write-Host "Seeding About..."
Post-Data "Abouts" @{ description = "I am a software engineer with a deep passion for building high-quality, modern web applications." }

Write-Host "Seeding Education..."
Post-Data "Educations" @{ institution = "Alpha College Of Engineering"; degree = "B.tech Information System"; startDate = "2022-11-01T00:00:00Z"; endDate = "2026-05-01T00:00:00Z"; description = "Chennai, Tamilnadu"; orderIndex = 1 }

Write-Host "Seeding Skills..."
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

Write-Host "Seeding Projects..."
Post-Data "Projects" @{ title = "Service Booking App"; description = "Developed REST APIs and database operations for scheduling services."; techStack = "PostgreSQL, Spring Boot, React"; orderIndex = 1; isPublished = $true }
Post-Data "Projects" @{ title = "MultiMart E-commerce website"; description = "Built a scalable, responsive e-commerce platform with modern UI/UX."; techStack = "React, SQL, .Net Core"; orderIndex = 2; isPublished = $true }

Write-Host "Seeding Experience..."
Post-Data "Experiences" @{ company = "Conprg Technology"; role = "Full Stack web Developer intern"; startDate = "2025-06-01T00:00:00Z"; endDate = "2025-08-01T00:00:00Z"; description = "Designed and developed full-stack web applications."; orderIndex = 1 }

Write-Host "Seeding Achievements..."
Post-Data "Achievements" @{ title = "Java with SpringBoot"; issuer = "Naanmudhalvan"; dateAchieved = "2024-01-01T00:00:00Z"; orderIndex = 1; isPublished = $true }
Post-Data "Achievements" @{ title = "Cisco Packet Tracer"; issuer = "Cisco Networking Academy"; dateAchieved = "2024-01-01T00:00:00Z"; orderIndex = 2; isPublished = $true }
Post-Data "Achievements" @{ title = "Microsoft Office Essentials"; issuer = "Naanmudhalvan"; dateAchieved = "2024-01-01T00:00:00Z"; orderIndex = 3; isPublished = $true }
