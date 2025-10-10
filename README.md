**What is included**
- `backend/` - Express + Mongoose API with models and simple endpoints
- `frontend/` - React app with pages: Login,Home, Dashboard, Scheduler (multi-step), Timetable view
- `seed/` - seed script to create an admin and sample teachers/subjects
- Minimal validation and conflict warnings

**How to run locally (development)**
1. Backend:
   - `cd backend`
   - `npm install`
   - set `MONGO_URI` in `.env` (for quick testing you can use a local MongoDB)
   - `node seed/seed.js` to seed sample data
   - `npm run dev` 

2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev` 
