# Timesheet Parser MVP

This is a minimal web application that lets you paste a Copilot summary of your Outlook calendar, categorize events, and generate a weekly timesheet.

## Features
- Paste Copilot summary text
- Parse meetings (date, title, duration)
- Categorize into Category / Project / Task
- Remembers mappings in your browser (localStorage)
- Generate simple timesheet
- Export CSV

## Running locally
1. Download or clone this repository.
2. Open `index.html` in your browser (double-click it).  
   No server required, it runs offline.

## Deploying to GitHub Pages
1. Create a new repository on GitHub (for example `timesheet-app`).
2. Upload all files (`index.html`, `style.css`, `app.js`, and this `README.md`) to the **root** of the repo.
3. Commit and push.
4. Go to **Settings** → **Pages**.
   - Under *Source*, select `main` branch, folder = `/ (root)`.
   - Click Save.
5. Wait ~1 minute. Your site will be live at:
   ```
   https://<your-username>.github.io/timesheet-app/
   ```

## Notes
- Data is stored locally in your browser (localStorage).
- No backend or cloud storage involved.
- To reset saved rules, clear your browser's localStorage for this site.
