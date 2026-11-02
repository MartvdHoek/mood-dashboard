/* Proefkamer — kandidaten beluisteren en keuren. Kandidaten staan in kandidaten.js. */
(function () {
  'use strict';

  const VIBES = (window.PROEF || []).map(v => {
    const base = (window.MOODS || []).find(m => m.id === v.mood);
    return Object.assign({ isNew: !base }, base || {}, v, { style: v.style || (base && base.style) || {} });
  });
  const $ = id => document.getElementById(id);
  const KEY = 'soundtrack.proef';
  const START_AT = 240; // begin 4 minuten in een lange mix, voorbij het intro

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* geen opslag */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* vol */ } };
  const vibeData = id => (saved[id] = saved[id] || { verdicts: {}, note: '', want: null });

  let current = VIBES[0] && VIBES[0].mood;
  try { current = sessionStorage.getItem('proef.tab') || current; } catch (e) { /* */ }
  if (!VIBES.some(v => v.mood === current)) current = VIBES[0] && VIBES[0].mood;

  let player = null, ready = false, pending = null, playing = null;

  // ---------- speler ----------
  window.onYouTubeIframeAPIReady = function () {
    const vars = { playsinline: 1, rel: 0, iv_load_policy: 3 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    player = new YT.Player('player', {
      width: '100%', height: '100%', playerVars: vars,
      events: {
        onReady() { ready = true; if (pending) { pending(); pending = null; } },
        onStateChange(e) {
          $('btnToggle').textContent = e.data === YT.PlayerState.PLAYING ? 'Pauze' : 'Afspelen';
          const d = player.getVideoData && player.getVideoData();
          if (playing && playing.isList && d && d.title) $('stageSub').textContent = 'Nu: ' + d.title;
        },
        onError(e) {
          $('stageSub').textContent = 'Deze speelt niet in de speler (fout ' + e.data + '). Markeer hem gerust als "past niet".';
        }
      }
    });
  };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);

  function play(vibe, c) {
    playing = { id: c.id, isList: c.id.startsWith('PL') };
    $('playerEmpty').hidden = true;
    $('stageTitle').textContent = c.title;
    $('stageSub').textContent = (vibe.name || vibe.mood) + ' · ' + c.channel;
    ['btnToggle', 'btnSkip'].forEach(id => { $(id).disabled = false; });
    $('btnNextTrack').disabled = !playing.isList;
    const go = () => {
      if (playing.isList) {
        player.loadPlaylist({ list: c.id, listType: 'playlist', index: Math.floor(Math.random() * Math.min(c.tracks || 20, 200)) });
      } else {
        player.loadVideoById({ videoId: c.id, startSeconds: (c.mins || 0) > 20 ? START_AT : 0 });
      }
    };
    if (ready) go(); else pending = go;
    renderVibe();
  }

  $('btnToggle').addEventListener('click', () => {
    if (!ready) return;
    if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo(); else player.playVideo();
  });
  $('btnSkip').addEventListener('click', () => { if (ready) player.seekTo((player.getCurrentTime() || 0) + 600, true); });
  $('btnNextTrack').addEventListener('click', () => { if (ready) player.nextVideo(); });

  // ---------- tabs ----------
  function renderTabs() {
    const tabs = $('tabs');
    tabs.textContent = '';
    VIBES.forEach(v => {
      const d = vibeData(v.mood);
      const n = Object.keys(d.verdicts).length;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tab';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(v.mood === current));
      b.innerHTML = '<span class="sw"></span><span class="nm"></span><span class="count"></span>';
      b.querySelector('.sw').style.background = v.style.tag || v.style.fg || '#999';
      b.querySelector('.nm').textContent = (v.name || v.mood) + (v.isNew ? ' ✦' : '');
      b.querySelector('.count').textContent = n + '/' + v.candidates.length;
      b.addEventListener('click', () => {
        current = v.mood;
        try { sessionStorage.setItem('proef.tab', current); } catch (e) { /* */ }
        renderTabs();
        renderVibe();
      });
      tabs.appendChild(b);
    });
  }

  // ---------- één vibe ----------
  function tileFor(v) {
    const st = v.style;
    const t = document.createElement('div');
    t.className = 'tile deco-' + (st.deco || 'none');
    t.style.setProperty('--t-bg', st.bg || '#222');
    t.style.setProperty('--t-fg', st.fg || '#fff');
    t.style.setProperty('--t-font', st.font || 'inherit');
    t.style.setProperty('--t-weight', st.weight || 700);
    t.style.setProperty('--t-style', st.italic ? 'italic' : 'normal');
    t.innerHTML = '<span class="tile-deco" aria-hidden="true"></span><span class="tile-word" aria-hidden="true"></span><span class="tile-name"></span><span class="tile-sub"></span>';
    t.querySelector('.tile-word').textContent = st.word || '';
    t.querySelector('.tile-name').textContent = v.name || v.mood;
    t.querySelector('.tile-sub').textContent = v.subtitle || '';
    return t;
  }

  function renderVibe() {
    const v = VIBES.find(x => x.mood === current);
    const box = $('vibe');
    box.textContent = '';
    if (!v) return;
    const d = vibeData(v.mood);

    const side = document.createElement('div');
    side.className = 'vibe-side';
    side.appendChild(tileFor(v));
    if (v.isNew) {
      const badge = document.createElement('span');
      badge.className = 'badge-new';
      badge.textContent = 'VOORSTEL NIEUWE MOOD';
      side.appendChild(badge);
      const want = document.createElement('div');
      want.className = 'want';
      [['ja', 'Deze mood wil ik'], ['nee', 'Hoeft niet']].forEach(([val, label]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pill';
        b.textContent = label;
        b.setAttribute('aria-pressed', String(d.want === val));
        b.addEventListener('click', () => { d.want = d.want === val ? null : val; save(); renderVibe(); renderResult(); });
        want.appendChild(b);
      });
      side.appendChild(want);
    }
    const q = document.createElement('p');
    q.className = 'q';
    q.textContent = v.question || 'Wat vind je van deze vibe?';
    side.appendChild(q);
    const note = document.createElement('textarea');
    note.className = 'note';
    note.placeholder = 'Wat past wel, wat mis je, welke artiesten denk je aan…';
    note.value = d.note || '';
    note.addEventListener('input', () => { d.note = note.value; save(); renderResult(); });
    side.appendChild(note);

    const list = document.createElement('div');
    list.className = 'cands';
    v.candidates.forEach(c => {
      const verdict = d.verdicts[c.id];
      const row = document.createElement('div');
      row.className = 'cand' + (playing && playing.id === c.id ? ' is-playing' : '') +
        (verdict === 'ja' ? ' is-yes' : verdict === 'nee' ? ' is-no' : '');
      row.innerHTML =
        '<button class="cand-play" type="button" aria-label="Luister"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg></button>' +
        '<div><div class="cand-title"></div><div class="cand-meta"></div></div>' +
        '<div class="verdict"><button type="button" class="yes">✓ Past</button><button type="button" class="no">✗ Past niet</button></div>';
      row.querySelector('.cand-title').textContent = c.title;
      const meta = row.querySelector('.cand-meta');
      meta.textContent = c.channel + ' · ' + (c.tracks ? 'playlist, ' + c.tracks + ' nummers' : c.mins + ' min');
      if (c.inMoods) {
        const tag = document.createElement('span');
        tag.className = 'tag-in';
        tag.textContent = 'staat er al in';
        meta.appendChild(tag);
      }
      row.querySelector('.cand-play').addEventListener('click', () => play(v, c));
      [['yes', 'ja'], ['no', 'nee']].forEach(([cls, val]) => {
        const b = row.querySelector('.' + cls);
        b.setAttribute('aria-pressed', String(verdict === val));
        b.addEventListener('click', () => {
          if (d.verdicts[c.id] === val) delete d.verdicts[c.id]; else d.verdicts[c.id] = val;
          save(); renderTabs(); renderVibe(); renderResult();
        });
      });
      list.appendChild(row);
    });

    box.appendChild(side);
    box.appendChild(list);
  }

  // ---------- resultaat ----------
  function renderResult() {
    const lines = ['PROEFKAMER-RESULTAAT'];
    let judged = 0;
    VIBES.forEach(v => {
      const d = vibeData(v.mood);
      const ids = Object.keys(d.verdicts);
      if (!ids.length && !d.note && !d.want) return;
      lines.push('', '## ' + (v.name || v.mood) + ' [' + v.mood + ']' + (v.isNew ? ' (nieuwe mood: ' + (d.want || '?') + ')' : ''));
      ['ja', 'nee'].forEach(val => {
        v.candidates.filter(c => d.verdicts[c.id] === val).forEach(c => {
          judged++;
          lines.push((val === 'ja' ? '  + ' : '  - ') + c.id + '  ' + c.title + ' (' + c.channel + ')');
        });
      });
      if (d.note) lines.push('  notitie: ' + d.note.replace(/\s+/g, ' ').trim());
    });
    $('resultText').value = lines.length > 1 ? lines.join('\n') : 'Nog niks gekeurd.';
    $('resultCount').textContent = judged + ' mixen gekeurd';
  }

  $('btnCopy').addEventListener('click', () => {
    const t = $('resultText');
    const done = () => { $('copyMsg').textContent = 'Gekopieerd! Plak het in de chat.'; };
    if (navigator.clipboard) navigator.clipboard.writeText(t.value).then(done, () => { t.select(); document.execCommand('copy'); done(); });
    else { t.select(); document.execCommand('copy'); done(); }
  });
  $('btnReset').addEventListener('click', () => {
    if (!confirm('Alle keuzes en notities in de Proefkamer wissen?')) return;
    saved = {};
    save();
    renderTabs(); renderVibe(); renderResult();
  });

  renderTabs();
  renderVibe();
  renderResult();
})();
