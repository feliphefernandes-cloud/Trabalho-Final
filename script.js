(function () {
  'use strict';

  
  var W = 900, H = 420, GROUND = 350, S = 3, TIME = 60;
  var DX = 100;                       
  var GROUND_TOP = GROUND - 29 * S;   
  var FONT = "'Lilita One','Arial Black',Impact,sans-serif";
  var LETTERS = ['#2f7de1', '#e8434f', '#ffd23f', '#35b34a'];

  var cv = document.getElementById('game');
  var ctx = cv.getContext('2d');
  var btn = document.getElementById('btn');
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.scale(DPR, DPR);
  ctx.imageSmoothingEnabled = false;
  if (document.fonts && document.fonts.load) { document.fonts.load("40px 'Lilita One'"); }


  function makeGrid(w, h) {
    var px = [];
    for (var y = 0; y < h; y++) { px.push(new Array(w).fill(null)); }
    return { w: w, h: h, px: px };
  }
  function put(g, x, y, c, only) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= g.w || y >= g.h) return;
    if (only && g.px[y][x] !== only) return;
    g.px[y][x] = c;
  }
  function rect(g, x, y, w, h, c, only) {
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) put(g, x + i, y + j, c, only);
  }
  function ell(g, cx, cy, rx, ry, c, only) {
    for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        var dx = (x - cx) / rx, dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) put(g, x, y, c, only);
      }
    }
  }
  function outline(g, c) {
    var add = [];
    for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) {
      if (g.px[y][x]) continue;
      var near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) {
        var row = g.px[y + d[1]];
        return !!(row && row[x + d[0]]);
      });
      if (near) add.push([x, y]);
    }
    add.forEach(function (p) { g.px[p[1]][p[0]] = c; });
  }
  function toCanvas(g) {
    var c = document.createElement('canvas');
    c.width = g.w; c.height = g.h;
    var t = c.getContext('2d');
    for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) {
      var v = g.px[y][x];
      if (v) { t.fillStyle = v; t.fillRect(x, y, 1, 1); }
    }
    return c;
  }

  
  var INK = '#24123a', G = '#3fbf4f', D = '#2a8f43', DD = '#1c6b30', L = '#b9f27c', O = '#ff9d1c', P = '#ff7aa8';
  function dinoSprite(frame) {
    var g = makeGrid(36, 30);
    var h = frame === 2 ? [7, 7, 7, 7] : (frame === 0 ? [9, 7, 7, 9] : [7, 9, 9, 7]);
   
    var legs = [[11, D, DD, h[1]], [22, D, DD, h[3]], [7, G, D, h[0]], [18, G, D, h[2]]];
    legs.forEach(function (l) {
      var bottom = 28, top = bottom - l[3] + 1;
      rect(g, l[0], top, 3, l[3], l[1]);
      rect(g, l[0], bottom, 4, 1, l[2]);
    });
    ell(g, 4, 16, 4, 2, G); ell(g, 1.5, 14.5, 2, 1, G);       
    ell(g, 15, 16, 10, 6, G);                                  
    ell(g, 15, 19, 8, 3, L, G);                                 
    rect(g, 10, 12, 2, 2, O, G); rect(g, 15, 11, 2, 2, O, G);   
    rect(g, 20, 13, 2, 2, O, G); rect(g, 13, 15, 1, 1, D, G);
    for (var i = 0; i <= 24; i++) {                             
      var t = i / 24;
      ell(g, 22 + t * 5, 13 - t * 10, 2.6, 2.6, G);
    }
    put(g, 24, 9, O, G); put(g, 25, 6, O, G); put(g, 23, 11, O, G);
    ell(g, 29, 3, 3, 2.2, G); ell(g, 31.5, 4, 2.2, 1.6, G);     
    put(g, 29, 2, '#ffffff'); put(g, 30, 2, INK);              
    put(g, 29, 4, P); put(g, 32, 3, D);                         
    outline(g, INK);
    return toCanvas(g);
  }
  var dinoFrames = [dinoSprite(0), dinoSprite(1), dinoSprite(2)];


  function cloudSprite() {
    var g = makeGrid(48, 22);
    ell(g, 12, 14, 9, 5, '#ffffff'); ell(g, 24, 10, 11, 8, '#ffffff'); ell(g, 37, 14, 9, 5, '#ffffff');
    rect(g, 8, 15, 32, 3, '#ffffff');
    for (var y = 18; y < 22; y++) for (var x = 0; x < 48; x++) g.px[y][x] = null;
    for (var y2 = 15; y2 < 18; y2++) for (var x2 = 0; x2 < 48; x2++) { if (g.px[y2][x2]) g.px[y2][x2] = '#b7dcf7'; }
    outline(g, '#1e3a66');
    return toCanvas(g);
  }
  function hillSprite() {
    var g = makeGrid(46, 22);
    ell(g, 23, 20, 21, 19, '#62c95d');
    ell(g, 14, 10, 4, 2, '#8be87f');
    rect(g, 18, 9, 1, 3, INK); rect(g, 25, 9, 1, 3, INK);
    outline(g, '#14532d');
    return toCanvas(g);
  }
  var cloudImg = cloudSprite(), hillImg = hillSprite();
  var CLOUD_W = 48, CLOUD_H = 22, HILL_W = 46, HILL_H = 22;

  var clouds = [], hills = [];
  [[40, 40, 2, .06], [300, 90, 2, .06], [560, 30, 2, .06], [780, 110, 2, .06],
   [150, 120, 3.2, .14], [520, 70, 3.2, .14], [830, 150, 3.2, .14]].forEach(function (c) {
    clouds.push({ x: c[0], y: c[1], s: c[2], f: c[3] });
  });
  [[60, 5], [380, 4], [700, 6]].forEach(function (h) { hills.push({ x: h[0], s: h[1] }); });

 
  function cactusSprite(th, arms) {
    var oy = 2, C = G, g = makeGrid(24, th + 8), b = oy + th + 3;
    var hasL = arms === 'LR', ay = oy + 4 + Math.floor(th * 0.5), ayR = hasL ? ay - 3 : ay;
    var boxes = [[9, oy + 1, 6, b - oy]];
    rect(g, 9, oy + 3, 6, th + 1, C); ell(g, 11.5, oy + 3, 3, 3, C);       
    if (hasL) {                                                            
      rect(g, 4, ay, 5, 3, C); rect(g, 4, ay - 5, 3, 8, C); ell(g, 5.5, ay - 5, 1.4, 1.5, C);
      boxes.push([4, ay - 5, 5, 8]);
    }
    rect(g, 15, ayR, 5, 3, C); rect(g, 18, ayR - 5, 3, 8, C); ell(g, 19.5, ayR - 5, 1.4, 1.5, C); 
    boxes.push([15, ayR - 5, 6, 8]);
    rect(g, 10, oy + 5, 1, th - 3, '#8be87f', C);                           
    rect(g, 13, oy + 4, 2, th, D, C);                                       
    if (hasL) rect(g, 6, ay - 4, 1, 6, D, C);
    rect(g, 20, ayR - 4, 1, 6, D, C);
    for (var y = oy + 6; y < b - 1; y += 5) { put(g, 11, y, '#e8ffb5', C); put(g, 12, y + 2, '#e8ffb5', C); } 
    ell(g, 11.5, oy - 0.5, 2, 1.2, P); put(g, 11, 1, '#ffe14d');           
    outline(g, INK);
    return { img: toCanvas(g), rows: b + 1, gh: th + 8, boxes: boxes, hVis: (b + 1) * S - 3 };
  }
  var CACTUS = [cactusSprite(14, 'R'), cactusSprite(20, 'LR'), cactusSprite(28, 'LR')];

 
  var state = 'ready', reason = '';
  var coins = 0, timeLeft = TIME, speed = 6, steps = 0, tick = 0, groundOff = 0;
  var distCactus = 0, distCoin = 0;
  var dy = GROUND_TOP, vy = 0, onGround = true;
  var cacti = [], coinList = [], pops = [];

  function reset() {
    coins = 0; timeLeft = TIME; speed = 6; steps = 0;
    dy = GROUND_TOP; vy = 0; onGround = true;
    cacti.length = 0; coinList.length = 0; pops.length = 0;
    distCactus = 380; distCoin = 160;
  }
  function start() {
    if (state === 'playing') return;
    reset();
    state = 'playing';
    btn.hidden = true;
    try { cv.focus({ preventScroll: true }); } catch (e) {}
  }
  function end(r) {
    state = 'over'; reason = r;
    btn.textContent = 'REINICIAR';
    btn.hidden = false;
    try { btn.focus({ preventScroll: true }); } catch (e) {}
  }
  function jump() {
    if (state === 'playing' && onGround) { vy = -17; onGround = false; }
  }

  
  window.addEventListener('keydown', function (e) {
    var jumpKey = e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW';
    if (!jumpKey && e.code !== 'Enter') return;
    if (state === 'playing') {
      if (jumpKey) { e.preventDefault(); jump(); }
    } else if (!e.repeat) {
      e.preventDefault(); start();
    }
  });
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
  btn.addEventListener('click', start);


  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function dinoBoxes() {
    var m = 3;
    return [
      { x: DX + 7 * S + m, y: dy + 11 * S + m, w: 18 * S - 2 * m, h: 18 * S - 2 * m },
      { x: DX + 24 * S + m, y: dy + 1 * S + m, w: 10 * S - 2 * m, h: 11 * S - 2 * m }
    ];
  }
  function scrollWorld(sp) {
    groundOff = (groundOff + sp) % 64;
    clouds.forEach(function (c) {
      c.x -= sp * c.f;
      if (c.x < -CLOUD_W * c.s) { c.x = W + Math.random() * 160; c.y = 20 + Math.random() * 140; }
    });
    hills.forEach(function (h) {
      h.x -= sp * 0.35;
      if (h.x < -HILL_W * h.s) { h.x = W + Math.random() * 140; }
    });
  }
  function spawnCactus() {
    var v = Math.floor(Math.random() * CACTUS.length);
    cacti.push({ x: W + 20, v: v, h: CACTUS[v].hVis });
  }
  function spawnCoin() {
    var heights = [38, 105, 160];
    var hgt = heights[Math.floor(Math.random() * heights.length)];
    var x = W + 40;
    cacti.forEach(function (p) {
      if (Math.abs(p.x + 36 - x) < 120 && hgt < p.h + 60) hgt = 160;
    });
    coinList.push({ x: x, y: GROUND - hgt, seed: Math.random() * 6 });
  }
  function step() {
    steps++;
    timeLeft -= 1 / 60;
    speed = 6 + Math.min(3, (TIME - timeLeft) * 0.05);
    if (timeLeft <= 0) { timeLeft = 0; end('time'); return; }

    vy += 0.85; dy += vy;
    if (dy >= GROUND_TOP) { dy = GROUND_TOP; vy = 0; onGround = true; } else { onGround = false; }

    scrollWorld(speed);
    distCactus -= speed;
    if (distCactus <= 0) { spawnCactus(); distCactus = 430 + Math.random() * 320 + speed * 14; }
    distCoin -= speed;
    if (distCoin <= 0) { spawnCoin(); distCoin = 240 + Math.random() * 300; }

    cacti.forEach(function (p) { p.x -= speed; });
    coinList.forEach(function (c) { c.x -= speed; });
    cacti = cacti.filter(function (p) { return p.x > -100; });
    coinList = coinList.filter(function (c) { return c.x > -40; });

    var boxes = dinoBoxes();
    for (var i = 0; i < cacti.length; i++) {
      var p = cacti[i], cs = CACTUS[p.v], ctop = GROUND + 3 - cs.rows * S;
      var parts = cs.boxes.map(function (q) { return { x: p.x + q[0] * S, y: ctop + q[1] * S, w: q[2] * S, h: q[3] * S }; });
      if (parts.some(function (pb) { return boxes.some(function (b) { return hit(b, pb); }); })) { end('hit'); return; }
    }
    coinList = coinList.filter(function (c) {
      var cb = { x: c.x - 14, y: c.y - 14, w: 28, h: 28 };
      if (boxes.some(function (b) { return hit(b, cb); })) {
        coins++;
        pops.push({ x: c.x, y: c.y - 18, life: 40 });
        return false;
      }
      return true;
    });
    pops.forEach(function (q) { q.life--; });
    pops = pops.filter(function (q) { return q.life > 0; });
  }
  function update() {
    if (state === 'playing') step();
    else if (state === 'ready') { steps++; scrollWorld(3); }
  }


  var sky = ctx.createLinearGradient(0, 0, 0, GROUND);
  sky.addColorStop(0, '#4fb0ee'); sky.addColorStop(1, '#e1f5fd');

  function stroked(str, x, y, fill, size, align) {
    ctx.font = size + 'px ' + FONT;
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.22; ctx.strokeStyle = '#1a1233';
    ctx.strokeText(str, x, y);
    ctx.fillStyle = fill; ctx.fillText(str, x, y);
  }
  function bigText(str, cx, cy, size) {
    ctx.font = size + 'px ' + FONT;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    var chars = str.split(''), gap = size * 0.04;
    var ws = chars.map(function (ch) { return ctx.measureText(ch).width; });
    var total = ws.reduce(function (a, b) { return a + b; }, 0) + (chars.length - 1) * gap;
    var x = cx - total / 2, ci = 0;
    chars.forEach(function (ch, i) {
      if (ch !== ' ') {
        ctx.lineWidth = size * 0.2; ctx.strokeStyle = '#1a1233';
        ctx.strokeText(ch, x, cy + size * 0.08);
        ctx.strokeText(ch, x, cy);
        ctx.fillStyle = LETTERS[ci++ % LETTERS.length];
        ctx.fillText(ch, x, cy);
      }
      x += ws[i] + gap;
    });
  }
  function drawCoin(cx, cy, r, phase) {
    var w = Math.max(3, Math.abs(Math.cos(phase)) * r);
    ctx.beginPath(); ctx.ellipse(cx, cy, w, r, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd23f'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#8a5a00'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.55, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffee93'; ctx.fill();
    if (w > 8) { ctx.fillStyle = '#d89a00'; ctx.fillRect(cx - 2, cy - r * 0.45, 4, r * 0.9); }
  }
  function drawCactus(p) {
    var c = CACTUS[p.v];
    ctx.drawImage(c.img, p.x, GROUND + 3 - c.rows * S, 24 * S, c.gh * S);
  }
  function drawGround() {
    ctx.fillStyle = '#46c24c'; ctx.fillRect(0, GROUND, W, 14);
    ctx.fillStyle = '#86e66f'; ctx.fillRect(0, GROUND, W, 4);
    ctx.fillStyle = '#238a3a'; ctx.fillRect(0, GROUND + 11, W, 3);
    var T = 32, y0 = GROUND + 14, shift = Math.floor(groundOff / T);
    for (var row = 0; row < 3; row++) {
      for (var col = -1; col <= Math.ceil(W / T) + 1; col++) {
        var x = col * T - (groundOff % T), y = y0 + row * T;
        ctx.fillStyle = ((col + row + shift) & 1) ? '#c8691f' : '#e08c36';
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = 'rgba(90,40,10,.35)'; ctx.fillRect(x, y, T, 2);
      }
    }
  }
  function drawHUD() {
    var size = 34, icon = 36, sep = '  -  ';
    var a = 'x ' + coins, b = 'TIME: ' + Math.max(0, Math.ceil(timeLeft));
    ctx.font = size + 'px ' + FONT;
    var wa = ctx.measureText(a).width, ws = ctx.measureText(sep).width, wb = ctx.measureText(b).width;
    var x = W / 2 - (icon + 8 + wa + ws + wb) / 2, y = 34;
    drawCoin(x + icon / 2, y, 15, 0);
    x += icon + 8;
    stroked(a, x, y, '#ffffff', size); x += wa;
    stroked(sep, x, y, '#ffffff', size); x += ws;
    var low = timeLeft <= 10 && Math.floor(tick / 20) % 2 === 0;
    stroked(b, x, y, low ? '#ff5a5a' : '#ffffff', size);
  }
  function draw() {
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    clouds.forEach(function (c) {
      if (c.f > .1) return;
      ctx.globalAlpha = .85;
      ctx.drawImage(cloudImg, c.x, c.y, CLOUD_W * c.s, CLOUD_H * c.s);
    });
    ctx.globalAlpha = 1;
    hills.forEach(function (h) {
      ctx.drawImage(hillImg, h.x, GROUND - HILL_H * h.s + 2 * h.s, HILL_W * h.s, HILL_H * h.s);
    });
    clouds.forEach(function (c) {
      if (c.f <= .1) return;
      ctx.drawImage(cloudImg, c.x, c.y, CLOUD_W * c.s, CLOUD_H * c.s);
    });

    drawGround();
    cacti.forEach(drawCactus);
    coinList.forEach(function (c) { drawCoin(c.x, c.y, 16, tick * 0.1 + c.seed); });

    var height = GROUND_TOP - dy;
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.beginPath(); ctx.ellipse(DX + 16 * S, GROUND + 5, Math.max(14, 34 - height * 0.12), 6, 0, 0, Math.PI * 2); ctx.fill();
    var f = !onGround ? 2 : (Math.floor(steps / 6) % 2);
    ctx.drawImage(dinoFrames[f], DX, dy, 36 * S, 30 * S);

    pops.forEach(function (q) {
      ctx.globalAlpha = q.life / 40;
      stroked('+1', q.x, q.y - (40 - q.life) * 1.2, '#ffe14d', 28, 'center');
    });
    ctx.globalAlpha = 1;

    if (state !== 'ready') drawHUD();

    if (state === 'ready') {
      ctx.fillStyle = 'rgba(20,18,46,.28)'; ctx.fillRect(0, 0, W, H);
      bigText('BRACHIO RUN', W / 2, 120, 84);
      stroked('Desvie dos cactos e pegue as moedas', W / 2, 196, '#ffffff', 28, 'center');
      stroked('Espaço, ↑ ou toque para pular', W / 2, 232, '#ffffff', 22, 'center');
    } else if (state === 'over') {
      ctx.fillStyle = 'rgba(20,18,46,.38)'; ctx.fillRect(0, 0, W, H);
      bigText('GAME OVER', W / 2, 140, 96);
      stroked(reason === 'time' ? 'O tempo acabou!' : 'Você bateu no cacto!', W / 2, 214, '#ffffff', 30, 'center');
      stroked('Moedas: ' + coins, W / 2, 252, '#ffe14d', 28, 'center');
    }
  }

 
  var last = performance.now(), acc = 0, STEP = 1000 / 60;
  function frame(now) {
    acc += Math.min(100, now - last); last = now;
    while (acc >= STEP) { update(); acc -= STEP; }
    tick++;
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
