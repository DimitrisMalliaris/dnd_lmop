# Lost Mines of Phandelver · Party Log

Static GitHub Pages site for the party's shared log.

## Update the next session

Edit `data/sessions.json`:

```json
"dateTime": "2026-09-05T20:30:00+03:00"
```

Leave it as `null` to hide the countdown and show the no-date message.

## Update the timeline

All session content lives in `data/sessions.json`. Add/edit the `title` and `events` array. Set `upcoming: true` only on the next session.

## GitHub Pages

Push the files to a repository and enable **Settings → Pages → Deploy from a branch**, using the branch containing the site and `/ (root)`.

No build step or backend is required.
