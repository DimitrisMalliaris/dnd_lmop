# Lost Mines of Phandelver · Party Log

Μικρό static site για το shared log της παρέας.

## Αλλαγή του επόμενου ραντεβού

Άνοιξε το `data/sessions.json` και βάλε το `dateTime` της επόμενης συνάντησης:

```json
"dateTime": "2026-09-05T20:30:00+03:00"
```

Αν το αφήσεις `null`, το countdown δεν εμφανίζεται και η σελίδα δείχνει σχετικό μήνυμα.

## Προσθήκη / αλλαγή sessions

Όλα τα entries είναι στο `data/sessions.json`. Για κάθε session χρειάζονται:

- `session`: αριθμός
- `title`: τίτλος
- `events`: λίστα με τα γεγονότα
- `upcoming`: `true` μόνο για το επόμενο session

Το τελευταίο session είναι αυτό που εμφανίζεται ως Upcoming.

## GitHub Pages

Αν το repository είναι public, μπορείς να ενεργοποιήσεις **Settings → Pages → Deploy from a branch** και να επιλέξεις το branch που περιέχει αυτά τα αρχεία, με folder `/ (root)`.

Δεν χρειάζεται build step ή backend.
