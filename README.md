# 🏥 Hospital Management System

A full-stack Hospital Management System developed as an interview and portfolio project using **Spring Boot, React, MySQL, Spring Security, JWT, Docker, and GitHub Actions**.

The application provides role-based functionality for managing doctors, patients, doctor availability, and appointments through REST APIs and a React frontend.

---

## 📌 Project Overview

The Hospital Management System is designed to digitize common hospital operations such as:

* User registration and authentication
* Doctor management
* Patient management
* Doctor availability management
* Appointment booking
* Appointment status management
* Role-based access control
* Secure REST APIs
* Containerized application setup

The project follows a layered Spring Boot architecture and uses JWT-based authentication for securing API endpoints.

---

# 🚀 Features

## 🔐 Authentication & Authorization

* User registration
* User login
* JWT authentication
* Password encryption
* Role-based authorization
* Protected REST APIs
* Spring Security integration

### Supported Roles

* `ADMIN`
* `DOCTOR`
* `PATIENT`

---

## 👨‍⚕️ Doctor Management

* Create doctor
* View doctors
* View doctor details
* Update doctor information
* Delete doctor
* Manage doctor availability

---

## 🧑‍🤝‍🧑 Patient Management

* Create patient profile
* View patient details
* Update patient information
* Delete patient
* Patient authentication

---

## 📅 Appointment Management

* Book appointments
* View appointments
* Update appointment information
* Cancel appointments
* Appointment status management
* Doctor availability-based appointment handling

---

## 🕐 Doctor Availability

* Add doctor availability
* View availability
* Update availability
* Manage available dates and timings

---

# 🛠️ Technology Stack

## Backend

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| Java 21         | Programming language           |
| Spring Boot     | Backend framework              |
| Spring Security | Authentication & authorization |
| JWT             | Token-based authentication     |
| Spring Data JPA | Database access                |
| Hibernate       | ORM                            |
| MySQL           | Relational database            |
| Maven           | Dependency management & build  |
| Bean Validation | Request validation             |

## Frontend

| Technology | Purpose               |
| ---------- | --------------------- |
| React      | Frontend framework    |
| JavaScript | Frontend development  |
| HTML/CSS   | UI                    |
| REST API   | Backend communication |

## DevOps / Tools

| Technology                | Purpose                     |
| ------------------------- | --------------------------- |
| Git                       | Version control             |
| GitHub                    | Source code management      |
| Docker                    | Containerization            |
| Docker Compose            | Multi-container application |
| GitHub Actions            | CI/CD workflow              |
| GitHub Container Registry | Docker image registry       |
| Nginx                     | Frontend web server         |

---

# 🏗️ Application Architecture

```text
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │       + Nginx        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │                      │
                    │  Controllers         │
                    │       ↓              │
                    │  Services            │
                    │       ↓              │
                    │  Mappers / DTOs      │
                    │       ↓              │
                    │  Repositories        │
                    └──────────┬───────────┘
                               │
                               │ JPA / Hibernate
                               ▼
                    ┌──────────────────────┐
                    │        MySQL         │
                    └──────────────────────┘
```

---

# 🔐 Authentication Flow

The application uses JWT-based authentication.

```text
User
 │
 ▼
Login
 │
 ▼
Spring Security
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Frontend stores token
 │
 ▼
Bearer Token
 │
 ▼
Protected API
 │
 ▼
JwtAuthenticationFilter
 │
 ▼
Authorize Request
```

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📂 Project Structure

```text
Hospital_Management_system/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── hospital-management-system/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/hms/projectSpringBoot/
│   │       │       └── hospital/
│   │       │           ├── config/
│   │       │           ├── controller/
│   │       │           ├── dto/
│   │       │           ├── entity/
│   │       │           ├── exception/
│   │       │           ├── mapper/
│   │       │           ├── repository/
│   │       │           └── service/
│   │       │
│   │       └── resources/
│   │
│   ├── pom.xml
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# 🧩 Backend Architecture

The backend follows a layered architecture:

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

Additional layers:

```text
Request DTO
     ↓
Mapper
     ↓
Entity
     ↓
Repository
     ↓
Database
```

And for responses:

```text
Database
     ↓
Entity
     ↓
Mapper
     ↓
Response DTO
     ↓
Controller
     ↓
Client
```

This keeps business logic, database access, API models, and HTTP handling separated.

---

# 🗄️ Database

The application uses **MySQL** with **Spring Data JPA / Hibernate**.

Main application entities include:

* User
* Doctor
* Patient
* Appointment
* Doctor Availability

Relationships between entities are handled using JPA/Hibernate mappings.

---

# 🐳 Docker

The project is containerized using Docker.

The application consists of three main containers:

```text
┌──────────────────────┐
│      Frontend        │
│   React + Nginx      │
│       :5173          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Backend        │
│     Spring Boot      │
│       :9091          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        MySQL         │
│       MySQL 8        │
│       :3307          │
└──────────────────────┘
```

Docker Compose creates a shared Docker network so the backend can communicate with MySQL using the service name:

```text
mysql:3306
```

---

# ⚙️ Environment Variables

Sensitive configuration is kept outside the source code.

Create a local `.env` file based on:

```text
.env.example
```

Example:

```env
MYSQL_ROOT_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
```

> Never commit your real `.env` file or database credentials to GitHub.

---

# ▶️ Running the Project Locally

## Prerequisites

Install:

* Java 21
* Maven
* Node.js
* Docker Desktop
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/Sumitdaasss/hospital-management-system.git
```

```bash
cd hospital-management-system
```

---

## 2. Configure environment variables

Create:

```text
.env
```

using:

```text
.env.example
```

Add your local database password and JWT configuration.

---

## 3. Start the complete application with Docker

From the project root:

```bash
docker compose up
```

To rebuild the containers:

```bash
docker compose up --build
```

---

## 4. Open the application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:9091
```

Health check:

```text
http://localhost:9091/actuator/health
```

Expected response:

```json
{
  "status": "UP"
}
```

---

# 🔄 GitHub Actions

The project includes a GitHub Actions workflow for automated CI/CD.

The workflow performs tasks such as:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Backend Build & Test
   │
   ├── Frontend Build
   │
   └── Docker Image Build & Push
            │
            ▼
           GHCR
```

This allows Docker images to be automatically built when changes are pushed to the repository.

---

# 📦 GitHub Container Registry

Docker images are published to GitHub Container Registry.

### Backend

```text
ghcr.io/sumitdaasss/hospital-management-system-backend
```

### Frontend

```text
ghcr.io/sumitdaasss/hospital-management-system-frontend
```

The backend Docker image uses a multi-stage Docker build to separate the Maven build environment from the runtime environment.

The runtime image was optimized from approximately **834 MB to approximately 524 MB locally**, reducing the image size by roughly 37%.

---

# 🩺 Health Monitoring

Spring Boot Actuator is used for application health monitoring.

Health endpoint:

```text
GET /actuator/health
```

This is also useful for container orchestration and deployment health checks.

---

# 🔌 API Overview

The backend provides REST APIs for the major application modules.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Doctors

```text
GET    /api/doctors
POST   /api/doctors
GET    /api/doctors/{id}
PUT    /api/doctors/{id}
DELETE /api/doctors/{id}
```

### Patients

```text
GET    /api/patients
POST   /api/patients
GET    /api/patients/{id}
PUT    /api/patients/{id}
DELETE /api/patients/{id}
```

### Appointments

```text
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/{id}
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
```

### Doctor Availability

```text
GET    /api/doctor-availability
POST   /api/doctor-availability
PUT    /api/doctor-availability/{id}
DELETE /api/doctor-availability/{id}
```

> API paths may vary depending on the current controller mappings in the project.

---

# 🧪 Testing

The project can be built and tested using Maven:

```bash
cd hospital-management-system
```

```bash
mvn clean test
```

To create the Spring Boot JAR:

```bash
mvn clean package
```

---

# 🎯 Learning Objectives

This project was created to demonstrate practical understanding of:

* Java and Spring Boot
* REST API development
* Spring Security
* JWT authentication
* Role-based authorization
* JPA/Hibernate
* MySQL database integration
* DTO and Mapper patterns
* Exception handling
* Input validation
* React frontend development
* Frontend-backend integration
* Docker containerization
* Docker Compose
* Git/GitHub
* GitHub Actions
* GitHub Container Registry
* Environment-based configuration

---

# 📸 Screenshots

Add screenshots of the application here.

Recommended screenshots:

1. Login page
2. Registration page
3. Dashboard
4. Doctor management
5. Patient management
6. Doctor availability
7. Appointment booking
8. Appointment status

Example:

```text
screenshots/
├── login.png
├── register.png
├── dashboard.png
├── doctors.png
├── patients.png
├── availability.png
└── appointments.png
```

Then add them to this README using:

```markdown
![Login](screenshots/login.png)
```

---

# 🚧 Future Improvements

Possible future improvements include:

* Swagger/OpenAPI documentation
* Additional automated tests
* Database migration management with Flyway
* Email notifications
* Appointment reminders
* Improved reporting and analytics
* Cloud deployment

These are future enhancements and are not required for the current project.

---

# 👨‍💻 Author

**Sumit Das**

GitHub:

```text
https://github.com/Sumitdaasss
```

---

# ⭐ Project Summary

The **Hospital Management System** is a full-stack application demonstrating the integration of:

```text
React
   +
Spring Boot
   +
Spring Security + JWT
   +
JPA / Hibernate
   +
MySQL
   +
Docker
   +
GitHub Actions
   +
GHCR
```

The project was developed as a practical **fresher/interview portfolio project** to demonstrate full-stack development, backend API design, authentication, database integration, containerization, and CI/CD fundamentals.
