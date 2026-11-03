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
      { id: "PRh_SgOQiOo", title: "90s NY rap, boom bap – vinylsessie DJ Zen", channel: "Humano Studios", mins: 72, inMoods: true },
      { id: "kYbw-Xqvau0", title: "Full vinyl: 90s hiphop, underrated gems to classics", channel: "DJ EF", mins: 54, inMoods: true },
      { id: "HinlidkA6_M", title: "1994 oldschool hiphop, golden era", channel: "DJ GlibStylez", mins: 77, inMoods: true },
      { id: "Gvg-54eEBEY", title: "90s Golden Era hiphop mix", channel: "DJ Technique", mins: 104, inMoods: true },
      { id: "PVY5I0k3JBg", title: "90s Golden Era mix, West & East Coast", channel: "Travis the DJ", mins: 61, inMoods: true },
      { id: "owx8DPgNtwI", title: "Krafty Kuts – Golden Era of Hip Hop (deel 1–3)", channel: "Krafty Kuts", mins: 189, inMoods: true },
      { id: "PLxA687tYuMWgEVasBziZoZ1Bk7JLnu-Rf", title: "90s Hip Hop – de grootste rap-hits", channel: "Revive Music", tracks: 109, inMoods: true }
    ]
  },
  {
    mood: "go-getter",
    question: "Hard en donker (hard techno), melodisch en opbouwend, of groovy (tech house, Fred again)? Vocals erbij of liever niet?",
    candidates: [
      { id: "t3dIgXOIuko", title: "Novah – Boiler Room x Teletech London (hard techno)", channel: "Boiler Room", mins: 60 },
      { id: "EIQlDpgAY5Y", title: "Sara Landry – Boiler Room x Teletech 2023 (hard techno)", channel: "Boiler Room", mins: 60 },
      { id: "Q_tJnC0vpn4", title: "Hardgroove techno set in a bunker", channel: "Joanna Kuchta", mins: 42 },
      { id: "b014UNvEOsQ", title: "Melodic techno & peak time DJ-mix @ Gravity", channel: "YOUNA", mins: 86 },
      { id: "XJktaXYRWBg", title: "Melodic techno & progressive house – Argy, Monolink, Omnia", channel: "Raf Fender", mins: 100 },
      { id: "6MAzUT1YhWE", title: "Fred again.. – Rooftop Live (Arun's Roof, London)", channel: "Fred again..", mins: 102 },
      { id: "42XFNGZrpaQ", title: "Chris Stussy – Boiler Room Edinburgh (tech house)", channel: "Boiler Room", mins: 75 },
      { id: "JUDUC87VuPU", title: "KETTAMA – Boiler Room London (UK house, breaks)", channel: "Boiler Room", mins: 57 },
      { id: "T3YfZsDQUp0", title: "Hyperfocus techno – 3 uur pomodoro (50/10)", channel: "Work With Paul", mins: 172 }
    ]
  },
  {
    mood: "disco-80s",
    question: "Meer echte disco (Chic, Donna Summer), Italo disco, of 80s synthpop en hits?",
    candidates: [
      { id: "aEELsfjJ7pw", title: "Disco mix 70s/80s – Bee Gees, Boney M, ABBA", channel: "Alejandro Barrera", mins: 31 },
      { id: "X4LLM0_iJ4o", title: "Disco house megamix – Chic, Donna Summer, Madonna", channel: "Albert CT", mins: 322, inMoods: true },
      { id: "NazkWPC6mCk", title: "Pierre J – Italo disco mix 1982–1984", channel: "Pierreified", mins: 173, inMoods: true },
      { id: "kRXDdOlWX80", title: "Italo disco rarities, vinyl-only DJ-set", channel: "Rimini Express", mins: 108, inMoods: true },
      { id: "IoTdm31BIrk", title: "Best of 80s synthpop – New Order, Human League, Alphaville", channel: "Albert CT", mins: 80, inMoods: true },
      { id: "nsEtDnglaMU", title: "80s party hits megamix – Wham!, a-ha, Duran Duran", channel: "Sir Leon", mins: 63, inMoods: true },
      { id: "PLGBuKfnErZlAKsNDquW0QoEYZle-NMmDL", title: "80s synthpop hits", channel: "Redlist Decades", tracks: 49 }
    ]
  },
  {
    mood: "head-empty",
    question: "Echt stil en zwevend (ambient), of mag er een zachte beat onder (lofi)?",
    candidates: [
      { id: "wpAdzrCZgus", title: "no thoughts, head empty", channel: "Lewis", mins: 65, inMoods: true },
    ]
  },
  {
    mood: "frutiger-aero",
    question: "De nieuwe links hieronder vervangen de offline livestreams. Klopt deze sfeer?",
    candidates: [
      { id: "lCuS4oFKBtM", title: "Frutiger Aero music playlist mix (7 uur)", channel: "Exotic Library", mins: 422, inMoods: true },
      { id: "J_BwEIjCGHc", title: "Frutiger Aero: complete music mix", channel: "cosmic", mins: 99, inMoods: true },
      { id: "Cz2YCRmDOFk", title: "wake up! it's 2000s again", channel: "nostalgate", mins: 98, inMoods: true },
      { id: "xYufIVoCJgU", title: "Frutiger Aero playlist to relax and study", channel: "martinzon", mins: 141 },
      { id: "PLNoJ-jBBofgR_EJkFMaXmKCLm9TtdAYTw", title: "Frutiger Aero music", channel: "Trake Gaming", tracks: 64 }
    ]
  },

  {
    mood: "city-pop",
    question: "Zwoel en mellow, of funky en uptempo? Alleen Japans, of ook AOR en Braziliaanse grooves?",
    candidates: [
      { id: "_IXVNO5t2zQ", title: "70s–80s Japanese city pop, chill & mellow mix", channel: "DJ HASEBE", mins: 68, inMoods: true },
      { id: "gnpZF8R2FDw", title: "Japanese rare groove, jazz, funk, city pop (vinyl)", channel: "Night Cap Radio", mins: 107, inMoods: true },
      { id: "OIvGy0wM5_s", title: "Smooth city pop, nostalgic funk, R&B (vinylsessie)", channel: "Bobby Ghanoush", mins: 74, inMoods: true },
      { id: "f7jZoHs3QfY", title: "Funky city pop & Braziliaanse klassiekers (vinyl)", channel: "Bobby Ghanoush", mins: 73, inMoods: true },
      { id: "WCCovrKvAtU", title: "80s Japanese city pop playlist", channel: "rainbeary", mins: 61, inMoods: true },
      { id: "PLgf-8GQFjABq2XqYIaYD4C_uIZ4jLL4x-", title: "City pop (Japanese 80s)", channel: "playlist", tracks: 44, inMoods: true }
    ]
  },

  // ---------- voorstellen voor nieuwe moods ----------
  {
    mood: "remix",
    name: "Remix",
    subtitle: "Bekende nummers, sneller en harder",
    style: {
      bg: "#FF5A1F", fg: "#1A0B05", tag: "#FF5A1F",
      font: "'Anton', Impact, sans-serif", weight: 400, italic: false,
      word: "REMIX", deco: "bpm"
    },
    question: "Welk tempo: house en tech house, techno, of echt hard (hardstyle, drum & bass)? Hits van nu of klassiekers uit de 90s en 2000s?",
    candidates: [
      { id: "56l3OrgK-SU", title: "Tech house remixes & mashups of popular songs", channel: "Darley Jefferson", mins: 96 },
      { id: "r9P08bbllno", title: "Party mix – remixes & mashups of popular songs", channel: "TOBI", mins: 76 },
      { id: "YsmcZQAHLyI", title: "90s & 2000s classics reborn – modern remix mix", channel: "Mixterious", mins: 84 },
      { id: "hctq5FQtp_s", title: "Afro house EDM remixes – Avicii, Swedish House Mafia, Mau P", channel: "DJ NEXYS", mins: 36 },
      { id: "JA86AFp0gbI", title: "Techno remixes of popular songs – only techno bangers", channel: "BrutishHeavyMusic", mins: 73 },
      { id: "gIWjzcD_flU", title: "Techno remixes & mashups of popular songs", channel: "Darley Jefferson", mins: 136 },
      { id: "uPAOIsIT1MA", title: "Drum & bass remixes of popular songs", channel: "PAIGE67", mins: 59 },
      { id: "BofXJY3WUDs", title: "Hardstyle remixes of popular songs – 2 uur", channel: "Tezpa In The Mix!", mins: 126 }
    ]
  }
];
