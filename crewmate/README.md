# Crewmate Management App

A React-based web application for managing crewmates with full CRUD functionality, built with React Router, Vite, and Supabase.

## Features

✅ **Create Crewmates** - Add new crewmates with name, role, color, and skill level  
✅ **List All Crewmates** - View all crewmates sorted by creation date (newest first)  
✅ **Detail Page** - Click on any crewmate to see their full details with unique URLs (`/crewmate/:id`)  
✅ **Edit Crewmates** - Update crewmate attributes with immediate Supabase sync  
✅ **Delete Crewmates** - Remove crewmates with confirmation  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Real-time Database** - All data synced with Supabase  

## Tech Stack

- **Frontend:** React 18, React Router 6, Vite
- **Backend:** Supabase (PostgreSQL)
- **Styling:** Custom CSS with responsive design
- **Deployment:** Ready for Vercel, Netlify, or any static host

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account with a project

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd crewmate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Database Setup

The app requires a `crewmates` table in Supabase with the following schema:

```sql
CREATE TABLE crewmates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  color TEXT NOT NULL,
  skill_level INTEGER NOT NULL CHECK (skill_level >= 1 AND skill_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crewmates_created_at ON crewmates(created_at DESC);
```

## Usage

### Creating a Crewmate
1. Click "+ Add Crewmate"
2. Enter name
3. Select role from: Captain, Engineer, Medic, Pilot, Scientist
4. Choose a color
5. Set skill level (1-5)
6. Click "Create Crewmate"

### Editing a Crewmate
1. Click on a crewmate from the list or visit `/edit/:id`
2. Modify the attributes
3. Click "Save Changes"
4. Changes are immediately reflected in Supabase

### Deleting a Crewmate
1. From the edit form or detail page, click "Delete Crewmate"
2. Confirm deletion
3. Crewmate is removed from the list and database

## Routes

- `/` - Home page (list all crewmates)
- `/create` - Create new crewmate form
- `/crewmate/:id` - View crewmate details
- `/edit/:id` - Edit crewmate form

## Build & Deploy

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Project Structure

```
src/
├── App.jsx              # Main app with routing
├── App.css              # Global styles
├── lib/
│   └── supabaseClient.js # Supabase configuration
├── pages/
│   ├── HomePage.jsx     # List all crewmates
│   ├── CreateCrewmate.jsx # Create form
│   ├── CrewmateDetail.jsx # Detail view
│   ├── EditCrewmate.jsx # Edit form
│   ├── HomePage.css
│   ├── CrewmateForm.css
│   └── CrewmateDetail.css
└── main.jsx            # React entry point
```

## Future Enhancements

- Row-level security (RLS) for user authentication
- User accounts and personalized crewmate lists
- Search and filtering options
- Import/export functionality
- Team collaboration features
- Real-time updates with Supabase subscriptions

## License

MIT

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
