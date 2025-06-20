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