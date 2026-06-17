# Hasibul's Diary — Repository Overview

This repository is a simple static portfolio and blog hosted on GitHub Pages. The site uses plain HTML/CSS/JS with a small modularization layer so content (categories and posts) can be added without duplicating layout code.

## What changed in this refactor
- Shared partials: `shared/navbar.html` and `shared/footer.html` are injected at runtime by `js/site.js`.
- Centralized metadata: `data/posts.json` contains category metadata used to render category cards.
- Pages now use the shared loader: `js/site.js` (it handles the navbar toggle and loads partials).
- `about.html` layout was intentionally left unchanged per request.

## How to add a new blog post (quick steps)

1. Choose a category folder under `blogs/` (e.g. `blogs/before-start/`).
2. Copy `posts/post-template.html` into the chosen category folder and rename it to your post slug, e.g. `my-first-post.html`.
3. Edit the file:
	 - Replace `POST_TITLE`, `DATE`, and `CATEGORY_NAME` with appropriate values.
	 - Write your content inside the `<!-- Your post HTML goes here -->` area.
	 - If you place the file in a location with a different depth than `blogs/<category>/`, update the relative paths for CSS/JS links at the top and bottom of the template.
4. (Optional) If you want the post to appear on the homepage or in category listings automatically, add a `posts` array entry to `data/posts.json` like this:

```json
{
	"slug": "my-first-post",
	"title": "My First Post",
	"category": "before-start",
	"date": "2026-06-17",
	"excerpt": "Short excerpt for lists",
	"image": "img/...",
	"path": "blogs/before-start/my-first-post.html"
}
```

5. Commit and push to GitHub. Your site will be published by GitHub Pages.

## Quick local preview
Open the HTML file(s) in a browser (double-click the `.html`) to preview. For dynamic loading of shared partials and JSON, use a local static server to avoid CORS restrictions. Example (Python 3):

```bash
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Notes
- `about.html` still contains its original header/footer markup and uses `js/app.js` for the navbar toggle — this was preserved intentionally.
- If you want, I can migrate `about.html` to the shared layout too.

