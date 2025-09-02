# 📝 Task Manager

A full-stack **Task Manager application** built with **Spring Boot 3 (backend)** and **Angular 17 (frontend)**.  
This project demonstrates clean architecture, REST APIs, JWT authentication, and a modern Angular UI with drag-and-drop task management.

---

## 🚀 Features
- User authentication (Register / Login with JWT)
- Role-based access (User / Admin)
- CRUD operations for tasks (Create, Update, Delete, View)
- Kanban board UI (drag and drop tasks between statuses)
- Search and filter tasks
- Responsive Angular Material design
- REST API with Swagger documentation

---

## 🛠️ Tech Stack
**Backend:**
- Java 21
- Spring Boot 3.5.5
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- PostgreSQL / MySQL / H2 (configurable)
- Swagger / OpenAPI

**Frontend:**
- Angular 17
- Angular Material
- RxJS
- Tailwind CSS (optional)

---

## 📂 Project Structure
task-manager/
├── backend/ # Spring Boot app
│ ├── src/
│ ├── pom.xml
│ └── ...
├── frontend/ # Angular app
│ ├── src/
│ ├── package.json
│ └── ...
└── README.md


---

## ⚙️ Setup & Run

### 1. Clone Repository

> git clone https://github.com/Reddy2315/task-manager.git

>cd task-manager

### 2. Backend (Spring Boot)
> cd backend
##### Update application.yml with your DB credentials
> mvn spring-boot:run

Backend will start on http://localhost:8080

### 3. Frontend (Angular)
> cd frontend

> npm install

> ng serve -o

Frontend will start on http://localhost:4200

### 🔑 Default API Endpoints

- POST /api/auth/register – Register new user
- POST /api/auth/login – Login and get JWT
- GET /api/tasks – Get all tasks
- POST /api/tasks – Create new task
- PUT /api/tasks/{id} – Update task
- DELETE /api/tasks/{id} – Delete task
- API Docs available at: http://localhost:8080/swagger-ui.html


### 🖼️ Screenshots


### 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

### 📜 License

This project is licensed under the MIT License.

---

