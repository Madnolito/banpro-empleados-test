# Banpro Semi-Senior Full-Stack TEST

React (Frontend) + Python/FastAPI (Backend)

## Project structure
- `frontend/`: React app
- `backend/`: Python FastAPI API


## Environment variables (.env)

Both **backend** and **frontend** require a local `.env` file.

### Backend
- `cd backend`
From the `backend/` folder:

- Mac/Linux:
  - `cp .env.example .env`
- Windows (PowerShell):
  - `Copy-Item .env.example .env`
- Windows (CMD):
  - `copy .env.example .env`

### Frontend
- `cd frontend`
From the `frontend/` folder:

- Mac/Linux:
  - `cp .env.example .env`
- Windows (PowerShell):
  - `Copy-Item .env.example .env`
- Windows (CMD):
  - `copy .env.example .env`

Then update the values in each `.env` as needed.


## Backend Setup (FastAPI)

### Dependencies

- Python 3.11.4

### Setup & run

- `cd backend`
- Create a virtual environment: `python3 -m venv venv`
- Activate the virtual environment:
  - Mac/Linux: `source ./venv/bin/activate`
  - Windows: `.\venv\Scripts\activate`
- Install the dependencies from [requirements.txt](./backend/requirements.txt)
  - `pip install -r requirements.txt`
- Run the api: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`


## Frontend Setup (React)

### Dependencies 

- NodeJS + npm

### Setup & run

- `cd frontend`
- `npm install`
- Run the App: `npm run dev`


## Notes
- Backend runs on: `http://localhost:8000`
- Frontend runs on: `http://localhost:5173` (default Vite port)