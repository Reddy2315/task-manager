# Task Manager Backend

Spring Boot REST API for the Task Manager application. It provides JWT authentication, user-specific task storage, status transitions, due date/time persistence, and Swagger documentation.

## Capabilities

- Register users
- Login users
- Generate JWT tokens
- Validate JWT tokens on protected endpoints
- Store users, roles, and tasks in PostgreSQL
- Scope tasks to the authenticated user
- Create, list, update, and delete tasks
- Persist task timing fields:
  - `dueAt`
  - `createdAt`
  - `updatedAt`
- Expose Swagger/OpenAPI UI
- Support CORS for the Angular frontend

## Tech Stack

- Java 21
- Spring Boot 3.5.5
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL JDBC Driver
- JJWT 0.13.0
- Lombok
- Springdoc OpenAPI
- JUnit / Mockito

## Package Structure

```text
com.reddy.taskmanager
  config/       Security, CORS, JWT filter
  controller/   Auth and task REST controllers
  dto/          Auth request/response objects
  entity/       User, Task, Role, Status
  repository/   Spring Data JPA repositories
  service/      Business logic and JWT service
```

## Configuration

The backend is configured through environment variables in `application.yml` and `application-prod.yml`.

Required values:

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

Production profile:

```text
SPRING_PROFILES_ACTIVE=prod
```

Important: use `prod`, not `application-prod`, as the Spring profile name.

## Run

```bash
mvn spring-boot:run
```

The API starts at:

```text
http://localhost:8080/api
```

## Test and Package

```bash
mvn test
mvn -DskipTests package
```

## API Endpoints

Base path:

```text
/api
```

Authentication:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a user and return JWT |
| POST | `/auth/login` | Authenticate user and return JWT |

Tasks:

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/tasks` | Required | List current user's tasks |
| POST | `/tasks` | Required | Create task for current user |
| PUT | `/tasks/{id}` | Required | Update owned task |
| DELETE | `/tasks/{id}` | Required | Delete owned task |

Swagger UI:

```text
http://localhost:8080/api/swagger-ui/index.html
```

Health endpoint:

```text
http://localhost:8080/api/actuator/health
```

## Task Model

Main fields:

```text
id
title
description
status
dueDate
dueAt
createdAt
updatedAt
owner
```

Statuses:

```text
TODO
IN_PROGRESS
DONE
```

`createdAt` and `updatedAt` are managed by JPA lifecycle hooks.

## Security

- `/auth/**`, Swagger, and API docs paths are public.
- `/tasks/**` requires role `USER`.
- JWT tokens are passed as:

```text
Authorization: Bearer <token>
```

The JWT subject is the username.

## Database Notes

Hibernate is configured with:

```text
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

This allows Hibernate to create or update the required PostgreSQL schema during development/deployment. For a larger production system, replace this with explicit database migrations after the schema stabilizes.
