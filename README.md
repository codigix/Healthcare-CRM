# Healthcare CRM - AI-Powered Hospital Management System

A comprehensive healthcare management system for multispecialty hospitals with AI-powered reporting and workflow assistance.

## Features

- 🏥 **Multispecialty Hospital Management**
- 👥 **Patient Management System**
- 👨‍⚕️ **Doctor & Staff Management**
- 📅 **Appointment Scheduling**
- 🤖 **AI-Powered Reports & Analytics**
- 🔐 **Role-based Authentication**
- 📊 **Real-time Dashboard**
- 💊 **Medical Records Management**
- 🏥 **Department Management**

## Tech Stack

- **Frontend**: React JSX, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Integration**: OpenAI API for report generation
- **Authentication**: JWT tokens

## Quick Start

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start development servers:
```bash
npm run dev
```

## Project Structure

```
healthcare-crm/
├── client/          # React frontend
├── server/          # Node.js backend
├── database/        # MySQL schema and migrations
└── docs/           # Documentation
```

## Environment Variables

### Server (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_crm
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
PORT=5000
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## License

MIT License
