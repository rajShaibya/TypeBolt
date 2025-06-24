# TypeBolt Backend

A Node.js Express backend for the TypeBolt speed typing application.

## Features

- User authentication (signup/login) with JWT
- Random paragraph generation from external APIs
- Typing test result storage and retrieval
- User statistics and history tracking
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
JWT_SECRET=your-secret-key-here
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Typing Test
- `GET /api/paragraph` - Get random paragraph for typing test
- `POST /api/typing-result` - Save typing test result (requires auth)
- `GET /api/typing-history` - Get user's typing history (requires auth)
- `GET /api/user-stats` - Get user statistics (requires auth)

### Health Check
- `GET /api/health` - Server health check

## Data Structure

### User Object
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "hashed-string",
  "createdAt": "date"
}
```

### Typing Result Object
```json
{
  "id": "string",
  "userId": "string",
  "wpm": "number",
  "accuracy": "number",
  "errors": "number",
  "timeTaken": "number",
  "paragraph": "string",
  "timestamp": "date"
}
``` 