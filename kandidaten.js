/*
  Kandidaten voor de Proefkamer (proef.html).
  Per vibe een lijst YouTube-video's of -playlists om te keuren.
  "id" is een video-ID (11 tekens) of een playlist-ID (begint met PL).
  Een vibe met "style" is een voorstel voor een nieuwe mood.
*/
window.PROEF = [
  {
    mood: "old-school",
    question: "Meer rauw New York (DJ Premier, Mobb Deep) of juist West Coast en G-funk? Hits of onbekende pareltjes?",
    candidates: [
      { id: "PRh_SgOQiOo", title: "90s NY rap, boom bap – vinylsessie DJ Zen", channel: "Humano Studios", mins: 72 },
      { id: "kYbw-Xqvau0", title: "Full vinyl: 90s hiphop, underrated gems to classics", channel: "DJ EF", mins: 54 },
      { id: "HinlidkA6_M", title: "1994 oldschool hiphop, golden era", channel: "DJ GlibStylez", mins: 77 },
      { id: "Gvg-54eEBEY", title: "90s Golden Era hiphop mix", channel: "DJ Technique", mins: 104 },
      { id: "PVY5I0k3JBg", title: "90s Golden Era mix, West & East Coast", channel: "Travis the DJ", mins: 61 },
      { id: "owx8DPgNtwI", title: "Krafty Kuts – Golden Era of Hip Hop (deel 1–3)", channel: "Krafty Kuts", mins: 189 },
      { id: "PLxA687tYuMWgEVasBziZoZ1Bk7JLnu-Rf", title: "90s Hip Hop – de grootste rap-hits", channel: "Revive Music", tracks: 109 }
    ]
  },
  {
    mood: "disco-80s",
    question: "Meer echte disco (Chic, Donna Summer), Italo disco, of 80s synthpop en hits?",
    candidates: [
      { id: "aEELsfjJ7pw", title: "Disco mix 70s/80s – Bee Gees, Boney M, ABBA", channel: "Alejandro Barrera", mins: 31 },
      { id: "X4LLM0_iJ4o", title: "Disco house megamix – Chic, Donna Summer, Madonna", channel: "Albert CT", mins: 322 },
      { id: "NazkWPC6mCk", title: "Pierre J – Italo disco mix 1982–1984", channel: "Pierreified", mins: 173 },
      { id: "kRXDdOlWX80", title: "Italo disco rarities, vinyl-only DJ-set", channel: "Rimini Express", mins: 108 },
      { id: "IoTdm31BIrk", title: "Best of 80s synthpop – New Order, Human League, Alphaville", channel: "Albert CT", mins: 80 },
      { id: "nsEtDnglaMU", title: "80s party hits megamix – Wham!, a-ha, Duran Duran", channel: "Sir Leon", mins: 63 },
      { id: "PLGBuKfnErZlAKsNDquW0QoEYZle-NMmDL", title: "80s synthpop hits", channel: "Redlist Decades", tracks: 49 }
    ]
  },
  {
    mood: "head-empty",
    question: "Echt stil en zwevend (ambient), of mag er een zachte beat onder (lofi)?",
    candidates: [
      { id: "sxC3Fg98AKE", title: "music to make your brain shut up", channel: "nobody", mins: 62, inMoods: true },
      { id: "pZ6V8pH4HPY", title: "Brian Eno – Thursday Afternoon", channel: "Brian Eno", mins: 60, inMoods: true },
      { id: "lTRiuFIWV54", title: "1 A.M Study Session [lofi hip hop]", channel: "Lofi Girl", mins: 61, inMoods: true },
      { id: "ayuyOA3BpNc", title: "empty thoughts for 1 hour", channel: "nobody", mins: 62 },
      { id: "wpAdzrCZgus", title: "no thoughts, head empty", channel: "Lewis", mins: 65 },
      { id: "vNwYtllyt3Q", title: "Brian Eno – Ambient 1: Music for Airports", channel: "full album", mins: 48 },
      { id: "L2ZQAFWdgZQ", title: "øneheart, antent – ambient music mix", channel: "dreamslow", mins: 74 },
      { id: "FDFqzVy2nI0", title: "late night vibes – calm vaporwave, officewave", channel: "baby.murcielaga", mins: 213 },
      { id: "CFGLoQIhmow", title: "lofi hip hop mix (deel 1)", channel: "Lofi Girl", mins: 170 }
    ]
  },
  {
    mood: "frutiger-aero",
    question: "De nieuwe links hieronder vervangen de offline livestreams. Klopt deze sfeer?",
    candidates: [
      { id: "lCuS4oFKBtM", title: "Frutiger Aero music playlist mix (7 uur)", channel: "Exotic Library", mins: 422, inMoods: true },
      { id: "J_BwEIjCGHc", title: "Frutiger Aero: complete music mix", channel: "cosmic", mins: 99, inMoods: true },
      { id: "Cz2YCRmDOFk", title: "wake up! it's 2000s again", channel: "nostalgate", mins: 98, inMoods: true },
      { id: "4ozXwgGFr7k", title: "Zen TV (Frutiger Aero / vaporwave mix)", channel: "ArpWire TV", mins: 61 },
      { id: "xYufIVoCJgU", title: "Frutiger Aero playlist to relax and study", channel: "martinzon", mins: 141 },
      { id: "PLNoJ-jBBofgR_EJkFMaXmKCLm9TtdAYTw", title: "Frutiger Aero music", channel: "Trake Gaming", tracks: 64 }
    ]
  },

  // ---------- voorstellen voor nieuwe moods ----------
  {
    mood: "zomer",
    name: "Zomer",
    subtitle: "Afro house, zon op je gezicht",
    style: {
      bg: "#1F3B3A", fg: "#FFC56B", tag: "#2FA39A",
      font: "'Bricolage Grotesque', system-ui, sans-serif", weight: 800, italic: false,
      word: "SUNSET", deco: "sun"
    },
    question: "Meer deep en melodisch (terras bij zonsondergang) of dansbaarder (amapiano, feest)?",
    candidates: [
      { id: "mm8PugX6QZ0", title: "Afro house sunset mix – Punta del Este", channel: "Maldo", mins: 42 },
      { id: "-y7F1Pm349Q", title: "Summer afro house sunset mix – Lake Como", channel: "Kayro", mins: 90 },
      { id: "H4M1E5SeiMo", title: "Afro house sunset mix – Miami set", channel: "Gianni Blu", mins: 65 },
      { id: "O1sU1F6dZNk", title: "Amapiano to the World – Paris Nights", channel: "DJ Phaphane", mins: 63 },
      { id: "F3iak5Y0Qz0", title: "Balearic lounge love mix", channel: "ChillCafé", mins: 60 }
    ]
  },
  {
    mood: "city-pop",
    name: "City pop",
    subtitle: "Tokio 1983, neon en funk",
    style: {
      bg: "#FFE1CC", fg: "#2E3192", tag: "#FFB38A",
      font: "'Fraunces', Georgia, serif", weight: 700, italic: false,
      word: "シティポップ", deco: "sun"
    },
    question: "Zwoel en mellow, of funky en uptempo? Alleen Japans, of ook AOR en Braziliaanse grooves?",
    candidates: [
      { id: "_IXVNO5t2zQ", title: "70s–80s Japanese city pop, chill & mellow mix", channel: "DJ HASEBE", mins: 68 },
      { id: "gnpZF8R2FDw", title: "Japanese rare groove, jazz, funk, city pop (vinyl)", channel: "Night Cap Radio", mins: 107 },
      { id: "OIvGy0wM5_s", title: "Smooth city pop, nostalgic funk, R&B (vinylsessie)", channel: "Bobby Ghanoush", mins: 74 },
      { id: "f7jZoHs3QfY", title: "Funky city pop & Braziliaanse klassiekers (vinyl)", channel: "Bobby Ghanoush", mins: 73 },
      { id: "WCCovrKvAtU", title: "80s Japanese city pop playlist", channel: "rainbeary", mins: 61 },
      { id: "PLgf-8GQFjABq2XqYIaYD4C_uIZ4jLL4x-", title: "City pop (Japanese 80s)", channel: "playlist", tracks: 44 }
    ]
  }
];
