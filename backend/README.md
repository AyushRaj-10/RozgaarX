# Backend Services (Job Project)

This `backend` folder contains the Node.js/Express microservices for the Job project. Each domain is implemented as an independent service under `services/`, with a reserved `gateway/` folder for a future API gateway or aggregation layer.

## Contents

- [Folder Structure](#folder-structure)
- [Services Overview](#services-overview)
- [Getting Started](#getting-started)
- [Running the Services](#running-the-services)
- [Environment Variables](#environment-variables)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

## Folder Structure

```text
backend/
  gateway/                 # Reserved for API gateway (currently empty)
  services/
    application/           # Application-related APIs
    auth/                  # Authentication & authorization APIs
    jobs/                  # Job posting / listing APIs
    user/                  # User profile & account APIs
```

Each service folder currently follows a similar layout:

```text
services/<service-name>/
  env.example?             # Example env file (present in auth)
  node_modules/
  package.json
  package-lock.json
  src/
    config/                # Configuration (e.g. database, app settings)
    controllers/           # Route handlers
    middlewares/           # Custom middleware (present in some services)
    models/                # Database models
    routes/                # Express route definitions
    services/              # Domain/business logic (present in auth, user)
    sql/                   # SQL scripts used by the service
    server.js              # Service entry point
```

> **Note:** Not every subfolder exists in every service (for example, `middlewares/` and `services/` are only present where needed).

## Services Overview

- **Application service (`services/application`)**: Handles general application-level APIs (e.g. high-level operations tying multiple domains together).
- **Auth service (`services/auth`)**: Manages user authentication and authorization, including JWT handling. Contains an `env.example` file for reference.
- **Jobs service (`services/jobs`)**: Manages job-related data such as postings, listings, and related queries.
- **User service (`services/user`)**: Manages user accounts, profiles, and related user data.

All services are standard Node.js applications using:

- **Runtime**: Node.js (ES modules via `"type": "module"`)
- **Core stack**: `express`, `dotenv`, `jsonwebtoken`, `pg` (PostgreSQL driver)

## Getting Started

1. **Prerequisites**
   - Node.js 18+ (recommended)
   - A running PostgreSQL instance

2. **Install dependencies for a service**

   From the repository root:

   ```bash
   cd backend/services/<service-name>
   npm install
   ```

3. **Create your `.env` file**

   - If `env.example` exists (currently in `auth`), copy it:

     ```bash
     cp env.example .env
     ```

   - Adjust database URLs, JWT secrets, and any other required values.

## Running the Services

There is no global orchestrator yet; each service is run individually.

From the repository root:

```bash
cd backend/services/<service-name>
# Option A: if you add/start script to package.json
npm run start

# Option B: run directly with Node (current setup)
node src/server.js
```

Repeat this for each service you want running (`application`, `auth`, `jobs`, `user`).

## Environment Variables

Each service expects its own `.env` file in its root (same level as `package.json`). Typical variables include:

- Database connection string(s)
- JWT secret and token expiration settings (for the auth service)
- Ports and hostnames for each service

Consult the `env.example` file in `services/auth` as a reference and mirror similar keys for the other services as needed.

## Development Notes

- Code is organized by domain per service and by layer within `src/` (config, controllers, models, routes, etc.).
- SQL scripts live in `src/sql/` for each service; database access is commonly wired through modules in `src/config/`.
- Routes in `src/routes/` mount controllers and middlewares, and `src/server.js` is the entry point that boots the Express app.
- The `gateway/` folder is currently empty and reserved for a future API gateway or aggregation service.

## Contributing

- Maintain consistent structure across all services (folders, naming, and patterns).
- When adding a new service, use one of the existing services as a template.
- Keep SQL scripts and schema changes version-controlled under the relevant service’s `src/sql/` directory.

## License

Specify license information for the project here (e.g. MIT, Apache-2.0). If no license is specified, treat the code as proprietary by default.