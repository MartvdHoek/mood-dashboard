# Soundtrack

Persoonlijk mood-muziekdashboard. Eén klik op een mood en de bijpassende YouTube-mix speelt.
Pure HTML/CSS/JS, geen build-stap, geen backend.

## Links aanpassen
Alles staat in [`moods.js`](moods.js). Plak per mood YouTube-URL's in `sources`
(video, lange mix, livestream, playlist of Mix-link). Kan direct in de GitHub-webeditor
(potloodje bij het bestand → Commit changes). Na ±1 minuut staat het live.

## Online zetten (GitHub Pages)
1. Maak op github.com een nieuwe repository, bijv. `mood-dashboard` (Public, of Private met een betaald account).
2. Upload alle bestanden (Add file → Upload files), inclusief de map `icons`.
3. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. Na een minuut staat de site op `https://<gebruikersnaam>.github.io/mood-dashboard/`.

## Installeren als app
- **Edge**: open de site → ⋯-menu → Apps → *Deze site installeren als app*
  (of het app-icoontje rechts in de adresbalk).
- **Chrome**: icoontje *Installeren* rechts in de adresbalk, of ⋮ → Casten, opslaan en delen → *Pagina installeren als app*.
- **Android (Chrome)**: ⋮ → *Toevoegen aan startscherm* / *App installeren*.
- **iPhone (Safari)**: Deel → *Zet op beginscherm*.

## Sneltoetsen
`spatie` afspelen/pauze · `N` volgende mix · `1`–`9` mood kiezen

## Lokaal testen
YouTube speelt niet vanaf een los bestand (`file://`). Lokaal: `python -m http.server 8321`
en open `http://localhost:8321`.

## Opslag
Duimen, luisterlog en gevoel staan in de localStorage van je browser (per apparaat/browser).
