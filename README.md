# Pinger

Real-time ship monitoring application built with **ASP.NET Core**, **SignalR**, **Angular**, and **NgRx**.

Pinger demonstrates a full-stack architecture featuring:

- Background hosted services
- Real-time WebSocket updates
- Server-side pagination
- EF Core persistence
- Structured frontend state management

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Database](#database)
- [Getting Started](#getting-started-macos)
- [Design Decisions](#design-decisions)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

Pinger simulates and monitors ship status in real time.

The system consists of:

### Backend (.NET)

Responsible for:

- Ship persistence
- Background ping processing
- Real-time SignalR notifications
- RESTful CRUD endpoints
- Server-side pagination

### Frontend (Angular)

Responsible for:

- State management via NgRx
- WebSocket integration
- Administrative ship management
- Real-time display updates

The project is intentionally structured as an architectural showcase rather than a simple CRUD demo.

---

## Architecture

### Backend (ASP.NET Core)

#### Controllers
- `ShipController` – REST endpoints for CRUD and pagination

#### SignalR
- `DisplayHub` – Pushes ship status updates to connected clients

#### Background Services
- `ShipBackgroundPingService` – Hosted service orchestrating ship ping logic

#### Services
- `ShipStatusService`
- `ShipQueryService`
- `NotifierService`

#### Interfaces
- `IShipStatusService`
- `IShipStatusMaintenance`
- `IShipPingRequester`
- `IShipQueryService`

#### Persistence
- EF Core
- SQLite
- Migrations included for schema reproducibility

#### DTO Strategy
Clear separation between:
- `ShipCreateDto`
- `ShipUpdateDto`
- `ShipDto`
- `ShipStatusDto`

This prevents over-posting and enforces strict API contracts.

---

### Frontend (Angular + NgRx)

#### State Management
- Actions
- Reducers
- Selectors
- Effects
- Entity adapter usage

State includes:
- Ship entity state
- Pagination metadata
- Loading flags
- UI state (recently added/edited tracking)

#### Real-Time Updates
- `ship.socket.service.ts` connects to `DisplayHub`
- SignalR events dispatch NgRx actions
- Reducers update normalized state

#### UI Components
- Admin CRUD interface
- Real-time display view
- Modal workflows
- Pagination component

---

## Key Features

- Hosted `BackgroundService` orchestration
- Real-time synchronization using SignalR
- Configurable server-side pagination
- DTO-based API boundaries
- Clean separation of domain, service, and transport layers
- EF Core migrations included
- Seed configuration via `appsettings`

---

## Technology Stack

### Backend
- .NET 8
- ASP.NET Core
- SignalR
- EF Core
- SQLite
- NSwag (TypeScript client generation)

### Frontend
- Angular 19
- NgRx
- RxJS
- TypeScript

---

## Database

- SQLite for lightweight development
- Migrations included
- Database files excluded from repository
- Schema reproducible via:

```bash
dotnet ef database update


## Getting Started (macOS)

### Prerequisites

Install via Homebrew where applicable.

#### Required Tools

- .NET SDK
- Node.js (LTS)
- Angular CLI
- EF Core CLI tools

---

### Install .NET

```bash
brew install --cask dotnet-sdk
```

### Install EF CLI

```bash
dotnet tool install --global dotnet-ef
```

### Install Node

```bash
brew install node
```

### Install Angular CLI

```bash
npm install -g @angular/cli
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url>
cd pinger
```

### 2. Backend Setup

```bash
cd PingApp
dotnet restore
dotnet ef database update
dotnet run
```

### 3. Frontend Setup

```bash
cd PingApp/ClientApp
npm install
ng serve
```

Frontend runs at:

```
http://localhost:4200
```

---

## Design Decisions

### Why SignalR?
Event-driven real-time architecture chosen over polling.

### Why NgRx?
Predictable state transitions and scalable state management.

### Why SQLite?
Lightweight development database with migration support.

### Why DTO Separation?
Prevents over-posting and enforces strict API boundaries.

---

## Project Structure

```
PingApp/
 ├── Controllers/
 ├── Hubs/
 ├── ServicesBackend/
 ├── Interfaces/
 ├── DataAndHelpers/
 ├── Models/Dtos/
 ├── Migrations/
 └── ClientApp/
      ├── src/app/components/
      ├── src/app/state/
      ├── src/app/services/
```

---

## Future Improvements

- Replace SQLite with PostgreSQL
- Add authentication layer
- Add integration tests
- Dockerize full stack
- Add CI pipeline

---

## License

Provided for educational and demonstration purposes.
