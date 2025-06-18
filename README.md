# Carton Caps Chat POC

A chat application with an iPhone-style interface built with Vue.js (Nuxt) frontend and FastAPI backend.

## Features

- iPhone-style UI design
- User selection dropdown (None, Austin)
- Real-time chat interface
- Backend API integration
- Conversation management

## Setup and Running

### Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   pip install fastapi uvicorn sqlalchemy
   ```

3. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend (Nuxt.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /chat/hello?user_id={id}` - Start a new conversation with a user
- `POST /chat/respond` - Send a message and get a response

## Usage

1. Open the frontend in your browser
2. Select a user from the dropdown (Austin)
3. Click "New Conversation with Selected User"
4. Start chatting in the conversation area
5. Type messages and click "Send" to continue the conversation

## Architecture

- **Frontend**: Vue.js with Nuxt.js, Tailwind CSS for styling
- **Backend**: FastAPI with SQLAlchemy for database operations
- **Proxy**: Nuxt dev proxy configured to route `/api/*` to backend
- **CORS**: Configured to allow frontend-backend communication 