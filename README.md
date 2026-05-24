# Task Manager

A full-stack task management application with a Spring Boot API and an Angular Material frontend. The app supports secure authentication, personal task boards, status-based workflow, due date reminders, and a polished split-panel dashboard experience.

## Highlights

- JWT based register/login flow
- Owner-scoped task management
- Create, view, update status, reopen, and delete tasks
- Split dashboard layout with left control panel and right task workspace
- Calendar based due date selection with hour, minute, and AM/PM controls
- Live clock with day, date, time, and seconds
- In-app due-task alerts
- Optional browser notifications for reminders
- Responsive Angular Material UI
- PostgreSQL persistence, including Neon-hosted PostgreSQL support
- Swagger/OpenAPI UI for backend API exploration

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 20, Angular Material, RxJS, TypeScript |
| Backend | Java 21, Spring Boot 3.5.5, Spring Security, Spring Data JPA |
| Auth | JWT using JJWT |
| Database | PostgreSQL |
| API Docs | Springdoc OpenAPI / Swagger UI |

## Project Structure

```text
taskmanager/
  backend/              Spring Boot REST API
  task-manager-ui/      Angular frontend
  README.md             Full project documentation
```

## Application Flow

1. User registers or logs in.
2. Backend returns a JWT.
3. Frontend stores the token in `localStorage` as `tm_token`.
4. Auth interceptor sends the token on protected API requests.
5. Users manage only their own tasks.
6. Tasks can be scheduled with `dueAt`; the UI shows due state and reminders.

## Run Locally

### Backend

From `backend/`:

```bash
mvn spring-boot:run
```

Required environment variables:

```text
PORT=8080
SPRING_SERVER_CONTEXT_PATH=/api
SPRING_SERVER_ALLOWED_ORIGINS=http://localhost:4200
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>/<database>?sslmode=require
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
APP_JWT_SECRET=<at-least-32-character-secret>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

For `application-prod.yml`, use:

```text
SPRING_PROFILES_ACTIVE=prod
```

Backend runs at:

```text
http://localhost:8080/api
```

Swagger UI:

```text
http://localhost:8080/api/swagger-ui/index.html
```

### Frontend

From `task-manager-ui/`:

```bash
npm install
npm start
```

Frontend runs at:

```text
http://localhost:4200
```

## API Overview

Base URL:

```text
http://localhost:8080/api
```

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register and receive a JWT |
| POST | `/auth/login` | No | Login and receive a JWT |
| GET | `/tasks` | Yes | List current user's tasks |
| POST | `/tasks` | Yes | Create a task |
| PUT | `/tasks/{id}` | Yes | Update a task owned by current user |
| DELETE | `/tasks/{id}` | Yes | Delete a task owned by current user |

Task statuses:

```text
TODO
IN_PROGRESS
DONE
```

Task timing fields:

```text
dueAt      Local date/time selected by the user for reminders
createdAt  Set automatically when the task is created
updatedAt  Set automatically when the task is updated
```

## Reminder Behavior

The frontend supports two reminder layers:

- In-app reminders: due tasks appear in the dashboard alert stack.
- Browser notifications: optional notifications after the user enables reminder permission.

Reminder preference is stored in:

```text
localStorage.tm_reminders_enabled
```

The app must be open in the browser for client-side reminders to run. A future production upgrade could move reminder delivery to a backend scheduler, queue, or email/push notification service.

## Useful Commands

Backend:

```bash
cd backend
mvn test
mvn -DskipTests package
```

Frontend:

```bash
cd task-manager-ui
npm start
npm run build
npx ng build --configuration development
```

## Documentation

- Backend details: [backend/README.md](backend/README.md)
- Frontend details: [task-manager-ui/README.md](task-manager-ui/README.md)

## Notes

- `ddl-auto=update` is used so PostgreSQL tables/columns are created during development and deployment.
- Use a strong `APP_JWT_SECRET`; JJWT requires an HMAC key with sufficient length.
- The frontend currently points to `http://localhost:8080/api` in its services.
