# Personal Portfolio Website (MERN-style: MongoDB + Express + HTML/CSS/JS client)

Practical Guide 09 — Full Stack Development

## What was fixed

The **Admin page's "Save Project" (Add / Update) feature was not working** because
`server/models/Project.js` was missing its final line:

```js
module.exports = mongoose.model("Project", projectSchema);
```

Without that line, `require("../models/Project")` in `routes/projectRoutes.js`
returned an empty object instead of a usable Mongoose model, so every
`POST /api/projects` and `PUT /api/projects/:id` request failed. This has been
fixed. Deleting and viewing projects were already working correctly because
those routes don't rely on `new Project(...)`.

A couple of small cosmetic issues were also cleaned up:
- `about.html` was highlighting "Home" as the active nav link instead of "About".
- `projects.html` had a different brand name ("Hansika Portfolio") in the navbar
  than the other pages ("Portfolio").

## Project structure

```
Portfolio3/
├── client/            # Static HTML/CSS/JS front end (Interfaces 1-4)
│   ├── home.html / home.css
│   ├── about.html / about.css
│   ├── projects.html / projects.css / projects.js
│   ├── admin.html / admin.css / admin.js
│   └── Profile Photo.png
└── server/            # Express + MongoDB (Mongoose) backend
    ├── server.js
    ├── .env           # MONGO_URI + PORT (not pushed to GitHub, see .gitignore)
    ├── models/Project.js
    └── routes/projectRoutes.js
```

## How to run it locally

1. Make sure MongoDB is running locally (e.g. `mongod`, or MongoDB Compass
   connected to `mongodb://localhost:27017`).
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   # or, for auto-restart during development:
   npm run dev
   ```
4. Open the site in your browser:
   - Home: http://localhost:5000/home.html
   - About: http://localhost:5000/about.html
   - Projects: http://localhost:5000/projects.html
   - Admin: http://localhost:5000/admin.html

The Express server also serves the `client` folder as static files, so the
whole site runs from the single `http://localhost:5000` origin — no separate
front-end server is needed.

## Testing the Admin (Add/Update/Delete) feature

1. Go to `http://localhost:5000/admin.html`.
2. Fill in the form (Project Title, Description, Technologies, Project Link)
   and click **Save Project** → it will `POST` to `/api/projects` and the new
   project should immediately appear in the list below, and in MongoDB
   Compass under `portfolioDB > projects`.
3. Click **Edit** on any project in the list to load it back into the form,
   change something, and click **Save Project** again → it will `PUT` to
   `/api/projects/:id` and update it in place.
4. Click **Delete** to remove a project.
5. Visit `http://localhost:5000/projects.html` to confirm the same projects
   are displayed there as cards, pulled live from the database.

## Pushing this project to GitHub

From the `Portfolio3` folder:

```bash
git init
git add .
git commit -m "Fix: export Project model so Add/Update works; nav polish"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Notes:
- `server/.gitignore` already excludes `node_modules/` and `.env`, so those
  won't be pushed. Anyone cloning the repo just needs to run `npm install`
  inside `server/` and create their own `.env` file (a `.env` with the same
  two lines as your current one — `MONGO_URI` and `PORT` — is fine to share
  privately with your instructor if needed, just don't commit it to a public
  repo).
- If you already ran `git init` before and node_modules got committed
  previously, run `git rm -r --cached server/node_modules` once before your
  next commit to remove it from tracking.
