# Backend Services (Job Project)

This `backend` folder contains the Node.js/Express microservices for the Job project. Each domain is implemented as an independent service under `services/`, and an API Gateway under `gateway/` is used as the single public entry point.

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
  gateway/                 # API Gateway (routing, auth, rate limiting)
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

- **Gateway (`gateway`)**:
  - Single entry point for clients.
  - Proxies requests to downstream services via `http-proxy-middleware`.
  - Adds security headers (`helmet`), CORS, logging (`morgan`), and rate limiting (`express-rate-limit`).
  - Performs JWT verification for protected routes before forwarding.
- **Application service (`services/application`)**: Handles application-level operations and job applications.
- **Auth service (`services/auth`)**: Manages user registration, login, logout, and profile; issues JWTs. Contains an `env.example` file for reference.
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

There is no global orchestrator yet; each service and the gateway are run individually.

From the repository root:

```bash
# Auth service (default PORT 8080)
cd backend/services/auth
node src/server.js

# User service (expected via gateway at SERVICES.USER)
cd ../user
node src/server.js

# Jobs service (expected via gateway at SERVICES.JOBS)
cd ../jobs
node src/server.js

# Application service (expected via gateway at SERVICES.APPLICATION)
cd ../application
node src/server.js

# API Gateway (default PORT 8084)
cd ../../gateway
node src/server.js
```

The gateway uses the base URLs defined in `gateway/src/config/index.js`:

```js
export const SERVICES = {
  AUTH: "http://localhost:8080",
  USER: "http://localhost:8081",
  JOBS: "http://localhost:8082",
  APPLICATION: "http://localhost:8083",
};
```

Make sure the services listen on these ports (or update the config accordingly).

## Environment Variables

Each service expects its own `.env` file in its root (same level as `package.json`). Typical variables include:

- Database connection string(s)
- JWT secret and token expiration settings (for the auth service)
- Ports and hostnames for each service

The gateway also has its own `.env` file. **Important:** the `JWT_SECRET` value used by the gateway must match the one used by the auth service so that tokens issued by auth can be validated at the gateway.

Consult the `env.example` file in `services/auth` as a reference and mirror similar keys for the other services and the gateway as needed.

## Development Notes

- Code is organized by domain per service and by layer within `src/` (config, controllers, models, routes, etc.).
- SQL scripts live in `src/sql/` for each service; database access is commonly wired through modules in `src/config/`.
- Routes in `src/routes/` mount controllers and middlewares, and `src/server.js` is the entry point that boots the Express app for each service.
- The API Gateway (`gateway/`):
  - Uses `src/server.js` to configure security, logging, rate limiting, and mount `src/routes/proxyRoutes.js`.
  - Uses `src/config/index.js` to define base URLs for each downstream service.
  - Uses middleware in `src/middleware/` (e.g. `authMiddleware.js`, `roleMiddleware.js`) for authentication and authorization before proxying.

## Contributing

- Maintain consistent structure across all services (folders, naming, and patterns).
- When adding a new service, use one of the existing services as a template.
- Keep SQL scripts and schema changes version-controlled under the relevant service’s `src/sql/` directory.

## License

Specify license information for the project here (e.g. MIT, Apache-2.0). If no license is specified, treat the code as proprietary by default.