# Backend Services (Job Project)

This `backend` folder contains the Node.js/Express microservices for the Job project. Each domain is implemented as an independent service under `services/`, and an API Gateway under `gateway/` is used as the single public entry point.

## Contents

- [Folder Structure](#folder-structure)
- [Services Overview](#services-overview)
- [Dependencies](#dependencies)
- [Getting Started](#getting-started)
- [Running the Services](#running-the-services)
- [Environment Variables](#environment-variables)
- [Development Notes](#development-notes)
- [API Reference](#api-reference)
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
    notification/          # Kafka consumer for notifications (email, etc.)
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
    kafka/                 # Kafka client, topics, producers/consumers (where used)
    server.js              # Service entry point
```

> **Note:** Not every subfolder exists in every service (for example, `middlewares/` and `services/` are only present where needed).

## Services Overview

- **Gateway (`gateway`)**:
  - Single entry point for clients.
  - Proxies requests to downstream services via `http-proxy-middleware`.
  - Adds security headers (`helmet`), CORS, logging (`morgan`), and rate limiting (`express-rate-limit`).
  - Performs JWT verification for protected routes before forwarding.
- **Application service (`services/application`)**: Handles application-level operations and job applications. Integrates with Kafka to consume/publish application-related domain events.
- **Auth service (`services/auth`)**: Manages user registration, login, logout, and profile; issues JWTs. Contains an `env.example` file for reference and uses Kafka for user/job/application domain events.
- **Jobs service (`services/jobs`)**: Manages job-related data such as postings, listings, and related queries. Publishes job-related events to Kafka (for example on job creation).
- **Notification service (`services/notification`)**: Consumes Kafka domain events (user/job/application created) and triggers notifications (e.g. email).
- **User service (`services/user`)**: Manages user accounts, profiles, and related user data.

All services are standard Node.js applications using:

- **Runtime**: Node.js (ES modules via `"type": "module"`)
- **Core stack**: `express`, `dotenv`, `pg` (PostgreSQL driver where needed)
- **Security & auth**: `bcrypt`, `jsonwebtoken`, `helmet`, role-based middlewares

## Dependencies

Each package is self-contained with its own `package.json`. This section summarizes the key runtime dependencies.

- **Gateway (`backend/gateway`)**
  - **express**: HTTP server and routing for the gateway.
  - **cors**: Cross-Origin Resource Sharing support.
  - **dotenv**: Loads environment variables from `.env`.
  - **express-rate-limit**: Basic rate limiting for DoS protection.
  - **helmet**: Security HTTP headers.
  - **http-proxy-middleware**: Proxies requests from the gateway to downstream services.
  - **jsonwebtoken**: Verifies JWTs on protected routes.
  - **morgan**: HTTP request logging.

- **Auth service (`backend/services/auth`)**
  - **express**: HTTP server and routing.
  - **cors**: Enable cross-origin requests from clients.
  - **dotenv**: Loads environment variables (DB URL, JWT secret, etc.).
  - **pg**: PostgreSQL client for user storage.
  - **bcrypt**: Password hashing for secure credential storage.
  - **cookie-parser**: Parses cookies when needed.
  - **jsonwebtoken**: Issues JWTs on login/register and validates them in protected routes.
  - **kafkajs**: Kafka client used to produce and consume auth/user/job domain events.
  - **redis**: Backing store for rate limiting and related features.

- **User service (`backend/services/user`)**
  - **express**: HTTP server and routing.
  - **dotenv**: Loads environment variables.
  - **pg**: PostgreSQL client for user profile data.
  - **axios**: HTTP client (e.g. to call other services if needed).

- **Jobs service (`backend/services/jobs`)**
  - **express**: HTTP server and routing.
  - **dotenv**: Loads environment variables.
  - **pg**: PostgreSQL client for job data.
  - **redis**: In-memory datastore used for rate limiting.
  - **kafkajs**: Kafka client used to publish and consume job-related events.

- **Application service (`backend/services/application`)**
  - **express**: HTTP server and routing.
  - **dotenv**: Loads environment variables.
  - **pg**: PostgreSQL client for application data.
  - **jsonwebtoken**: Used to validate or inspect JWTs when handling job applications.
  - **kafkajs**: Kafka client used for application-related events.

> **Infrastructure**
>
> A `docker-compose.yml` file is provided under `backend/` to spin up Postgres and Redis locally:
>
> - **postgres**: `postgres:15` exposed on `5432` with default credentials (see compose file).
> - **redis**: `redis:7` exposed on `6379`. Services connect using `REDIS_URL` (e.g. `redis://localhost:6379`).
> - **zookeeper**: `confluentinc/cp-zookeeper` exposed on `2181` for Kafka coordination.
> - **kafka**: `confluentinc/cp-kafka:7.4.0` exposed on `9092`. Services connect using `KAFKA_BROKER` (defaults to `localhost:9092` in code).

## Getting Started

1. **Prerequisites**
   - Node.js 18+ (recommended)
   - A running PostgreSQL instance
   - Kafka (for event-driven features) — easiest via `backend/docker-compose.yml`

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

# User service (default PORT 8080; set PORT to match gateway if using gateway routing)
cd ../user
node src/server.js

# Jobs service (default PORT 8080; set PORT to match gateway if using gateway routing)
cd ../jobs
node src/server.js

# Application service (default PORT 8080; set PORT to match gateway if using gateway routing)
cd ../application
node src/server.js

# Notification service (default PORT 3000; consumes Kafka topics)
cd ../notification
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

**Important:** Service `src/server.js` files currently default to `PORT=8080` when `PORT` is not set. If you want to use the gateway routing as configured above, set ports explicitly per service, for example:

```bash
# example: run services on ports matching gateway config
PORT=8080 node backend/services/auth/src/server.js
PORT=8081 node backend/services/user/src/server.js
PORT=8082 node backend/services/jobs/src/server.js
PORT=8083 node backend/services/application/src/server.js
```

Alternatively, update `gateway/src/config/index.js` to point to whatever ports your services are using.

## Environment Variables

Each service expects its own `.env` file in its root (same level as `package.json`). Typical variables include:

- Database connection string(s)
- JWT secret and token expiration settings (for the auth service)
- Ports and hostnames for each service
 - Redis connection URL for rate limiting (where applicable)
 - Kafka broker URL (e.g. `KAFKA_BROKER=localhost:9092`)

The gateway also has its own `.env` file. **Important:** the `JWT_SECRET` value used by the gateway must match the one used by the auth service so that tokens issued by auth can be validated at the gateway.

Consult the `env.example` file in `services/auth` as a reference and mirror similar keys for the other services and the gateway as needed.

## Development Notes

- Code is organized by domain per service and by layer within `src/` (config, controllers, models, routes, etc.).
- SQL scripts live in `src/sql/` for each service; database access is commonly wired through modules in `src/config/`.
- Routes in `src/routes/` mount controllers and middlewares, and `src/server.js` is the entry point that boots the Express app for each service.
- Kafka-related code (clients, topics, producers/consumers) lives under `src/kafka/` in services that integrate with Kafka.

### Kafka events (current)

Kafka is used for emitting/consuming domain events. Current topics referenced in code include:

- `user.created`
- `job.created`
- `application.created`

The `notification` service subscribes to all three and dispatches to handlers under `services/notification/src/handler/`.
- The API Gateway (`gateway/`):
  - Uses `src/server.js` to configure security, logging, rate limiting, and mount `src/routes/proxyRoutes.js`.
  - Uses `src/config/index.js` to define base URLs for each downstream service.
  - Uses middleware in `src/middleware/` (e.g. `authMiddleware.js`, `roleMiddleware.js`) for authentication and authorization before proxying.

## API Reference

This section lists all major HTTP APIs, both **service-local** and **via the gateway**.

### Gateway (public entry)

Base URL (default): `http://localhost:8084`

- **Auth (public, no token required)**
  - `POST /auth/register`  
    - Forwards to `auth` service `POST /api/v1/auth/register`.  
    - **Purpose**: Register a new user with `username`, `email`, and `password`.
  - `POST /auth/login`  
    - Forwards to `auth` service `POST /api/v1/auth/login`.  
    - **Purpose**: Log in an existing user and return a JWT plus basic user info.
  - `POST /auth/logout` *(requires `Authorization: Bearer <token>`)*  
    - Forwards to `auth` service `POST /api/v1/auth/logout`.  
    - **Purpose**: Log out the current user (stateless, mostly handled client-side).
  - `GET /auth/profile` *(requires `Authorization: Bearer <token>`)*  
    - Forwards to `auth` service `GET /api/v1/auth/profile`.  
    - **Purpose**: Return the authenticated user’s profile data from the token.

- **Users (protected, token required)**
  - `POST /users`  
    - Forwards to `user` service `POST /api/v1/user/`.  
    - **Purpose**: Create a user profile record linked to an auth user.
  - `GET /users/:auth_id`  
    - Forwards to `user` service `GET /api/v1/user/:auth_id`.  
    - **Purpose**: Get a user profile by its associated auth user ID.
  - `PUT /users/:auth_id`  
    - Forwards to `user` service `PUT /api/v1/user/:auth_id`.  
    - **Purpose**: Update a user profile by auth user ID.
  - `DELETE /users/:auth_id`  
    - Forwards to `user` service `DELETE /api/v1/user/:auth_id`.  
    - **Purpose**: Delete a user profile by auth user ID.

- **Jobs (protected, token required)**
  - `GET /jobs`  
    - Forwards to `jobs` service `GET /api/v1/jobs/`.  
    - **Purpose**: List all jobs (or filtered set, depending on controller logic).
  - `GET /jobs/search`  
    - Forwards to `jobs` service `GET /api/v1/jobs/search`.  
    - **Purpose**: Search jobs based on query parameters (e.g. title, location).
  - `GET /jobs/:id`  
    - Forwards to `jobs` service `GET /api/v1/jobs/:id`.  
    - **Purpose**: Get a single job by its ID.
  - `POST /jobs` *(recruiter role required)*  
    - Forwards to `jobs` service `POST /api/v1/jobs/`.  
    - **Purpose**: Create a new job posting (restricted to users with role `recruiter`).
  - `PUT /jobs/:id` *(recruiter role required)*  
    - Forwards to `jobs` service `PUT /api/v1/jobs/:id`.  
    - **Purpose**: Update an existing job posting.
  - `DELETE /jobs/:id` *(recruiter role required)*  
    - Forwards to `jobs` service `DELETE /api/v1/jobs/:id`.  
    - **Purpose**: Delete a job posting.

- **Applications (protected, token required)**
  - `GET /applications`  
    - Forwards to `application` service `GET /api/v1/applications/`.  
    - **Purpose**: List job applications (for the current user or all, depending on controller logic).
  - `POST /applications/apply`  
    - Forwards to `application` service `POST /api/v1/applications/apply`.  
    - **Purpose**: Apply for a job (uses the authenticated user from the JWT).

### Auth service (`services/auth`)

Base URL (local, default): `http://localhost:8080`
Base path: `/api/v1/auth`

- `POST /api/v1/auth/register`  
  - **Body**: `{ username, email, password }`  
  - **Purpose**: Create a new auth user, hash password, store in DB, and issue a JWT. Protected by a Redis-backed rate limiter to prevent signup abuse.
- `POST /api/v1/auth/login`  
  - **Body**: `{ email, password }`  
  - **Purpose**: Authenticate user, validate credentials, and issue a JWT and user info. Protected by a Redis-backed rate limiter to throttle repeated login attempts.
- `POST /api/v1/auth/logout` *(JWT required)*  
  - **Purpose**: Invalidate the current session from the app’s perspective (stateless; often just handled client-side).
- `GET /api/v1/auth/profile` *(JWT required)*  
  - **Purpose**: Return the authenticated user information extracted from the token. Also passes through the rate limiter middleware.

### User service (`services/user`)

Base URL (local, default): `http://localhost:8081`
Base path: `/api/v1/user`

- `POST /api/v1/user/`  
  - **Body**: user profile payload (depends on controller implementation).  
  - **Purpose**: Create a user profile linked to an auth user.
- `GET /api/v1/user/:auth_id`  
  - **Purpose**: Fetch a user profile by its `auth_id` (ID from auth service).
- `PUT /api/v1/user/:auth_id`  
  - **Purpose**: Update an existing user profile for the given `auth_id`.
- `DELETE /api/v1/user/:auth_id`  
  - **Purpose**: Delete a user profile for the given `auth_id`.

### Jobs service (`services/jobs`)

Base URL (local, default): `http://localhost:8082`
Base path: `/api/v1/jobs`

- `GET /api/v1/jobs/`  
  - **Purpose**: List jobs (could support pagination/filters).
- `GET /api/v1/jobs/search`  
  - **Purpose**: Search for jobs based on query parameters.
- `GET /api/v1/jobs/:id`  
  - **Purpose**: Retrieve a single job by ID.
- `POST /api/v1/jobs/` *(JWT + recruiter role required)*  
  - **Purpose**: Create a new job posting. Protected by a Redis-backed rate limiter per IP.
- `PUT /api/v1/jobs/:id` *(JWT + recruiter role required)*  
  - **Purpose**: Update an existing job posting.
- `DELETE /api/v1/jobs/:id` *(JWT + recruiter role required)*  
  - **Purpose**: Remove a job posting. Protected by the same Redis-backed rate limiter per IP.

### Application service (`services/application`)

Base URL (local, default): `http://localhost:8083`
Base path: `/api/v1/applications`

- `GET /api/v1/applications/`  
  - **Purpose**: List job applications (e.g. for the current user or globally).
- `POST /api/v1/applications/apply` *(JWT required)*  
  - **Purpose**: Submit a job application for a particular job on behalf of the authenticated user.

## Contributing

- Maintain consistent structure across all services (folders, naming, and patterns).
- When adding a new service, use one of the existing services as a template.
- Keep SQL scripts and schema changes version-controlled under the relevant service’s `src/sql/` directory.

## License

Specify license information for the project here (e.g. MIT, Apache-2.0). If no license is specified, treat the code as proprietary by default.