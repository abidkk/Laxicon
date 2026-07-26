# Laxicon

## 1. Connect your Google Sheet (free)
1. Open your sheet → **Share** → **Anyone with the link** → **Viewer**.
2. Copy the Sheet ID from the URL: `.../spreadsheets/d/SHEET_ID/edit#gid=GID`
3. Open `js/config.js` and paste `SHEET_ID` (and `GID` if not the first tab).

## 2. Run locally
Just open `index.html` in a browser, or use any static server.

## 3. Deploy on GitHub Pages (free)
1. Push this folder to a GitHub repo.
2. Repo → **Settings → Pages → Deploy from branch** → `main` / root.
3. Your site goes live at `https://yourusername.github.io/repo-name/`.

Sheet columns expected (already matches your form): word-Phrase, Defnition-Meaining, Parts-of-speach, Synonyms, Antonyms, Exact-Senetence, Syn-Sentence, Ant-Sentence, Common-Sentences.
