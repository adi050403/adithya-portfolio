# Adithya Nayak K — Portfolio

Dark, modern static portfolio. Content lives in one file so you can update the site without touching layout code.

## Update your content

Edit **`data/resume.json`** — name, summary, jobs, projects, skills, links, certifications.

After editing, refresh the site (or push to GitHub if deployed).

> Tip: set real LinkedIn and GitHub URLs in `contact.linkedin` and `contact.github`.

## Preview locally

Because the page loads JSON via `fetch`, open it through a local server (not `file://`):

```bash
# Python
python -m http.server 5500

# or Node
npx serve .
```

Then visit `http://localhost:5500`.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `adithya-portfolio` or `your-username.github.io`).
2. Push this folder to the `main` branch.
3. In the repo: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)**
4. Save. Your site will be at:
   - `https://<username>.github.io/<repo>/`  
   - or `https://<username>.github.io/` if the repo is named `<username>.github.io`

### If the site is in a subpath (project Pages)

If JSON fails to load on Pages, ensure links stay relative (`./data/resume.json`) — they already are.

## Project structure

```
index.html          # page shell
css/styles.css      # dark theme
js/main.js          # reads JSON and fills the page
data/resume.json    # ← edit this to update content
```
