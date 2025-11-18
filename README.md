# PayBack

A web application for easily splitting restaurant bills among multiple people using AI-powered receipt scanning.

## Project Structure

```
payback/
├── frontend/          # React + TypeScript frontend
├── backend/           # Express + TypeScript backend
├── docs/             # Documentation
└── README.md
```

## Prerequisites

- Node.js 20+ LTS
- npm or pnpm
- OpenAI API key

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/owenmeier/payback.git
cd payback
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm run dev
```

Backend will run on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run on http://localhost:3000

## Development

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
OPENAI_API_KEY=your_key_here
SESSION_SECRET=your_secret_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=PayBack
```

## Tech Stack

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express
- TypeScript
- OpenAI API (GPT-4o)
- Multer (file uploads)

## Current Status

Phase 1 - Basic structure setup complete:

- ✅ Project structure
- ✅ Backend API foundation
- ✅ Frontend routing and context
- ✅ Receipt upload component
- ⏳ GPT-4o integration
- ✅ Bill splitting interface
- ⏳ Assigning items to people
- ⏳ Results display

## Contributing

This is a personal project in development.

## License

MIT
