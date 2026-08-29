# 🏥 Hospital Management System

A full-stack **Hospital Management System** built with **Spring Boot, Spring Security, JWT, MySQL, React, Vite, and Tailwind CSS**.

The system provides separate interfaces and functionality for **Patients, Doctors, and Administrators**, including authentication, doctor management, appointment booking, doctor availability, and appointment status management.

---

## 🚀 Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Role-based authorization
* Protected frontend routes
* Spring Security integration
* Separate access for Admin, Doctor, and Patient

### 👨‍⚕️ Doctor Features

* Doctor dashboard
* Doctor profile management
* View appointments
* Manage appointment status
* Manage availability
* View appointment details

### 🧑‍🤝‍🧑 Patient Features

* Patient dashboard
* Patient profile
* View available doctors
* View doctor details
* Book appointments
* Select available date and time slots
* View appointments
* Track appointment status
* View appointment details

### 👨‍💼 Admin Features

* Admin dashboard
* Manage doctors
* Manage patients
* View doctor details
* View patient details
* Manage appointments
* View appointment details
* Manage doctor availability

---

# 🛠️ Technologies Used

## Backend

* Java 21
* Spring Boot 3.5.5
* Spring Web
* Spring Data JPA
* Hibernate
* Spring Security
* JWT
* MySQL
* Lombok
* Maven
* Bean Validation

## Frontend

* React 18
* Vite
* React Router
* Axios
* Tailwind CSS
* Lucide React
* JavaScript

---

# 📁 Project Structure

```text
Hospital_Management_system/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   └── doctors/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── hospital-management-system/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── .gitignore
└── README.md
```

---

# ⚙️ Prerequisites

Make sure the following are installed:

* Java 21
* Maven
* MySQL
* Node.js
* npm
* Git

Check your installations:

```bash
java -version
mvn -version
node -v
npm -v
git --version
```

---

# 🗄️ Database Setup

Create the MySQL database:

```sql
CREATE DATABASE hospital_management_system;
```

Then configure your database credentials in:

```text
hospital-management-system/src/main/resources/application.properties
```

Example:

```properties
server.port=9090

spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management_system
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=YOUR_JWT_SECRET
jwt.expiration=86400000
```

> **Important:** Never commit your real database password or production JWT secret to GitHub. Use environment variables or a local configuration file for sensitive values.

---

# ▶️ Running the Backend

Navigate to the backend directory:

```bash
cd hospital-management-system
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:9090
```

---

# ▶️ Running the Frontend

Open another terminal and navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔗 Frontend ↔ Backend

The React frontend communicates with the Spring Boot REST API using **Axios**.

The frontend API configuration is located in:

```text
Frontend/src/services/api.js
```

The backend is configured to accept requests from the frontend through CORS configuration.

Default setup:

```text
Frontend
http://localhost:5173

        │
        │ REST API / Axios
        ▼

Backend
http://localhost:9090

        │
        ▼

MySQL
hospital_management_system
```

---

# 🔑 Authentication Flow

The application uses **JWT authentication**.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Spring Security
 │
 ▼
JWT Token
 │
 ▼
Frontend stores authentication information
 │
 ▼
Axios sends Bearer Token
 │
 ▼
Protected Backend API
```

Authenticated requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 👥 User Roles

The application supports three main roles:

| Role    | Main Responsibilities                                   |
| ------- | ------------------------------------------------------- |
| ADMIN   | Manage doctors, patients, appointments and availability |
| DOCTOR  | Manage profile, availability and appointments           |
| PATIENT | View doctors and book/manage appointments               |

---

# 📅 Appointment System

Patients can:

1. View available doctors
2. Open doctor details
3. Select an available date
4. Select an available time slot
5. Book an appointment
6. View appointment details
7. Track appointment status

Appointment information can include:

* Patient
* Doctor
* Date
* Time
* Status
* Appointment details

Typical appointment statuses include:

```text
BOOKED
CANCELLED
COMPLETED
```

---

# 🩺 Doctor Availability

Doctors can manage their available time slots.

The availability system allows patients to see suitable dates and time slots before booking an appointment.

```text
Doctor
   │
   ▼
Set Availability
   │
   ▼
Available Date / Time
   │
   ▼
Patient
   │
   ▼
Book Appointment
```

---

# 🌐 Main Backend URL

```text
http://localhost:9090
```

Example authentication endpoint:

```http
POST /api/auth/register
POST /api/auth/login
```

Other API endpoints are organized according to their respective resources such as:

```text
/api/doctors
/api/patients
/api/appointments
/api/availability
```

---

# 🧪 Testing

The backend REST APIs can be tested using:

* Postman
* Insomnia
* Frontend application

For protected endpoints, provide the JWT token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📦 Build Commands

## Backend

```bash
cd hospital-management-system
mvn clean package
```

Run the generated application:

```bash
java -jar target/hospital-management-system-0.0.1-SNAPSHOT.jar
```

## Frontend

```bash
cd Frontend
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🔒 Security Notes

Do not commit sensitive information such as:

```text
Database passwords
JWT secrets
API keys
.env files
Production credentials
```

Recommended `.gitignore` entries:

```gitignore
# Node
node_modules/
dist/

# Environment files
.env
.env.*
!.env.example

# Java / Maven
target/

# IntelliJ IDEA
.idea/
*.iml

# Logs
*.log
```

---

# 📌 Future Improvements

Possible future enhancements include:

* Email notifications
* Password reset
* Doctor search and filtering
* Prescription management
* Medical records
* Payment integration
* Admin analytics
* Appointment reminders
* Docker deployment
* Cloud deployment
* Production database configuration

---

# 👨‍💻 Project

**Hospital Management System**

A full-stack application designed to simplify hospital operations by connecting patients, doctors, and administrators through a centralized web application.

---

## ⭐ If you find this project useful

Consider giving the repository a ⭐ on GitHub.
