# Task Manager UI

Angular frontend for the Task Manager application. This UI is built as a responsive Angular Material dashboard that connects to the Spring Boot backend at `http://localhost:8080/api`.

## What This Frontend Provides

- Login and registration screens
- JWT storage in `localStorage`
- Auth interceptor for protected API calls
- Split task dashboard:
  - Left control panel with user, live clock, stats, and reminder controls
  - Right workspace with task board, due alerts, and create-task form
- Add task flow opened from the left-side New Task button
- Calendar date picker with hour, minute, and AM/PM selection
- Task lanes for Todo, In Progress, and Done
- Task status actions:
  - Start
  - Done
  - Reopen
  - Delete
- In-app reminder alerts for due tasks
- Optional browser notifications
- Global footer with project links and author credit
- Profile screen with form validation and local feedback

## Tech Stack

- Angular 20
- Angular Material 20
- RxJS 7
- TypeScript 5.8

## Folder Overview

```text
src/app/
  core/
    auth.service.ts
    auth.interceptor.ts
  shared/
    task.service.ts
  pages/
    board/
    login/
    register/
    profile/
  app.routes.ts
  app.config.ts
  app.html
  app.css
```

## Backend Dependency

The UI expects the backend to run at:

```text
http://localhost:8080/api
```

Current service endpoints:

```text
POST   /auth/login
POST   /auth/register
GET    /tasks
POST   /tasks
PUT    /tasks/{id}
DELETE /tasks/{id}
```

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm start
```

Open:

```text
http://localhost:4200
```

## Build

Production build:

```bash
npm run build
```

Development build:

```bash
npx ng build --configuration development
```

The production build may fetch Google Fonts during optimization. If network access is blocked, use the development build to verify templates and TypeScript.

## Reminder System

The reminder UX is client-side:

- `dueAt` is selected using the calendar/time controls.
- The board schedules timers for due tasks while the app is open.
- Due tasks appear in the in-app alert stack.
- Browser notifications are shown only after the user enables reminders and grants browser permission.
- Users can disable app reminders from the left control panel.

Local storage keys:

```text
tm_token
tm_reminders_enabled
tm_notified_tasks
```

## Important Files

- `src/app/pages/board/board.component/*` - main task board and reminder experience
- `src/app/core/auth.service.ts` - login/register/token helpers
- `src/app/core/auth.interceptor.ts` - attaches JWT token to HTTP requests
- `src/app/shared/task.service.ts` - task API client
- `src/app/app.html` and `src/app/app.css` - global footer

## Known Notes

- The profile screen currently validates and shows local feedback, but no backend profile update endpoint exists yet.
- Browser notifications require the app to be open; backend scheduled notifications would be a future production enhancement.
