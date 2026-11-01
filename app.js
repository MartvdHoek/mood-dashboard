/* Soundtrack — app-logica. Moods en links staan in moods.js. */
(function () {
  'use strict';

  const MOODS = (window.MOODS || []).filter(m => m && m.id && Array.isArray(m.sources));
  const SCHEDULE = window.SCHEDULE || [];
  const FEELINGS = window.FEELINGS || [];
  const byId = id => MOODS.find(m => m.id === id);
  const $ = id => document.getElementById(id);

  const SKIP_SECONDS = 600;
  const HEARTBEAT_MS = 20000;
  const LOG_DAYS = 60;

  // ---------- opslag (localStorage, kan altijd falen) ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('soundtrack.' + key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('soundtrack.' + key, JSON.stringify(value)); } catch (e) { /* vol of geblokkeerd */ }
    }
  };

  const ratings = store.get('ratings', {});         // { bronKey: 1 | -1 }
  const lastByMood = store.get('lastByMood', {});   // { moodId: bronKey }
  let log = store.get('log', []);                   // [{ mood, key, start, end }]
  let feelings = store.get('feelings', []);         // [{ t, feeling }]

  const cutoff = Date.now() - LOG_DAYS * 864e5;
  log = log.filter(s => s && s.end > cutoff);
  feelings = feelings.filter(f => f && f.t > cutoff);

  // ---------- YouTube-URL's ontleden ----------
  function parseTime(t) {
    if (!t) return 0;
    if (/^\d+$/.test(t)) return +t;
    const m = String(t).match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  }

  function parseSource(raw) {
    if (typeof raw === 'string') raw = { url: raw };
    if (!raw || !raw.url) return null;
    let url;
    try { url = new URL(String(raw.url).trim()); } catch (e) { return null; }

    const host = url.hostname.replace(/^(www|m|music)\./, '');
    let videoId = null;
    let listId = url.searchParams.get('list');

    if (host === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0];
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      videoId = url.searchParams.get('v');
      const m = url.pathname.match(/^\/(?:embed|live|shorts|v)\/([A-Za-z0-9_-]{11})/);
      if (!videoId && m) videoId = m[1];
    } else {
      return null;
    }

    if (videoId && !/^[A-Za-z0-9_-]{11}$/.test(videoId)) videoId = null;
    if (listId && !/^[A-Za-z0-9_-]+$/.test(listId)) listId = null;

    let type = 'video';
    if (listId && /^RD/.test(listId)) {
      type = 'mix';
      // Een Mix-ID is meestal "RD" + het video-ID van het startnummer
      if (!videoId && /^RD[A-Za-z0-9_-]{11}$/.test(listId)) videoId = listId.slice(2);
    } else if (listId) {
      type = 'playlist';
    }
    if (!videoId && !listId) return null;

    return {
      url: String(raw.url).trim(),
      title: raw.title || '',
      type,
      videoId,
      listId,
      start: parseTime(url.searchParams.get('t') || url.searchParams.get('start')),
      key: listId ? 'list:' + listId : 'video:' + videoId,
      openInTab: !!raw.openInTab,
      shuffle: raw.shuffle !== false
    };
  }

  MOODS.forEach(m => {
    m.parsed = m.sources.map(parseSource).filter(Boolean);
    m.style = m.style || {};
    if (m.parsed.length < m.sources.length) {
      console.warn('[Soundtrack] Niet elke link in mood "' + m.id + '" is een geldige YouTube-URL.');
    }
  });

  // ---------- state ----------
  const state = {
    mood: null,
    source: null,
    queue: [],
    pos: 0,
    player: null,
    playerReady: false,
    apiRequested: false,
    pending: null,
    playing: false,
    failStreak: 0,
    trackFails: 0,
    pendingShuffle: false,
    mixFallback: false,
    mixTimer: null,
    endTimer: null,
    segment: null,
    showMore: false
  };

  // ---------- UI-elementen ----------
  const el = {
    now: $('now'), word: $('nowWord'), name: $('nowName'), sub: $('nowSub'),
    meta: $('nowMeta'), notice: $('nowNotice'), playerEmpty: $('playerEmpty'),
    play: $('btnPlay'), next: $('btnNext'), skip: $('btnSkip'), up: $('btnUp'), down: $('btnDown'),
    grid: $('grid'), chip: $('suggestChip'), chipName: $('suggestName'),
    feelBtn: $('feelBtn'), feelPop: $('feelPop'), feelOptions: $('feelOptions'), feelResult: $('feelResult'),
    timeline: $('timeline'), ticks: $('ticks'), dayTotal: $('dayTotal'), toast: $('toast'),
    themeColor: document.querySelector('meta[name="theme-color"]')
  };

  // ---------- kleine helpers ----------
  let toastTimer = null;
  function toast(text, action) {
    el.toast.textContent = text;
    if (action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = action.label;
      b.style.cssText = 'margin-left:10px;padding:4px 10px;border:0;border-radius:999px;background:#F6F3EE;color:#17130C;font-size:13px;';
      b.addEventListener('click', () => { el.toast.hidden = true; action.run(); });
      el.toast.appendChild(b);
    }
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, action ? 6000 : 3200);
  }

  function showNotice(text, link) {
    el.notice.textContent = text + (link ? ' ' : '');
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = link.label;
      el.notice.appendChild(a);
    }
    el.notice.hidden = false;
  }
  function clearNotice() { el.notice.hidden = true; el.notice.textContent = ''; }

  const pad = n => String(n).padStart(2, '0');
  const hhmm = d => pad(d.getHours()) + ':' + pad(d.getMinutes());
  const typeLabel = { playlist: 'Playlist', mix: 'Mix', video: 'Mix' };

  // ---------- thema ----------
  function applyTheme(mood) {
    const s = mood.style;
    const st = el.now.style;
    st.setProperty('--m-bg', s.bg || '#17130C');
    st.setProperty('--m-fg', s.fg || '#F6F3EE');
    st.setProperty('--m-font', s.font || 'inherit');
    st.setProperty('--m-weight', s.weight || 700);
    st.setProperty('--m-style', s.italic ? 'italic' : 'normal');
    el.word.textContent = s.word || mood.name.toUpperCase();
    el.name.textContent = mood.name;
    el.sub.textContent = mood.subtitle || '';
    el.now.classList.remove('is-idle');
    if (el.themeColor && s.bg) el.themeColor.setAttribute('content', s.bg);
  }

  // ---------- bronkeuze ----------
  function weight(src) {
    const r = ratings[src.key];
    return r === 1 ? 2 : r === -1 ? 0.2 : 1;
  }

  // Gewogen shuffle: duim-omhoog vaker vooraan, duim-omlaag meestal achteraan
  function buildQueue(mood, avoidKey) {
    const q = mood.parsed
      .map(s => ({ s, k: Math.pow(Math.random(), 1 / weight(s)) }))
      .sort((a, b) => b.k - a.k)
      .map(x => x.s);
    if (q.length > 1 && avoidKey && q[0].key === avoidKey) q.push(q.shift());
    return q;
  }

  function playMood(id) {
    const mood = byId(id);
    if (!mood) return;
    if (!mood.parsed.length) {
      toast('Mood "' + mood.name + '" heeft nog geen geldige links in moods.js.');
      return;
    }
    closeSegment();
    state.mood = mood;
    state.queue = buildQueue(mood, lastByMood[mood.id]);
    state.pos = 0;
    state.failStreak = 0;
    store.set('lastMood', mood.id);
    applyTheme(mood);
    if (!mood.featured) state.showMore = true;
    renderTiles();
    playSource(state.queue[0]);
  }

  function nextSource() {
    if (!state.mood) return;
    state.pos++;
    if (state.pos >= state.queue.length) {
      state.queue = buildQueue(state.mood, state.source && state.source.key);
      state.pos = 0;
    }
    closeSegment();
    playSource(state.queue[state.pos]);
  }

  function playSource(src) {
    state.source = src;
    state.trackFails = 0;
    state.mixFallback = false;
    state.pendingShuffle = false;
    clearTimeout(state.mixTimer);
    clearTimeout(state.endTimer);
    clearNotice();
    lastByMood[state.mood.id] = src.key;
    store.set('lastByMood', lastByMood);
    updateMeta(src.title);
    updateRatingButtons();
    setControlsEnabled(true);

    if (src.openInTab) {
      window.open(src.url, '_blank', 'noopener');
      if (state.playerReady) state.player.stopVideo();
      showNotice('Deze bron speelt in een YouTube-tabblad.', { href: src.url, label: 'Opnieuw openen ↗' });
      logInstant();
      return;
    }

    withPlayer(p => {
      el.playerEmpty.hidden = true;
      if (src.type === 'video') {
        p.loadVideoById({ videoId: src.videoId, startSeconds: src.start || 0 });
      } else {
        state.pendingShuffle = src.shuffle;
        p.loadPlaylist({ list: src.listId, listType: 'playlist', index: 0, startSeconds: src.start || 0 });
        if (src.type === 'mix') {
          // Mixen (list=RD...) laden niet altijd in een embed: na een paar seconden controleren
          state.mixTimer = setTimeout(() => {
            if (state.source !== src) return;
            const list = safe(() => p.getPlaylist());
            if ((!list || !list.length) && !state.playing) mixFallback(src);
          }, 8000);
        }
      }
    });
  }

  function mixFallback(src) {
    if (state.mixFallback) return false;
    state.mixFallback = true;
    clearTimeout(state.mixTimer);
    showNotice('Deze YouTube Mix speelt niet in de ingebouwde speler.', { href: src.url, label: 'Open de Mix in YouTube ↗' });
    if (src.videoId && state.playerReady) {
      state.player.loadVideoById({ videoId: src.videoId, startSeconds: src.start || 0 });
      return true;
    }
    return false;
  }

  function updateMeta(title) {
    if (!state.source || !state.mood) { el.meta.textContent = ''; return; }
    const n = state.queue.length;
    const t = title || state.source.title || '';
    el.meta.textContent = typeLabel[state.source.type] + ' ' + (state.pos + 1) + ' van ' + n + (t ? ' · ' + t : '');
    el.meta.title = t;
  }

  function setControlsEnabled(on) {
    [el.play, el.next, el.skip, el.up, el.down].forEach(b => { b.disabled = !on; });
    el.next.disabled = !on || !state.mood || state.mood.parsed.length < 2;
  }

  function setPlaying(on) {
    state.playing = on;
    el.now.classList.toggle('is-playing', on);
    el.play.setAttribute('aria-label', on ? 'Pauze' : 'Afspelen');
    document.title = (on && state.mood ? '▶ ' + state.mood.name + ' · ' : '') + 'Soundtrack';
  }

  // ---------- YouTube IFrame Player API ----------
  function safe(fn) { try { return fn(); } catch (e) { return null; } }

  function loadApi() {
    if (state.apiRequested) return;
    state.apiRequested = true;
    if (location.protocol === 'file:') {
      showNotice('Open deze pagina via een webadres (GitHub Pages of een lokale server); YouTube speelt niet vanaf een los bestand.');
    }
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => toast('De YouTube-speler kon niet laden. Check je verbinding.');
    document.head.appendChild(s);
  }

  window.onYouTubeIframeAPIReady = function () {
    const vars = { playsinline: 1, rel: 0, iv_load_policy: 3 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    state.player = new YT.Player('player', {
      width: '100%',
      height: '100%',
      playerVars: vars,
      events: {
        onReady() {
          state.playerReady = true;
          if (state.pending) { const f = state.pending; state.pending = null; f(state.player); }
        },
        onStateChange: onPlayerState,
        onError: onPlayerError
      }
    });
  };

  function withPlayer(fn) {
    if (state.playerReady) fn(state.player);
    else { state.pending = fn; loadApi(); }
  }

  function onPlayerState(e) {
    const p = state.player;
    const S = YT.PlayerState;

    if (state.pendingShuffle) {
      const list = safe(() => p.getPlaylist());
      if (list && list.length > 1) {
        state.pendingShuffle = false;
        safe(() => p.setShuffle(true));
        p.playVideoAt(Math.floor(Math.random() * list.length));
        return;
      }
    }

    if (e.data === S.PLAYING) {
      clearTimeout(state.endTimer);
      clearTimeout(state.mixTimer);
      setPlaying(true);
      state.failStreak = 0;
      state.trackFails = 0;
      const data = safe(() => p.getVideoData());
      if (data && data.title) updateMeta(data.title);
      openSegment();
    } else if (e.data === S.PAUSED) {
      setPlaying(false);
      closeSegment();
    } else if (e.data === S.ENDED) {
      setPlaying(false);
      closeSegment();
      // Bij playlists komt ENDED ook tussen nummers; even wachten of er nog iets volgt
      const src = state.source;
      state.endTimer = setTimeout(() => {
        if (state.source === src && safe(() => p.getPlayerState()) === S.ENDED) nextSource();
      }, src && src.type === 'video' ? 300 : 2500);
    }
  }

  const ERRORS = {
    2: 'ongeldige link', 5: 'speelt niet in deze browser', 100: 'video bestaat niet (meer)',
    101: 'niet beschikbaar of niet insluitbaar', 150: 'niet beschikbaar of niet insluitbaar', 153: 'speler-instelling geweigerd'
  };

  function onPlayerError(e) {
    const src = state.source;
    if (!src) return;
    const reason = ERRORS[e.data] || 'fout ' + e.data;
    console.warn('[Soundtrack] Speler-fout', e.data, src.url);

    if (src.type === 'mix' && !state.mixFallback) {
      if (mixFallback(src)) return;
    }

    // Eén kapot nummer in een playlist: naar het volgende nummer
    if (src.type === 'playlist' && state.trackFails < 5) {
      const list = safe(() => state.player.getPlaylist());
      if (list && list.length > 1) {
        state.trackFails++;
        safe(() => state.player.nextVideo());
        return;
      }
    }

    state.failStreak++;
    if (state.failStreak >= state.mood.parsed.length) {
      setPlaying(false);
      showNotice('Geen enkele link van "' + state.mood.name + '" speelt nu (' + reason + '). Check de links in moods.js.', { href: src.url, label: 'Laatste link openen ↗' });
      return;
    }
    toast('Overgeslagen: ' + (src.title || 'deze bron') + ' (' + reason + ')');
    setTimeout(nextSource, 700);
  }

  // ---------- bediening ----------
  function togglePlay() {
    if (!state.source) {
      const id = state.mood ? state.mood.id : suggestion().id;
      if (id) playMood(id);
      return;
    }
    if (!state.playerReady) return;
    const s = safe(() => state.player.getPlayerState());
    if (s === YT.PlayerState.PLAYING || s === YT.PlayerState.BUFFERING) state.player.pauseVideo();
    else state.player.playVideo();
  }

  function skipAhead() {
    if (!state.playerReady || !state.source) return;
    const p = state.player;
    const now = p.getCurrentTime() || 0;
    const dur = p.getDuration() || 0;
    if (dur && now + SKIP_SECONDS > dur - 5 && state.source.type === 'video') {
      toast('Minder dan 10 minuten over; door naar de volgende mix.');
      nextSource();
      return;
    }
    p.seekTo(now + SKIP_SECONDS, true);
    toast('+10 min');
  }

  function rate(value) {
    const src = state.source;
    if (!src) return;
    if (ratings[src.key] === value) {
      delete ratings[src.key];
      toast('Beoordeling weggehaald');
    } else {
      ratings[src.key] = value;
      if (value === 1) toast('Komt vaker langs 👍');
      else toast('Komt minder vaak langs', { label: 'Nu overslaan', run: nextSource });
    }
    store.set('ratings', ratings);
    updateRatingButtons();
  }

  function updateRatingButtons() {
    const r = state.source ? ratings[state.source.key] : 0;
    el.up.setAttribute('aria-pressed', String(r === 1));
    el.down.setAttribute('aria-pressed', String(r === -1));
  }

  el.play.addEventListener('click', togglePlay);
  el.next.addEventListener('click', nextSource);
  el.skip.addEventListener('click', skipAhead);
  el.up.addEventListener('click', () => rate(1));
  el.down.addEventListener('click', () => rate(-1));

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'Escape') { closeFeel(); return; }
    if (e.key === ' ' && tag !== 'button') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'n' || e.key === 'N') nextSource();
    else if (/^[1-9]$/.test(e.key)) {
      const m = visibleMoods()[+e.key - 1];
      if (m) playMood(m.id);
    }
  });

  // ---------- tiles ----------
  function visibleMoods() {
    return MOODS.filter(m => m.featured !== false || state.showMore);
  }

  function renderTiles() {
    el.grid.textContent = '';
    visibleMoods().forEach((m, i) => {
      const s = m.style;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile deco-' + (s.deco || 'none') + (state.mood === m ? ' is-active' : '');
      b.style.setProperty('--t-bg', s.bg || '#222');
      b.style.setProperty('--t-fg', s.fg || '#fff');
      b.style.setProperty('--t-font', s.font || 'inherit');
      b.style.setProperty('--t-weight', s.weight || 700);
      b.style.setProperty('--t-style', s.italic ? 'italic' : 'normal');
      b.setAttribute('aria-pressed', String(state.mood === m));
      b.title = m.name + (i < 9 ? ' (toets ' + (i + 1) + ')' : '');
      b.innerHTML =
        '<span class="tile-deco" aria-hidden="true"></span>' +
        '<span class="tile-word" aria-hidden="true"></span>' +
        '<span class="tile-name"></span><span class="tile-sub"></span>';
      b.querySelector('.tile-word').textContent = s.word || '';
      b.querySelector('.tile-name').textContent = m.name;
      b.querySelector('.tile-sub').textContent = m.subtitle || '';
      b.addEventListener('click', () => playMood(m.id));
      el.grid.appendChild(b);
    });

    const extra = MOODS.filter(m => m.featured === false).length;
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'tile tile-more';
    if (!extra) {
      more.innerHTML = '<span class="plus">+</span><span>Meer moods</span><small>Voeg ze toe in moods.js</small>';
      more.addEventListener('click', () => toast('Nieuwe mood? Kopieer een blok in moods.js en zet featured op false.'));
    } else {
      more.innerHTML = state.showMore
        ? '<span class="plus">−</span><span>Minder moods</span>'
        : '<span class="plus">+</span><span>Meer moods</span><small>' + extra + ' extra</small>';
      more.setAttribute('aria-expanded', String(state.showMore));
      more.addEventListener('click', () => { state.showMore = !state.showMore; renderTiles(); });
    }
    el.grid.appendChild(more);
  }

  // ---------- voorstel ----------
  function toMinutes(hm) {
    const [h, m] = String(hm).split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  function suggestion() {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();

    // Gewoonte: welke mood kies je meestal rond dit uur (minstens 3 verschillende dagen)?
    const days = {};
    log.forEach(s => {
      const d = new Date(s.start);
      if (d.getHours() !== now.getHours() || !byId(s.mood)) return;
      (days[s.mood] = days[s.mood] || new Set()).add(d.toDateString());
    });
    let habit = null, best = 2;
    Object.keys(days).forEach(id => { if (days[id].size > best) { best = days[id].size; habit = id; } });
    if (habit) return { id: habit, why: 'Kies je meestal rond deze tijd' };

    let pick = null;
    SCHEDULE.forEach(r => { if (toMinutes(r.from) <= mins) pick = r.mood; });
    if (!pick && SCHEDULE.length) pick = SCHEDULE[SCHEDULE.length - 1].mood;
    if (!byId(pick)) pick = MOODS[0] && MOODS[0].id;
    return { id: pick, why: 'Op basis van het tijdstip' };
  }

  function renderSuggestion() {
    const s = suggestion();
    const m = byId(s.id);
    el.chipName.textContent = m ? m.name : '–';
    el.chip.title = s.why + '. Klik om te starten.';
  }
  el.chip.addEventListener('click', () => { const s = suggestion(); if (s.id) playMood(s.id); });

  // ---------- hoe voel ik me ----------
  FEELINGS.forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = (f.emoji ? f.emoji + ' ' : '') + f.label;
    b.addEventListener('click', () => logFeeling(f));
    el.feelOptions.appendChild(b);
  });

  function logFeeling(f) {
    const t = Date.now();
    feelings.push({ t, feeling: f.id });
    store.set('feelings', feelings);
    renderDay();
    el.feelResult.textContent = 'Gelogd om ' + hhmm(new Date(t)) + '. ';
    const m = byId(f.suggest);
    if (m) {
      el.feelResult.appendChild(document.createTextNode('Past misschien:'));
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = m.name;
      b.addEventListener('click', () => { closeFeel(); playMood(m.id); });
      el.feelResult.appendChild(b);
    }
    el.feelResult.hidden = false;
  }

  function openFeel() {
    el.feelResult.hidden = true;
    el.feelPop.hidden = false;
    el.feelBtn.setAttribute('aria-expanded', 'true');
  }
  function closeFeel() {
    el.feelPop.hidden = true;
    el.feelBtn.setAttribute('aria-expanded', 'false');
  }
  el.feelBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (el.feelPop.hidden) openFeel(); else closeFeel();
  });
  document.addEventListener('click', e => {
    if (!el.feelPop.hidden && !el.feelPop.contains(e.target)) closeFeel();
  });

  // ---------- luisterlog ----------
  function saveLog() { store.set('log', log); }

  function openSegment() {
    if (!state.mood || !state.source) return;
    const now = Date.now();
    const last = log[log.length - 1];
    // Korte pauze bij dezelfde bron: hetzelfde segment voortzetten
    if (state.segment && state.segment === last && last.mood === state.mood.id && now - last.end < 90000) {
      last.end = now;
    } else if (!state.segment && last && last.mood === state.mood.id && last.key === state.source.key && now - last.end < 90000) {
      state.segment = last;
      last.end = now;
    } else {
      state.segment = { mood: state.mood.id, key: state.source.key, start: now, end: now };
      log.push(state.segment);
    }
    saveLog();
    renderDay();
  }

  function closeSegment() {
    if (!state.segment) return;
    if (state.playing) state.segment.end = Date.now();
    state.segment = null;
    saveLog();
    renderDay();
  }

  function logInstant() {
    const now = Date.now();
    log.push({ mood: state.mood.id, key: state.source.key, start: now, end: now + 60000 });
    saveLog();
    renderDay();
  }

  setInterval(() => {
    if (state.playing && state.segment) {
      state.segment.end = Date.now();
      saveLog();
      renderDay();
    }
  }, HEARTBEAT_MS);

  window.addEventListener('pagehide', () => {
    if (state.playing && state.segment) { state.segment.end = Date.now(); saveLog(); }
  });

  // ---------- je dag in muziek ----------
  function renderDay() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const t0 = today.getTime();
    const segs = log.filter(s => s.end > t0);
    const feels = feelings.filter(f => f.t > t0);

    let startH = 9, endH = 18;
    segs.forEach(s => {
      startH = Math.min(startH, new Date(Math.max(s.start, t0)).getHours());
      endH = Math.max(endH, Math.ceil((s.end - t0) / 36e5));
    });
    feels.forEach(f => {
      const h = new Date(f.t).getHours();
      startH = Math.min(startH, h);
      endH = Math.max(endH, h + 1);
    });
    endH = Math.min(24, Math.max(endH, startH + 1));

    const from = t0 + startH * 36e5;
    const span = (endH - startH) * 36e5;
    const pct = t => Math.max(0, Math.min(100, (t - from) / span * 100));

    el.timeline.textContent = '';
    let total = 0;
    segs.forEach(s => {
      const m = byId(s.mood);
      const a = pct(Math.max(s.start, t0));
      const b = pct(s.end);
      total += s.end - Math.max(s.start, t0);
      const d = document.createElement('div');
      d.className = 'seg';
      d.style.left = a + '%';
      d.style.width = Math.max(b - a, 0.3) + '%';
      d.style.background = (m && m.style.tag) || '#999';
      d.title = (m ? m.name : s.mood) + ' · ' + hhmm(new Date(s.start)) + '–' + hhmm(new Date(s.end));
      el.timeline.appendChild(d);
    });

    const nowT = Date.now();
    if (nowT > from && nowT < from + span) {
      const n = document.createElement('div');
      n.className = 'now-mark';
      n.style.left = pct(nowT) + '%';
      n.title = 'Nu';
      el.timeline.appendChild(n);
    }

    feels.forEach(f => {
      const def = FEELINGS.find(x => x.id === f.feeling);
      const d = document.createElement('div');
      d.className = 'feel-mark';
      d.style.left = pct(f.t) + '%';
      d.title = (def ? def.label : f.feeling) + ' · ' + hhmm(new Date(f.t));
      el.timeline.appendChild(d);
    });

    el.ticks.textContent = '';
    const step = (endH - startH) <= 12 ? 3 : 4;
    for (let h = startH; h <= endH - step / 2; h += step) addTick(h);
    addTick(endH);
    function addTick(h) {
      const s = document.createElement('span');
      s.style.left = ((h - startH) / (endH - startH) * 100) + '%';
      s.textContent = pad(h % 24) + ':00';
      el.ticks.appendChild(s);
    }

    const mins = Math.round(total / 60000);
    el.dayTotal.textContent = mins
      ? (mins >= 60 ? Math.floor(mins / 60) + ' u ' + (mins % 60) + ' min' : mins + ' min') + ' muziek vandaag'
      : 'nog niks gespeeld vandaag';
  }

  // ---------- start ----------
  renderTiles();
  renderSuggestion();
  renderDay();
  setInterval(() => { renderSuggestion(); renderDay(); }, 60000);

  // Laatst gebruikte mood alvast klaarzetten (zonder automatisch te spelen)
  const lastMood = byId(store.get('lastMood', null));
  if (lastMood) {
    state.mood = lastMood;
    if (lastMood.featured === false) state.showMore = true;
    applyTheme(lastMood);
    el.meta.textContent = 'Klaar om verder te gaan. Druk op play.';
    renderTiles();
  }
  // Play zonder gekozen mood start het voorstel
  el.play.disabled = false;

  loadApi();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => console.warn('[Soundtrack] SW', err));
    });
  }
})();
