# Test README - Run the FoodyDipti App Locally

This file describes how to run and test the FoodyDipti site locally on your laptop.

Prerequisites
- Node.js (>= 18) and npm installed
- Git (optional)

Quick start

1. Install dependencies (from project root):

   npm install

2. Copy the example env and (optionally) fill Firebase vars:

   copy .env.example .env.local

3. Start the dev server:

   npm run dev

4. Open the site in your browser:

   http://localhost:3000

Notes
- If you don't provide Firebase env vars, the app will run with mock data (no live auth/storage).
- Admin upload requires signing in with the admin email set in `NEXT_PUBLIC_ADMIN_EMAIL`.

If you want me to run the dev server here and report the output, say so and I'll start it now (I can start it and provide logs, but you will need to open the URL locally to view the UI in your browser).
