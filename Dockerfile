# ============================================================
# Stage 1 - Build Angular frontend
# ============================================================
FROM node:24-alpine AS frontend-build

WORKDIR /src/PingApp/ClientApp

# Copy dependency files first to make use of Docker layer caching
COPY PingApp/ClientApp/package*.json ./

RUN npm ci

# Copy frontend source
COPY PingApp/ClientApp/ ./

# Build Angular for production
RUN npm run build


# ============================================================
# Stage 2 - Build ASP.NET Core backend
# ============================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build

WORKDIR /src

# Copy project file first so restore can be cached
COPY PingApp/PingApp.csproj PingApp/

RUN dotnet restore PingApp/PingApp.csproj

# Copy backend source
COPY PingApp/ PingApp/

# Publish ASP.NET Core application
RUN dotnet publish PingApp/PingApp.csproj \
    -c Release \
    -o /app/publish \
    --no-restore \
    -p:SkipSpaBuild=true 

# Copy Angular production files into the published application's wwwroot
COPY --from=frontend-build \
    /src/PingApp/ClientApp/dist/ping-app/browser/ \
    /app/publish/wwwroot/


# ============================================================
# Stage 3 - Runtime
# ============================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=backend-build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "PingApp.dll"]