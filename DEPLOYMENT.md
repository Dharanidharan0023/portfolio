# Dharanidharan K - Portfolio Website Deployment Guide

This guide provides instructions for deploying the React Frontend and .NET Core Web API Backend.

## 1. Frontend Deployment (Vercel / Netlify)

The React frontend is built using Vite, making it extremely easy to deploy on modern edge networks.

1. Create a GitHub repository and push the `portfolio-frontend` folder.
2. Sign in to Vercel (or Netlify) and import the repository.
3. Configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

*Note: Ensure you update your `axios.js` base URL from `http://localhost:5000/api` to your production backend URL.*

## 2. Backend Deployment (Docker / Azure)

The .NET 8 Web API can be containerized and deployed anywhere.

### Dockerfile Example
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["portfolio-backend.csproj", "."]
RUN dotnet restore "./portfolio-backend.csproj"
COPY . .
RUN dotnet build "portfolio-backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "portfolio-backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "portfolio-backend.dll"]
```

Build and run:
```bash
docker build -t portfolio-backend .
docker run -d -p 8080:80 --name portfolio-api portfolio-backend
```

### Database
You must provision a managed PostgreSQL database (e.g., Supabase, Neon, AWS RDS, Azure Database for PostgreSQL).
Update your `appsettings.Production.json` with the production connection string. Run `dotnet ef database update` against the production database to apply the initial migrations.
