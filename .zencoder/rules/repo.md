---
description: Repository Information Overview
alwaysApply: true
---

# Healthcare CRM Information

## Summary
AI-powered healthcare management system for multispecialty hospitals with comprehensive patient, doctor, appointment, and department management capabilities. Features include role-based authentication, real-time dashboard, medical records management, and AI-powered reporting.

## Structure
- **client/**: React frontend application with Redux state management
- **server/**: Node.js Express backend API
- **server/config/**: Database and server configuration
- **server/routes/**: API endpoint definitions
- **server/middleware/**: Authentication and request processing
- **client/src/components/**: Reusable UI components
- **client/src/pages/**: Application page components
- **client/src/slices/**: Redux Toolkit state slices
- **client/src/services/**: API service integrations

## Projects

### Frontend (React Application)
**Configuration File**: client/package.json

#### Language & Runtime
**Language**: JavaScript (React)
**Version**: React 18.2.0
**Build System**: Create React App
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- React 18.2.0
- Redux Toolkit 1.9.7
- React Router 6.18.0
- Axios 1.6.2
- Chart.js 4.4.0
- Tailwind CSS 3.3.6
- React Hook Form 7.48.2

#### Build & Installation
```bash
cd client
npm install
npm start
```

#### Testing
**Framework**: Jest with React Testing Library
**Test Location**: client/src/**/*.test.js
**Run Command**:
```bash
cd client
npm test
```

### Backend (Node.js API)
**Configuration File**: server/package.json

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js (Express 4.18.2)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- Express 4.18.2
- MySQL2 3.6.5
- bcryptjs 2.4.3
- jsonwebtoken 9.0.2
- dotenv 16.3.1
- OpenAI API 4.20.1
- Helmet 7.1.0
- Express Rate Limit 7.1.5

#### Build & Installation
```bash
cd server
npm install
npm run dev
```

#### Testing
**Framework**: Jest
**Test Location**: server/**/*.test.js
**Run Command**:
```bash
cd server
npm test
```

### Full System
**Configuration File**: package.json

#### Language & Runtime
**Package Manager**: npm

#### Dependencies
**Development Dependencies**:
- concurrently 8.2.2

#### Build & Installation
```bash
npm run install-all
```

#### Usage & Operations
**Start Development Environment**:
```bash
npm run dev
```

**Build Production Frontend**:
```bash
npm run build
```

## Database
**Type**: MySQL
**Configuration**: server/config/database.js
**Schema**: Includes tables for users, patients, doctors, appointments, departments, medical records, and AI reports
**Connection**: Environment variables in server/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)

## Environment Configuration
**Server**: server/.env (PORT, JWT_SECRET, OPENAI_API_KEY, DB_* variables)
**Client**: client/.env (REACT_APP_API_URL)