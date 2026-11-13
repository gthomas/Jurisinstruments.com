/* Juris waitlist: waitlist form JPI-W-1, source attribution, analytics.
   Configure once the Google Form and Cloudflare site exist; until then the form falls back to email. */
(function () {
  var CONFIG = {
    // Google Form "formResponse" URL, e.g. https://docs.google.com/forms/d/e/XXXX/formResponse
    formAction: 'https://docs.google.com/forms/d/e/1FAIpQLScy_N49OnKgM5HUVb5XowQopmh5ZXrisk8zXxP4oJ5xvW-1cg/formResponse',
    // entry.NNNN ids from the form's pre-filled link, one per field below
    entries: { email: 'entry.823010872', instrument: 'entry.348580055', finish: 'entry.869707110', fee: 'entry.142267292', profession: 'entry.855771643', heard: 'entry.1441072151', source: 'entry.275536906' },
    // Cloudflare Web Analytics beacon token
    cfToken: '',
    mailto: 'info@jurisinstruments.com',
    // until the form is in service: show the notice and hold the submit button
    notLive: false,
    opensBy: 'Friday, 13 November 2026',
    instagram: 'juris_instruments'
  };

  // ---- analytics
  if (CONFIG.cfToken) {
    var s = document.createElement('script'); s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cfToken }));
    document.head.appendChild(s);
  }

  // ---- source attribution: ?ref= / utm_source, else the referring site; kept for the visit
  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  try {
    var q = new URLSearchParams(location.search);
    var ref = q.get('ref') || q.get('utm_source');
    if (ref) store('jpi_ref', ref + (q.get('utm_campaign') ? '/' + q.get('utm_campaign') : ''));
    else if (!read('jpi_ref') && document.referrer) {
      var h = new URL(document.referrer).hostname;
      if (h && h !== location.hostname) store('jpi_ref', h);
    }
  } catch (e) {}

  function entered() { try { return localStorage.getItem('jpi_req') === '1'; } catch (e) { return false; } }
  function markEntered() { try { localStorage.setItem('jpi_req', '1'); } catch (e) {} }


  // ---- appearances: a number per device, and a Notice of Appearance card (1080 x 1920, for a story)
  function appeared() { try { return localStorage.getItem('jpi_app') || ''; } catch (e) { return ''; } }
  function markAppeared(n) { try { localStorage.setItem('jpi_app', n); } catch (e) {} }
  function appearanceNo() {
    var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
    var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '';
    for (var i = 0; i < 4; i++) r += c.charAt(Math.floor(Math.random() * c.length));
    return 'A-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
  }
  function drawNotice(no) {
    var W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var g = cv.getContext('2d'), INK = '#16181B', INK2 = '#565A5F', PAPER = '#F4F2EA', RULE = '#D3D0C5';
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    g.strokeStyle = RULE; g.lineWidth = 1;
    for (var x = 0; x <= W; x += 27) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, H); g.stroke(); }
    for (var y = 0; y <= H; y += 27) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(W, y + .5); g.stroke(); }
    g.fillStyle = 'rgba(244,242,234,.94)'; g.fillRect(60, 60, W - 120, H - 120);
    g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(60, 60, W - 120, H - 120);
    var L = 120, R = W - 120;
    function lab(t, x, y, col, al) { g.font = '600 26px "Barlow Condensed", "Arial Narrow", sans-serif'; g.fillStyle = col || INK; g.textAlign = al || 'left'; if ('letterSpacing' in g) g.letterSpacing = '5px'; g.fillText(t.toUpperCase(), x, y); if ('letterSpacing' in g) g.letterSpacing = '0px'; }
    function rule(y, w) { g.fillStyle = INK; g.fillRect(L, y, R - L, w || 2); }
    function wrap(t, x, y, maxw, lh, font, col) { g.font = font; g.fillStyle = col || INK; g.textAlign = 'left'; var words = t.split(' '), line = ''; for (var i = 0; i < words.length; i++) { var tst = line ? line + ' ' + words[i] : words[i]; if (g.measureText(tst).width > maxw && line) { g.fillText(line, x, y); y += lh; line = words[i]; } else line = tst; } g.fillText(line, x, y); return y + lh; }
    // insignia: nine-patch octagon
    function insignia(cx, cy, s) { g.save(); g.translate(cx - s / 2, cy - s / 2); g.scale(s / 32, s / 32); g.beginPath(); g.moveTo(10, 0); g.lineTo(22, 0); g.lineTo(32, 10); g.lineTo(32, 22); g.lineTo(22, 32); g.lineTo(10, 32); g.lineTo(0, 22); g.lineTo(0, 10); g.closePath(); g.clip(); g.fillStyle = INK; [[0, 9], [11, 10], [23, 9]].forEach(function (a) { [[0, 9], [11, 10], [23, 9]].forEach(function (b) { g.fillRect(a[0], b[0], a[1], b[1]); }); }); g.restore(); }
    insignia(L + 22, 141, 44); lab('Juris Professional Instruments', L + 66, 150); lab('Form JPI-A-1', R, 150, INK2, 'right'); rule(180);
    lab('Notice of Appearance', L, 300, INK2);
    g.font = '700 168px "Barlow Condensed", "Arial Narrow", sans-serif'; g.fillStyle = INK; g.textAlign = 'left';
    g.fillText('ENTERED.', L, 470);
    g.fillStyle = PAPER; g.fillRect(L, 470 - 168 * .72 + 168 * .2, R - L, 4); g.fillRect(L, 470 - 168 * .72 + 168 * .46, R - L, 4);
    var y = wrap('The undersigned has entered an appearance before Juris Professional Instruments, and accepts service.', L, 590, R - L, 64, '46px "Old Standard TT", Georgia, serif');
    y = wrap('The undersigned is a party to nothing. Nothing is owed.', L, y + 26, R - L, 64, 'italic 46px "Old Standard TT", Georgia, serif');
    rule(1060); lab('Appearance no.', L, 1120, INK2);
    g.font = '500 92px "IBM Plex Mono", Menlo, monospace'; g.fillStyle = INK; g.fillText(no, L, 1230);
    rule(1280, 1); lab('Entered', L, 1340, INK2);
    var d = new Date(), months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    g.font = '500 44px "IBM Plex Mono", Menlo, monospace'; g.fillStyle = INK; g.fillText(d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear(), L, 1405);
    rule(1450, 1); lab('Docket', L, 1510, INK2);
    g.font = '500 44px "IBM Plex Mono", Menlo, monospace'; g.fillStyle = INK; g.fillText('C-75 · C-75A · C-75T', L, 1575);
    rule(1700); lab('@juris_instruments', L, 1760); g.font = 'italic 34px "Old Standard TT", Georgia, serif'; g.fillStyle = INK2; g.textAlign = 'right'; g.fillText('Res ipsa non loquitur', R, 1760);
    return cv;
  }
  function showNotice(r, no, prior) {
    r.hidden = false;
    r.innerHTML = (prior ? 'An appearance from this device is on file.' : 'Entered. You are on the record and will be served Notices by email. Nothing is owed.') +
      '<div class="ap-no">Appearance no. <b>' + no + '</b></div><div class="ap-card"></div>' +
      '<div class="ap-act"><button type="button" class="btn ap-share">Display the notice</button><a class="lab ap-save" download="juris-notice-of-appearance-' + no + '.png">Save the notice</a></div>' +
      '<div class="ap-hint">For a story. Tag @' + CONFIG.instagram + ' and it may be entered into the record.</div>';
    var fonts = ['700 168px "Barlow Condensed"', '600 26px "Barlow Condensed"', '46px "Old Standard TT"', 'italic 46px "Old Standard TT"', '500 92px "IBM Plex Mono"'];
    var ready = (document.fonts && document.fonts.load) ? Promise.all(fonts.map(function (x) { return document.fonts.load(x); })) : Promise.resolve();
    ready.catch(function () {}).then(function () {
      var cv = drawNotice(no); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Notice of Appearance, number ' + no);
      r.querySelector('.ap-card').appendChild(cv);
      var url = cv.toDataURL('image/png'); r.querySelector('.ap-save').href = url;
      r.querySelector('.ap-share').addEventListener('click', function () {
        cv.toBlob(function (b) {
          var file = new File([b], 'juris-notice-of-appearance-' + no + '.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] }).catch(function () {});
          else r.querySelector('.ap-save').click();
        }, 'image/png');
      });
    });
  }

  // ---- forms
  document.querySelectorAll('form[data-waitlist]').forEach(function (f) {
    if (CONFIG.notLive) {
      var n = document.createElement('div'); n.className = 'wl-notice';
      n.innerHTML = '<b>Notice.</b> Form JPI-W-1 is not yet in service. The waitlist will open by ' + CONFIG.opensBy +
        '. In the interim the Corporation may be reached on Instagram, <a href="https://www.instagram.com/' + CONFIG.instagram + '/" rel="noopener">@' + CONFIG.instagram + '</a>.';
      var hd = f.querySelector('.fh'); if (hd && hd.nextSibling) f.insertBefore(n, hd.nextSibling); else f.insertBefore(n, f.firstChild);
      var sb = f.querySelector('button[type=submit]'); if (sb) { sb.disabled = true; sb.textContent = 'Not yet in service'; }
      f.addEventListener('submit', function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); }, true);
      return;
    }
    var r = f.querySelector('.receipt'), e = f.querySelector('input[type=email]'), btn = f.querySelector('button[type=submit]');
    if (f.getAttribute('data-kind') === 'appearance') { var prior = appeared(); if (prior) showNotice(r, prior, true); }
    else if (entered()) { r.hidden = false; r.textContent = 'A petition from this device is already on file.'; }
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      r.hidden = false;
      if (!e.value || !e.checkValidity()) { r.textContent = 'Field 1 is incomplete. A correspondence address is required.'; e.focus(); return; }
      var data = {};
      Array.prototype.forEach.call(f.elements, function (el) { if (el.name) data[el.name] = el.value; });
      data.source = read('jpi_ref') || 'direct';
      var kind = f.getAttribute('data-kind') || 'allocation';
      if (kind === 'appearance') {
        var no = appearanceNo();
        data.instrument = 'Undetermined'; data.finish = 'Undecided'; data.fee = 'Observe only';
        data.profession = ''; data.heard = 'Not stated';
        data.source = 'appearance ' + no + ' / ' + data.source;
      }
      if (!CONFIG.formAction) {
        var body = Object.keys(data).map(function (k) { return k + ': ' + data[k]; }).join('\n');
        location.href = 'mailto:' + CONFIG.mailto + '?subject=' + encodeURIComponent('Waitlist entry JPI-W-1') + '&body=' + encodeURIComponent(body);
        r.textContent = 'Your mail program has been asked to send this entry. Send the message to complete it.';
        return;
      }
      var p = new URLSearchParams();
      Object.keys(CONFIG.entries).forEach(function (k) { if (CONFIG.entries[k] && data[k] != null) p.append(CONFIG.entries[k], data[k]); });
      btn.disabled = true; r.textContent = 'Filing…';
      fetch(CONFIG.formAction, { method: 'POST', mode: 'no-cors', body: p })
        .then(function () {
          if (kind === 'appearance') { markAppeared(no); showNotice(r, no); f.reset(); return; }
          markEntered();
          r.innerHTML = '<div style="width:220px;max-width:70%;margin:6px 0 14px;text-transform:none;letter-spacing:normal"><svg class="motto-lk" viewBox="0 0 148 64" role="img" aria-label="Juris Professional Instruments. Res ipsa non loquitur."><g transform="translate(0,0)"><clipPath id="rc-c"><path d="M10,0 H22 L32,10 V22 L22,32 H10 L0,22 V10 Z"/></clipPath><g fill="currentColor" clip-path="url(#rc-c)"><rect x="0" y="0" width="9" height="9"/><rect x="0" y="11" width="9" height="10"/><rect x="0" y="23" width="9" height="9"/><rect x="11" y="0" width="10" height="9"/><rect x="11" y="11" width="10" height="10"/><rect x="11" y="23" width="10" height="9"/><rect x="23" y="0" width="9" height="9"/><rect x="23" y="11" width="9" height="10"/><rect x="23" y="23" width="9" height="9"/></g></g><mask id="rc-m" maskUnits="userSpaceOnUse" x="40" y="-2" width="112" height="36"><rect x="40" y="-2" width="112" height="36" fill="#fff"/><rect x="40" y="9" width="112" height="2" fill="#000"/><rect x="40" y="21" width="112" height="2" fill="#000"/></mask><text x="44" y="32" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="45.71" textLength="104" lengthAdjust="spacing" fill="currentColor" mask="url(#rc-m)">JURIS</text><text x="44.4" y="44" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="500" font-size="8.57" letter-spacing=".6" fill="currentColor">PROFESSIONAL</text><text x="148" y="44" text-anchor="end" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="500" font-size="8.57" letter-spacing=".6" fill="currentColor">INSTRUMENTS</text><rect x="0" y="50" width="148" height="0.8" fill="currentColor"/><text x="44" y="61.5" text-anchor="start" font-family="Old Standard TT, Century Schoolbook, Georgia, serif" font-style="italic" font-size="10.5" fill="currentColor">Res ipsa non loquitur</text></svg></div>Filed. Your petition is on file in order of receipt, and serial numbers follow that order. You will be written to when Allocation opens. No payment has been taken.';
          f.reset();
        })
        .catch(function () {
          r.textContent = 'The entry could not be recorded. Write to ' + CONFIG.mailto + ' and it will be entered by hand.';
        })
        .then(function () { btn.disabled = false; });
    });
  });
})();
