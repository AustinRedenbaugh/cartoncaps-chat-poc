# cartoncaps-chat-poc 

## Set up BACKEND (Port 8000)

1. cd backend
2. poetry shell
3. poetry installl
4. poetry run python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Set up FRONTEND (Port 3000)

1. cd frontend
2. yarn dev

## Read the docs

1. http://localhost:8000/docs (while the server is running)


## Project Description
This project is a full-stack chat proof-of-concept built with Nuxt (Vue 3) for the frontend, FastAPI for the backend, and SQLite for data storage. The backend provides a RESTful API and real-time features, while the frontend offers a modern, responsive user interface. The stack is designed for rapid prototyping and easy local development.
Frontend: Nuxt 3 (Vue 3, Vite, Tailwind CSS)
Backend: FastAPI (Python 3), served with Uvicorn
Database: SQLite (lightweight, file-based)
Features: Modular component structure, API documentation via Swagger UI, easy setup for local development