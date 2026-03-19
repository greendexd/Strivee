# The Quest - Gamified Habit Tracker

This repository contains the full-stack implementation of a gamified habit tracker app based on custom UI designs.

## Tech Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
* **Backend:** Node.js, Express, TypeScript, Prisma ORM
* **Database:** PostgreSQL
* **Deployment:** Render (via `render.yaml`)

## Running Locally

### Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file with your `DATABASE_URL` (e.g. `postgresql://user:pass@localhost:5432/db`)
4. Run `npx prisma db push` to synchronize the schema.
5. Run `npm run dev` (or `npx tsc && node dist/src/index.js`) to start the API on port 3001.

### Frontend Setup
1. Ensure the backend is running.
2. In the root directory, run `npm install`
3. Run `npm run dev` to start the frontend on port 5173.
