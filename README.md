# 🏥 MedCare HMS - Full Stack Hospital Management System

A simple, modern, and professional Full Stack Hospital Management System built with **Angular**, **Bootstrap 5**, **ASP.NET Core Web API (.NET 8)**, **Entity Framework Core**, and **SQL Server**.

---

## 🌟 Key Features

* 🔐 **Authentication & Security**
  * User Registration & Login with Role-based accounts (Admin, Doctor, Receptionist)
  * BCrypt Password Hashing
  * JWT (JSON Web Token) Bearer Authentication
  * Angular Auth Guard & Functional HTTP Interceptors

* 📊 **Interactive Dashboard**
  * Real-time Analytics Metric Cards: Total Doctors, Total Patients, Total Appointments, Today's Appointments
  * Quick action shortcuts
  * Recent 5 Appointments overview table

* 🩺 **Doctor Management (CRUD)**
  * Add, View, Edit, and Delete Doctors
  * Real-time live Search by Name, Specialization, or Department
  * Consultation Fee, Availability, and Experience tracking

* 👥 **Patient Management (CRUD)**
  * Register, View, Edit, and Manage Patient Records
  * Search by Name, Phone, Email, or Blood Group
  * Medical history and contact tracking

* 📅 **Appointment Management (CRUD)**
  * Book appointments linking Patients and Doctors with live dropdowns
  * Date & Time slot scheduling
  * One-click Status Transitions (`Pending` ➔ `Confirmed` ➔ `Completed` ➔ `Cancelled`)
  * Filter by Status and Date

---

## 🛠️ Technology Stack

* **Frontend:** Angular 19+ (Standalone Components, Signals, Reactive Routing)
* **UI & Icons:** Bootstrap 5.3 + Bootstrap Icons + Google Fonts (Poppins)
* **Backend:** ASP.NET Core Web API (.NET 8 LTS)
* **Language:** C# 12
* **ORM:** Entity Framework Core 8 (Code-First Approach)
* **Database:** Microsoft SQL Server
* **Security:** JWT Bearer Authentication & BCrypt.Net-Next
* **API Documentation:** Swagger / OpenAPI with Bearer Authorization

---

## 📁 Project Structure

```text
hospital-management/
│
├── HospitalApi/                  👉 ASP.NET Core Web API Backend
│   ├── Controllers/              👉 API Controllers (Auth, Doctors, Patients, Appointments)
│   ├── Data/                     👉 AppDbContext & Entity Configurations
│   ├── DTOs/                     👉 Data Transfer Objects (Request/Response)
│   ├── Models/                   👉 Database Entities (User, Doctor, Patient, Appointment)
│   ├── Services/                 👉 AuthService & JWT Token Generation
│   ├── Migrations/               👉 EF Core Migrations
│   ├── appsettings.json          👉 DB Connection String & JWT Settings
│   └── Program.cs                👉 DI, Middleware, CORS, Swagger & Auth Config
│
└── HospitalClient/               👉 Angular Frontend Application
    └── src/
        ├── app/
        │   ├── components/       👉 UI Components (Login, Register, Dashboard, Doctors, Patients, Appointments, Layout)
        │   ├── guards/           👉 AuthGuard
        │   ├── interceptors/     👉 JWT HTTP Interceptor
        │   ├── models/           👉 TypeScript Interfaces
        │   ├── services/         👉 HTTP API Services (Auth, Doctor, Patient, Appointment)
        │   ├── app.config.ts     👉 Providers (HttpClient, Routing, Interceptors)
        │   └── app.routes.ts     👉 Protected Routing Hierarchy
        ├── environments/         👉 API Base URL Configuration
        └── styles.css            👉 Global Styles & Bootstrap Themes
```

---

## 🚀 Getting Started

### 1. Prerequisites
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js (v18+)](https://nodejs.org/) & NPM
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB / Express / Developer)

---

### 2. Backend Setup (`HospitalApi`)

```powershell
cd HospitalApi

# 1. Update Connection String in appsettings.json if needed
# 2. Apply EF Core database migrations
dotnet ef database update

# 3. Run the Web API
dotnet run --launch-profile http
```
* API URL: `http://localhost:5160`
* Swagger UI: `http://localhost:5160/swagger`

---

### 3. Frontend Setup (`HospitalClient`)

```powershell
cd HospitalClient

# 1. Install dependencies
npm install

# 2. Start development server
npm start
```
* Application URL: `http://localhost:4200`

---

## 👤 Author
Developed as a Full-Stack Portfolio Project.
