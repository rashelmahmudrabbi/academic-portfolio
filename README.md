# Portfolio Backend (Updated Portfolio)

REST API + admin panel for Rashel Mahmud Rabbi's portfolio.

## Tech Stack
- **Node.js & Express** - Backend framework
- **PostgreSQL (Neon)** - Database
- **Vercel** - Deployment

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```
   You will need a PostgreSQL database URL (e.g. from Neon) and a secure random string for `ADMIN_PASSWORD` and `SESSION_SECRET`.

3. **Initialize the database:**
   Run the migrations to create all necessary tables:
   ```bash
   npm run migrate
   ```

4. **Seed initial data (optional):**
   ```bash
   npm run seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`.

## API Endpoints

- `GET /api/profile` - Returns profile and settings information
- `GET /api/educations` - Returns all education history
- `GET /api/experiences` - Returns all work experiences
- `GET /api/projects` - Returns all projects
- `GET /api/publications` - Returns all publications
- `GET /api/certifications` - Returns all certifications
- `GET /api/awards` - Returns all awards
- `GET /api/gallery` - Returns gallery events and their photos
- `POST /api/contact` - Submit a contact message (requires `name`, `email`, `subject`, `message`)

## Admin Panel

The admin panel allows you to manage all portfolio data through a web interface.

- **URL:** `/admin`
- **Login:** Uses the `ADMIN_PASSWORD` defined in your `.env` file.

Features:
- Manage Profile Settings & CV info
- CRUD operations for Educations, Experiences, Projects, Publications, Certifications, Awards
- Manage Gallery Events & Photos
- View and manage Contact Messages

## Deployment to Vercel

This backend is ready to be deployed to Vercel as serverless functions.

1. Connect your GitHub repository to Vercel.
2. In Vercel, set the Framework Preset to `Other`.
3. Set the Environment Variables (`DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
4. Vercel will automatically build and deploy using the configuration in `vercel.json` and `api/index.js`.
