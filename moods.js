/*
  ============================================================
  SOUNDTRACK — jouw moods en links
  ============================================================
  Dit is het enige bestand dat je hoeft aan te passen.

  LINKS TOEVOEGEN
  Plak in "sources" gewoon een YouTube-URL. Werkt met:
    - een losse video / lange mix   https://www.youtube.com/watch?v=XXXXXXXXXXX
    - een korte link                https://youtu.be/XXXXXXXXXXX
    - een livestream                https://www.youtube.com/live/XXXXXXXXXXX
    - een playlist                  https://www.youtube.com/playlist?list=PL...
    - een YouTube Mix               https://www.youtube.com/watch?v=XXX&list=RD...
  "title" is optioneel (de speler toont zelf de echte titel zodra hij speelt).
  "openInTab: true" opent die bron altijd in een nieuw YouTube-tabblad.

  Let op de komma's: na elke { ... } in een lijst een komma.

  NIEUWE MOOD
  Kopieer een blok, geef het een uniek "id", en zet "featured" op
  true (direct zichtbaar) of false (komt onder "Meer moods").
  "deco" kan zijn: "boombap", "bpm", "bubbles", "sun", "cloud" of "none".
  ============================================================
*/

window.MOODS = [
  {
    id: "old-school",
    name: "Old school",
    subtitle: "Gangster boom-bap, jaren 90",
    featured: true,
    style: {
      bg: "#17130C",          // achtergrond
      fg: "#F2C14E",          // tekst/accent
      tag: "#F2C14E",         // kleur in de tijdlijn
      font: "'Anton', Impact, sans-serif",
      weight: 400,
      italic: false,
      word: "BOOM BAP",       // groot decoratief woord
      deco: "boombap"
    },
    sources: [
      { url: "https://www.youtube.com/playlist?list=PL4G14zsHQYcUAsIcKaxxVZEPiat7JA6Cp", title: "90s underground & classic hip hop (playlist)" },
      { url: "https://www.youtube.com/watch?v=_JZom_gVfuw&list=RD_JZom_gVfuw", title: "Mix op basis van Juicy" },
      { url: "https://www.youtube.com/playlist?list=PL760D537A970662F3", title: "Boom Bap 90's Rap (playlist)" },
      { url: "https://www.youtube.com/watch?v=PRh_SgOQiOo", title: "90s NY rap, boom bap – vinylsessie DJ Zen" },
      { url: "https://www.youtube.com/watch?v=kYbw-Xqvau0", title: "Full vinyl: 90s hiphop, underrated gems to classics" },
      { url: "https://www.youtube.com/watch?v=HinlidkA6_M", title: "1994 oldschool hiphop, golden era" },
      { url: "https://www.youtube.com/watch?v=Gvg-54eEBEY", title: "90s Golden Era hiphop mix" },
      { url: "https://www.youtube.com/watch?v=PVY5I0k3JBg", title: "90s Golden Era mix, West & East Coast" },
      { url: "https://www.youtube.com/watch?v=owx8DPgNtwI", title: "Krafty Kuts – Golden Era of Hip Hop (deel 1–3)" },
      { url: "https://www.youtube.com/playlist?list=PLxA687tYuMWgEVasBziZoZ1Bk7JLnu-Rf", title: "90s Hip Hop – de grootste rap-hits (playlist)" }
    ]
  },
  {
    id: "go-getter",
    name: "Go getter",
    subtitle: "Techno en uptempo, knallen",
    featured: true,
    style: {
      bg: "#0B0B0F",
      fg: "#C8FF3D",
      tag: "#C8FF3D",
      font: "'Space Mono', ui-monospace, monospace",
      weight: 700,
      italic: false,
      word: "130 BPM",
      deco: "bpm"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=0vsD8kO8xeM", title: "1 uur dark techno" },
      { url: "https://www.youtube.com/watch?v=c0-hvjV2A5Y", title: "Fred again.. Boiler Room London" },
      { url: "https://www.youtube.com/watch?v=t3dIgXOIuko", title: "Novah – Boiler Room x Teletech London" },
      { url: "https://www.youtube.com/watch?v=EIQlDpgAY5Y", title: "Sara Landry – Boiler Room x Teletech 2023" }
    ]
  },
  {
    id: "frutiger-aero",
    name: "Frutiger aero",
    subtitle: "Fris, glanzend, relaxed",
    featured: true,
    style: {
      bg: "#CFEFFF",
      fg: "#0B4F6C",
      tag: "#8FD3F4",
      font: "'Bricolage Grotesque', system-ui, sans-serif",
      weight: 700,
      italic: false,
      word: "o O o",
      deco: "bubbles"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=lCuS4oFKBtM", title: "Frutiger Aero Music Playlist Mix (7 uur)" },
      { url: "https://www.youtube.com/watch?v=J_BwEIjCGHc", title: "Frutiger Aero: Complete Music Mix" },
      { url: "https://www.youtube.com/watch?v=Cz2YCRmDOFk", title: "wake up! it's 2000s again" }
    ]
  },
  {
    id: "disco-80s",
    name: "Disco & 80s",
    subtitle: "Uplifting, armen omhoog",
    featured: true,
    style: {
      bg: "#2A0E3A",
      fg: "#FF8FC7",
      tag: "#FF8FC7",
      font: "'Fraunces', Georgia, serif",
      weight: 700,
      italic: true,
      word: "DISCO",
      deco: "sun"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=djV11Xbc914&list=RDdjV11Xbc914", title: "Mix op basis van Take On Me" },
      { url: "https://www.youtube.com/watch?v=fNFzfwLM72c&list=RDfNFzfwLM72c", title: "Mix op basis van Stayin' Alive" },
      { url: "https://www.youtube.com/watch?v=4xDzrJKXOOY", title: "synthwave radio" },
      { url: "https://www.youtube.com/watch?v=X4LLM0_iJ4o", title: "Disco house megamix – Chic, Donna Summer, Madonna" },
      { url: "https://www.youtube.com/watch?v=NazkWPC6mCk", title: "Pierre J – Italo disco mix 1982–1984" },
      { url: "https://www.youtube.com/watch?v=kRXDdOlWX80", title: "Italo disco rarities, vinyl-only DJ-set" },
      { url: "https://www.youtube.com/watch?v=IoTdm31BIrk", title: "Best of 80s synthpop – New Order, Human League, Alphaville" },
      { url: "https://www.youtube.com/watch?v=nsEtDnglaMU", title: "80s party hits megamix – Wham!, a-ha, Duran Duran" }
    ]
  },
  {
    id: "head-empty",
    name: "Head empty",
    subtitle: "No thoughts, alleen ruis",
    featured: true,
    style: {
      bg: "#F1ECF7",
      fg: "#5B4B76",
      tag: "#E7E0D6",
      font: "'Bricolage Grotesque', system-ui, sans-serif",
      weight: 300,
      italic: false,
      word: "· · ·",
      deco: "cloud"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=wpAdzrCZgus", title: "no thoughts, head empty" }
    ]
  },
  {
    id: "city-pop",
    name: "City pop",
    subtitle: "Tokio 1983, neon en funk",
    featured: true,
    style: {
      bg: "#FFE1CC",
      fg: "#2E3192",
      tag: "#FFB38A",
      font: "'Fraunces', Georgia, serif",
      weight: 700,
      italic: false,
      word: "シティポップ",
      deco: "sun"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=_IXVNO5t2zQ", title: "70s–80s Japanese city pop, chill & mellow mix" },
      { url: "https://www.youtube.com/watch?v=gnpZF8R2FDw", title: "Japanese rare groove, jazz, funk, city pop (vinyl)" },
      { url: "https://www.youtube.com/watch?v=OIvGy0wM5_s", title: "Smooth city pop, nostalgic funk, R&B (vinylsessie)" },
      { url: "https://www.youtube.com/watch?v=f7jZoHs3QfY", title: "Funky city pop & Braziliaanse klassiekers (vinyl)" },
      { url: "https://www.youtube.com/watch?v=WCCovrKvAtU", title: "80s Japanese city pop playlist" },
      { url: "https://www.youtube.com/playlist?list=PLgf-8GQFjABq2XqYIaYD4C_uIZ4jLL4x-", title: "City pop (Japanese 80s) (playlist)" }
    ]
  },
  {
    id: "remix",
    name: "Remix",
    subtitle: "Bekende nummers, sneller en harder",
    featured: true,
    style: {
      bg: "#FF5A1F",
      fg: "#1A0B05",
      tag: "#FF5A1F",
      font: "'Anton', Impact, sans-serif",
      weight: 400,
      italic: false,
      word: "REMIX",
      deco: "bpm"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=BofXJY3WUDs", title: "Hardstyle remixes of popular songs – 2 uur" }
    ]
  },

  // Voorbeeld van een extra mood achter "Meer moods" (mag je weghalen)
  {
    id: "synthwave",
    name: "Night drive",
    subtitle: "Synthwave, neon, snelweg",
    featured: false,
    style: {
      bg: "#120B2E",
      fg: "#7DF9FF",
      tag: "#7DF9FF",
      font: "'Space Mono', ui-monospace, monospace",
      weight: 700,
      italic: false,
      word: "NEON",
      deco: "sun"
    },
    sources: [
      { url: "https://www.youtube.com/watch?v=4xDzrJKXOOY", title: "synthwave radio" }
    ]
  }
];

/*
  VOORSTEL OP TIJDSTIP
  Vanaf welk tijdstip welke mood wordt voorgesteld (op volgorde).
*/
window.SCHEDULE = [
  { from: "00:00", mood: "head-empty" },
  { from: "08:00", mood: "frutiger-aero" },
  { from: "09:30", mood: "go-getter" },
  { from: "12:00", mood: "old-school" },
  { from: "13:30", mood: "go-getter" },
  { from: "15:30", mood: "disco-80s" },
  { from: "17:30", mood: "head-empty" }
];

/*
  "HOE VOEL IK ME?"
  Welke mood erbij wordt voorgesteld (alleen een suggestie).
*/
window.FEELINGS = [
  { id: "moe",        label: "Moe",        emoji: "🥱", suggest: "go-getter" },
  { id: "scherp",     label: "Scherp",     emoji: "🎯", suggest: "go-getter" },
  { id: "onrustig",   label: "Onrustig",   emoji: "🌀", suggest: "head-empty" },
  { id: "blij",       label: "Blij",       emoji: "☀️", suggest: "disco-80s" },
  { id: "ontspannen", label: "Ontspannen", emoji: "🍃", suggest: "frutiger-aero" }
];
