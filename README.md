# RentFinder - Modern Rental Home Platform

RentFinder is a premium, full-stack rental home finder platform built with **React**, **Spring Boot (Java)**, and **MySQL**. It features a smart matching algorithm for tenants and an assisted listing workflow for property owners.

## 🚀 Features

- **Smart Matching**: AI-powered scoring system that matches tenants with their ideal properties based on budget, location, and lifestyle preferences.
- **Assisted Listing**: Property owners can request professional assistance for property verification and listing creation.
- **Admin Console**: Robust management interface for processing listing requests and platform oversight.
- **JWT Authentication**: Secure, role-based access control for Tenants, Owners, and Admins.
- **Premium UI/UX**: Modern, responsive design built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for iconography
- **Axios** for API communication

### Backend
- **Java 17** with **Spring Boot 3**
- **Spring Data JPA** for database management
- **Spring Security** with **JWT** for secure authentication
- **MySQL** (Production)
- **Lombok** for boilerplate reduction
- **Maven** for dependency management

## 📦 Project Structure

```text
├── src/
│   ├── client/           # Frontend Application (React)
│   │   ├── api/          # Axios instance & API services
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React Contexts (Auth, etc.)
│   │   ├── pages/        # Page-level components
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript interfaces
│   ├── main/             # Backend Application (Java/Spring Boot)
│   │   ├── java/         # Java source code
│   │   │   └── com/rentfinder/
│   │   │       ├── config/       # App & Security configuration
│   │   │       ├── controller/   # REST API Controllers
│   │   │       ├── dto/          # Data Transfer Objects
│   │   │       ├── entity/       # JPA Database Entities
│   │   │       ├── repository/   # Data Access Repositories
│   │   │       └── service/      # Business logic & Services
│   │   └── resources/    # App properties & Static assets
├── Dockerfile            # Multi-stage Docker build config
├── docker-compose.yml    # Local orchestration with MySQL
├── pom.xml               # Maven configuration
└── .env.example          # Environment variables template
```

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Node.js (v20+)
- Maven
- MySQL 8.0+ (or Docker)

### Local Development (Manual)

1. **Clone the repository**
2. **Setup MySQL Database**
   - Create a database named `rentfinder`.
3. **Configure Environment Variables**
   - Copy `.env.example` to `.env` and update with your local MySQL credentials.
4. **Install Frontend Dependencies**
   ```bash
   npm install
   ```
5. **Run the Application**
   ```bash
   npm run dev
   ```
   This will start the Spring Boot backend on port 3000.

### Using Docker (Recommended)

```bash
docker-compose up --build
```
The application will be available at `http://localhost:3000`.

## 🔐 Security

- All sensitive endpoints are protected by JWT.
- Passwords are hashed with BCrypt.
- Role-based authorization (TENANT, OWNER, ADMIN).

## 📄 License

This project is licensed under the MIT License.
