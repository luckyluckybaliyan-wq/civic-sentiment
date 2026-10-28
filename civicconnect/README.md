# CivicConnect - Municipal Services Portal

A full-stack web app where citizens report civic problems (potholes, broken street lights, water supply, garbage and more), track progress, and read city notices. Municipal staff review complaints, update their status with a note, and publish notices.

**Stack**
- Frontend: React 18 + TypeScript + Vite + React Router
- Backend: Java 17 + Spring Boot 3 (Web, Data JPA, Security, Validation)
- Auth: JWT (stateless) with BCrypt password hashing, roles `CITIZEN` and `ADMIN`
- Database: H2 in-memory by default (zero setup), MySQL optional

## Features

| Area | What it does |
|---|---|
| Citizens | Register, log in, file complaints (category, ward, location, description), see own complaints and the municipality's remarks |
| Admin | View all complaints, filter by status, change status (Submitted, In progress, Resolved, Rejected) with a note, publish and delete notices |
| Public | Home page with live complaint counts, public notice board |
| Security | JWT auth, role-based route protection (frontend and backend), citizens can only open their own complaints |

## Project structure

```
civicconnect/
├── backend/                     Spring Boot API
│   ├── pom.xml
│   └── src/main/
│       ├── resources/application.properties
│       └── java/com/civicconnect/
│           ├── CivicConnectApplication.java
│           ├── config/          SecurityConfig (JWT, CORS, routes), DataSeeder (demo data)
│           ├── security/        JwtService, JwtAuthFilter
│           ├── model/           User, Complaint, Notice + enums
│           ├── repository/      Spring Data JPA repositories
│           ├── dto/             Request/response records (Dtos.java)
│           ├── controller/      Auth, Complaint, Notice, Admin controllers
│           └── exception/       GlobalExceptionHandler (clean JSON errors)
└── frontend/                    React + TypeScript app
    ├── package.json, vite.config.ts, tsconfig.json, index.html
    └── src/
        ├── main.tsx, App.tsx, auth.tsx, api.ts, types.ts, styles.css
        ├── components/          Navbar, ComplaintCard, StatusBadge
        └── pages/               Home, Login, Register, NewComplaint,
                                 MyComplaints, Notices, AdminDashboard
```

## Prerequisites

- JDK 17 or newer
- Maven 3.9+ (or use your IDE's Maven support)
- Node.js 18+ and npm

## Run it

**1. Start the backend** (terminal 1)

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`. The H2 console is at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:civicdb`, user `sa`, empty password).

**2. Start the frontend** (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` calls to the backend, so there is nothing else to configure.

## Demo accounts (created automatically on startup)

| Role | Email | Password |
|---|---|---|
| Citizen | citizen@civic.local | citizen123 |
| Admin | admin@civic.local | admin123 |

Change or remove these in `DataSeeder.java` before any real deployment.

## API reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create citizen account, returns JWT |
| POST | `/api/auth/login` | public | Log in, returns JWT |
| GET | `/api/public/stats` | public | Complaint counts by status |
| GET | `/api/notices` | public | List notices |
| POST | `/api/notices` | admin | Publish notice |
| DELETE | `/api/notices/{id}` | admin | Delete notice |
| POST | `/api/complaints` | logged in | File a complaint |
| GET | `/api/complaints/mine` | logged in | Your complaints |
| GET | `/api/complaints/{id}` | owner or admin | One complaint |
| GET | `/api/admin/complaints?status=` | admin | All complaints, optional status filter |
| PATCH | `/api/admin/complaints/{id}/status` | admin | Update status and remark |

Send the token as `Authorization: Bearer <token>`.

Example:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@civic.local","password":"admin123"}'
```

## Switch to MySQL

1. Create nothing manually; the URL uses `createDatabaseIfNotExist=true`.
2. In `backend/src/main/resources/application.properties`, comment out the H2 block and uncomment the MySQL lines, then set your username and password.
3. Restart the backend. Tables are created automatically (`ddl-auto=update`).

## Configuration

| Setting | Where | Notes |
|---|---|---|
| `JWT_SECRET` | env var or `app.jwt.secret` | Must be 32+ characters. Always override in production |
| `CORS_ORIGIN` | env var or `app.cors.allowed-origin` | Frontend URL, default `http://localhost:5173` |
| `app.jwt.expiration-ms` | application.properties | Default 24 hours |

## Production build

```bash
cd frontend && npm run build        # outputs frontend/dist
cd ../backend && mvn clean package  # outputs backend/target/*.jar
java -jar backend/target/civicconnect-backend-1.0.0.jar
```

Serve `frontend/dist` with any static host (Nginx, Netlify, etc.) and point `/api` to the backend, or set the CORS origin and change `fetch` base URL in `frontend/src/api.ts`.

## Ideas to extend

- Photo upload for complaints
- Map picker for the exact location
- Email or SMS updates when status changes
- Property tax and water bill payments
- Department assignment and officer accounts
- Pagination and search on the admin dashboard

## Troubleshooting

- **Port 8080 busy**: change `server.port` and the proxy target in `frontend/vite.config.ts`.
- **401 errors after restart**: the H2 database resets on restart, so log in again.
- **CORS error**: make sure the frontend runs on the origin set in `app.cors.allowed-origin`.
