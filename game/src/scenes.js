// Milo's Garden — the three hand-drawn scenes.
// Every scene is drawn twice: once as the original (panel A) and once with
// the level's differences applied (panel B). Nothing here is copied from
// another game: the garden, the pond and the treehouse are original art
// drawn with canvas shapes. Coordinates are in panel space (560 x 420).

export const PANEL_W = 560;
export const PANEL_H = 420;

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, x, y, 34 * s, 20 * s);
  ellipse(ctx, x + 24 * s, y + 4 * s, 26 * s, 16 * s);
  ellipse(ctx, x - 26 * s, y + 5 * s, 24 * s, 15 * s);
}

function flower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ellipse(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 6, 6);
  }
  ctx.fillStyle = center;
  circle(ctx, x, y, 6);
}

function mushroom(ctx, x, y, s) {
  ctx.fillStyle = '#f4ead8';
  rect(ctx, x - 4 * s, y, 8 * s, 12 * s);
  ctx.fillStyle = '#d64541';
  ctx.beginPath();
  ctx.arc(x, y + 2 * s, 13 * s, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  circle(ctx, x - 6 * s, y - 4 * s, 2.5 * s);
  circle(ctx, x + 5 * s, y - 7 * s, 2 * s);
}

// ---------------------------------------------------------------- level 1
// Sunny Garden. 5 differences:
//   bird — on the fence, original only
//   sunflower — yellow petals vs orange petals
//   mushroom — extra one by the tree, changed side only
//   butterfly — fluttering above the flowers, original only
//   can — the watering can is blue vs red

function drawGarden(ctx, altered) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#8ecfee');
  sky.addColorStop(1, '#dff3fb');
  ctx.fillStyle = sky;
  rect(ctx, 0, 0, 560, 260);
  ctx.fillStyle = '#8fce6e';
  rect(ctx, 0, 240, 560, 180);
  ctx.fillStyle = '#6fb84f';
  ellipse(ctx, 90, 250, 180, 34);
  ellipse(ctx, 470, 252, 190, 30);

  // sun with rays
  ctx.fillStyle = '#ffd94a';
  circle(ctx, 480, 62, 34);
  ctx.strokeStyle = '#ffd94a';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 480 + Math.cos(a) * 42, 62 + Math.sin(a) * 42,
      480 + Math.cos(a) * 54, 62 + Math.sin(a) * 54);
  }
  cloud(ctx, 120, 60, 1);
  cloud(ctx, 300, 42, 0.8);
  cloud(ctx, 430, 120, 0.7);

  // big tree, left
  ctx.fillStyle = '#7a5230';
  rect(ctx, 58, 150, 22, 110);
  ctx.fillStyle = '#4e9b3a';
  circle(ctx, 70, 130, 62);
  circle(ctx, 26, 155, 38);
  circle(ctx, 116, 152, 40);
  ctx.fillStyle = '#67b34a';
  circle(ctx, 70, 108, 40);
  mushroom(ctx, 130, 258, 1);
  if (altered) mushroom(ctx, 118, 356, 0.9); // extra mushroom

  // fence
  ctx.fillStyle = '#b98a56';
  rect(ctx, 0, 205, 560, 10);
  ctx.fillStyle = '#a87a48';
  for (let x = 20; x < 560; x += 60) rect(ctx, x, 188, 10, 46);

  // bird on the fence (original only)
  if (!altered) {
    ctx.fillStyle = '#3f6fb5';
    ellipse(ctx, 300, 196, 16, 11);
    circle(ctx, 314, 188, 8);
    ctx.fillStyle = '#f6a821';
    ctx.beginPath();
    ctx.moveTo(321, 188); ctx.lineTo(330, 191); ctx.lineTo(321, 193);
    ctx.fill();
    ctx.strokeStyle = '#3f6fb5';
    ctx.lineWidth = 2;
    line(ctx, 296, 206, 292, 196);
    line(ctx, 304, 206, 308, 196);
  }

  // flower bed
  ctx.fillStyle = '#5c8f3e';
  rect(ctx, 0, 330, 560, 90);
  const bed = [
    [40, 360, '#ff7fa5', '#ffd94a'], [90, 372, '#c084fc', '#fff'],
    [150, 358, '#ff9f43', '#7a2d12'], [210, 372, '#ff7fa5', '#ffd94a'],
    [270, 360, '#ffffff', '#ffd94a'], [330, 372, '#c084fc', '#fff'],
    [390, 360, '#ff9f43', '#7a2d12'], [450, 372, '#ff7fa5', '#ffd94a'],
    [510, 360, '#ffffff', '#ffd94a'],
  ];
  for (const [x, y, p, c] of bed) {
    ctx.strokeStyle = '#3e7a2a';
    ctx.lineWidth = 3;
    line(ctx, x, y + 6, x, y + 26);
    flower(ctx, x, y, p, c);
  }

  // sunflower, right side (petal colour differs)
  ctx.strokeStyle = '#3e7a2a';
  ctx.lineWidth = 5;
  line(ctx, 470, 300, 470, 372);
  ctx.fillStyle = '#3e7a2a';
  ellipse(ctx, 452, 330, 16, 7);
  ellipse(ctx, 488, 322, 16, 7);
  const petal = altered ? '#ff8c1a' : '#ffd94a';
  ctx.fillStyle = petal;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ellipse(ctx, 470 + Math.cos(a) * 22, 288 + Math.sin(a) * 22, 9, 9);
  }
  ctx.fillStyle = '#7a4a21';
  circle(ctx, 470, 288, 15);
  ctx.fillStyle = '#5d3715';
  circle(ctx, 465, 284, 2); circle(ctx, 475, 292, 2); circle(ctx, 472, 282, 2);

  // watering can (colour differs)
  ctx.fillStyle = altered ? '#d64541' : '#3f6fb5';
  rect(ctx, 66, 312, 44, 30);
  ctx.beginPath();
  ctx.moveTo(110, 318); ctx.lineTo(128, 306); ctx.lineTo(128, 330); ctx.lineTo(110, 330);
  ctx.fill();
  ctx.fillStyle = '#2f2f2f';
  rect(ctx, 66, 306, 14, 8);
  ctx.fillStyle = '#7ec8f0';
  ellipse(ctx, 88, 344, 20, 5);

  // butterfly (original only)
  if (!altered) {
    ctx.fillStyle = '#ff8fd0';
    ellipse(ctx, 392, 116, 11, 15);
    ellipse(ctx, 410, 116, 11, 15);
    ellipse(ctx, 394, 130, 8, 9);
    ellipse(ctx, 408, 130, 8, 9);
    ctx.strokeStyle = '#5a2d4d';
    ctx.lineWidth = 2;
    line(ctx, 401, 112, 401, 136);
  }

  // birdhouse on a pole
  ctx.fillStyle = '#8a5a2b';
  rect(ctx, 520, 180, 8, 90);
  ctx.fillStyle = '#e8a13c';
  ctx.beginPath();
  ctx.moveTo(508, 184); ctx.lineTo(544, 184); ctx.lineTo(526, 162);
  ctx.closePath(); ctx.fill();
  rect(ctx, 512, 184, 28, 26);
  ctx.fillStyle = '#3d2b1f';
  circle(ctx, 526, 196, 6);
}

// ---------------------------------------------------------------- level 2
// Pond at Dusk. 7 differences:
//   frog — on the lily pad, original only
//   moon — full vs crescent
//   fish — jumping out of the pond, changed side only
//   firefly — one fewer on the changed side
//   cattail — the middle one is missing on the changed side
//   lily — pink flower vs white flower
//   stone — an extra stone on the bank, changed side only

function drawPond(ctx, altered) {
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#3b2d6e');
  sky.addColorStop(0.6, '#8a4f8a');
  sky.addColorStop(1, '#e8907a');
  ctx.fillStyle = sky;
  rect(ctx, 0, 0, 560, 280);
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of [[60, 40, 2], [140, 70, 1.6], [240, 34, 2], [330, 60, 1.6], [420, 30, 2], [500, 80, 1.6], [200, 100, 1.5]]) {
    circle(ctx, x, y, r);
  }

  // moon (full vs crescent)
  ctx.fillStyle = '#fdf6d8';
  circle(ctx, 470, 70, 30);
  if (altered) {
    ctx.fillStyle = '#8a4f8a';
    circle(ctx, 482, 62, 26);
  }

  // far bank and pond
  ctx.fillStyle = '#2e5d3a';
  rect(ctx, 0, 250, 560, 40);
  const pond = ctx.createLinearGradient(0, 280, 0, 420);
  pond.addColorStop(0, '#7fb8c9');
  pond.addColorStop(1, '#3d7f96');
  ctx.fillStyle = pond;
  ellipse(ctx, 280, 360, 280, 62);
  ctx.fillStyle = '#2e5d3a';
  ellipse(ctx, 280, 292, 290, 26);

  // cattails, left bank
  function cattail(x, h, head) {
    ctx.strokeStyle = '#2e5d3a';
    ctx.lineWidth = 4;
    line(ctx, x, 300, x, 300 - h);
    if (head) {
      ctx.fillStyle = '#6b4423';
      ellipse(ctx, x, 300 - h - 12, 7, 18);
      ctx.strokeStyle = '#2e5d3a';
      ctx.lineWidth = 2;
      line(ctx, x, 300 - h - 30, x, 300 - h - 42);
    }
  }
  cattail(60, 70, true);
  if (!altered) cattail(92, 84, true); // middle cattail missing on changed side
  cattail(124, 62, true);
  ctx.strokeStyle = '#2e5d3a';
  ctx.lineWidth = 3;
  line(ctx, 40, 300, 34, 252);
  line(ctx, 150, 300, 158, 258);

  // lily pads
  ctx.fillStyle = '#3f8f4f';
  ellipse(ctx, 180, 330, 46, 14);
  ellipse(ctx, 300, 350, 52, 15);
  ellipse(ctx, 420, 322, 40, 12);
  ctx.fillStyle = '#57a866';
  ellipse(ctx, 186, 328, 30, 9);
  ellipse(ctx, 306, 348, 34, 10);

  // lily flower (pink vs white)
  ctx.fillStyle = altered ? '#ffffff' : '#ff8fb8';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ellipse(ctx, 300 + Math.cos(a) * 9, 342 + Math.sin(a) * 7, 6, 6);
  }
  ctx.fillStyle = '#ffd94a';
  circle(ctx, 300, 342, 5);

  // frog on the first pad (original only)
  if (!altered) {
    ctx.fillStyle = '#57b24a';
    ellipse(ctx, 180, 322, 18, 12);
    circle(ctx, 170, 312, 8);
    circle(ctx, 190, 312, 8);
    ctx.fillStyle = '#ffffff';
    circle(ctx, 170, 310, 4);
    circle(ctx, 190, 310, 4);
    ctx.fillStyle = '#1d1d1d';
    circle(ctx, 170, 310, 2);
    circle(ctx, 190, 310, 2);
  }

  // jumping fish (changed side only)
  if (altered) {
    ctx.fillStyle = '#e8a13c';
    ctx.beginPath();
    ctx.ellipse(430, 258, 20, 9, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(448, 250); ctx.lineTo(460, 244); ctx.lineTo(458, 258);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    circle(ctx, 420, 254, 2.5);
    ctx.fillStyle = '#7fb8c9';
    ellipse(ctx, 430, 282, 16, 4);
    ellipse(ctx, 418, 290, 10, 3);
  }

  // fireflies (one fewer on the changed side)
  ctx.fillStyle = '#ffe66d';
  circle(ctx, 120, 150, 3.5);
  circle(ctx, 240, 130, 3.5);
  if (!altered) circle(ctx, 350, 92, 3.5);
  ctx.fillStyle = 'rgba(255, 230, 109, 0.35)';
  circle(ctx, 120, 150, 8);
  circle(ctx, 240, 130, 8);
  if (!altered) circle(ctx, 350, 92, 8);

  // extra stone on the bank (changed side only)
  if (altered) {
    ctx.fillStyle = '#9aa0a3';
    ellipse(ctx, 482, 372, 18, 10);
    ctx.fillStyle = '#7d8386';
    ellipse(ctx, 478, 370, 8, 4);
  }
  ctx.fillStyle = '#8b9094';
  ellipse(ctx, 60, 380, 22, 11);
  ellipse(ctx, 520, 392, 26, 10);
}

// ---------------------------------------------------------------- level 3
// Treehouse Night. 9 differences:
//   window — lit warm yellow vs dark
//   star — an extra bright star, changed side only
//   owl — eyes open vs closed
//   lantern — hanging by the door, original only
//   rung — one ladder rung missing on the changed side
//   mushroom — on the low branch, changed side only
//   cat — asleep on the roof, original only
//   smoke — from the chimney, original only
//   flag — red vs blue

function drawTreehouse(ctx, altered) {
  ctx.fillStyle = '#101a3a';
  rect(ctx, 0, 0, 560, 420);
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of [[40, 50, 2], [90, 90, 1.5], [150, 40, 2], [220, 80, 1.5], [300, 36, 2], [360, 70, 1.5], [440, 44, 2], [520, 96, 1.5], [180, 130, 1.5], [260, 120, 1.5]]) {
    circle(ctx, x, y, r);
  }
  if (altered) { // extra bright star
    ctx.fillStyle = '#ffe66d';
    circle(ctx, 500, 60, 4);
    ctx.fillStyle = 'rgba(255, 230, 109, 0.4)';
    circle(ctx, 500, 60, 10);
  }
  ctx.fillStyle = '#f4ead8';
  circle(ctx, 90, 60, 22);
  ctx.fillStyle = '#d8cdb2';
  circle(ctx, 82, 54, 5);
  circle(ctx, 98, 66, 4);

  // ground
  ctx.fillStyle = '#1d3320';
  rect(ctx, 0, 360, 560, 60);
  ctx.fillStyle = '#2c4a2e';
  ellipse(ctx, 120, 368, 130, 16);
  ellipse(ctx, 440, 370, 150, 14);

  // big tree
  ctx.fillStyle = '#5d3a22';
  ctx.beginPath();
  ctx.moveTo(180, 360); ctx.lineTo(210, 360); ctx.lineTo(200, 170); ctx.lineTo(190, 170);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1d4a24';
  circle(ctx, 195, 140, 90);
  circle(ctx, 110, 170, 60);
  circle(ctx, 280, 165, 62);
  ctx.fillStyle = '#2c6b32';
  circle(ctx, 195, 110, 60);
  circle(ctx, 130, 140, 42);
  // low branch with mushroom (changed side only)
  ctx.strokeStyle = '#5d3a22';
  ctx.lineWidth = 10;
  line(ctx, 190, 240, 120, 210);
  if (altered) mushroom(ctx, 148, 206, 0.9);

  // treehouse
  ctx.fillStyle = '#8a5a2b';
  rect(ctx, 300, 190, 150, 90);
  ctx.fillStyle = '#6b4423';
  rect(ctx, 300, 190, 150, 12);
  // roof
  ctx.fillStyle = '#b03a2e';
  ctx.beginPath();
  ctx.moveTo(290, 192); ctx.lineTo(460, 192); ctx.lineTo(375, 140);
  ctx.closePath(); ctx.fill();
  // chimney
  ctx.fillStyle = '#7a6a5a';
  rect(ctx, 420, 132, 18, 40);
  if (!altered) { // smoke (original only)
    ctx.fillStyle = 'rgba(230, 230, 230, 0.75)';
    circle(ctx, 432, 122, 9);
    circle(ctx, 440, 108, 12);
    circle(ctx, 450, 92, 14);
  }
  // flag (red vs blue)
  ctx.strokeStyle = '#d8d8d8';
  ctx.lineWidth = 3;
  line(ctx, 375, 140, 375, 112);
  ctx.fillStyle = altered ? '#3f6fb5' : '#d64541';
  ctx.beginPath();
  ctx.moveTo(375, 112); ctx.lineTo(400, 119); ctx.lineTo(375, 126);
  ctx.closePath(); ctx.fill();
  // cat asleep on the roof (original only)
  if (!altered) {
    ctx.fillStyle = '#2f2f2f';
    ellipse(ctx, 322, 172, 18, 8);
    circle(ctx, 306, 168, 7);
    ctx.beginPath();
    ctx.moveTo(302, 162); ctx.lineTo(304, 156); ctx.lineTo(308, 162);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(308, 162); ctx.lineTo(311, 156); ctx.lineTo(313, 162);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2f2f2f';
    ctx.lineWidth = 3;
    line(ctx, 338, 172, 352, 166);
  }
  // window (lit vs dark)
  ctx.fillStyle = '#5d3a22';
  rect(ctx, 322, 214, 40, 40);
  ctx.fillStyle = altered ? '#22304a' : '#ffd94a';
  rect(ctx, 327, 219, 30, 30);
  ctx.strokeStyle = '#5d3a22';
  ctx.lineWidth = 3;
  line(ctx, 342, 219, 342, 249);
  line(ctx, 327, 234, 357, 234);
  if (!altered) {
    ctx.fillStyle = 'rgba(255, 217, 74, 0.25)';
    rect(ctx, 322, 214, 40, 40);
  }
  // door
  ctx.fillStyle = '#5d3a22';
  rect(ctx, 396, 220, 32, 60);
  ctx.fillStyle = '#ffd94a';
  circle(ctx, 422, 252, 3);
  // lantern by the door (original only)
  if (!altered) {
    ctx.strokeStyle = '#d8d8d8';
    ctx.lineWidth = 2;
    line(ctx, 388, 214, 388, 222);
    ctx.fillStyle = '#ffd94a';
    ellipse(ctx, 388, 232, 8, 11);
    ctx.fillStyle = 'rgba(255, 217, 74, 0.35)';
    circle(ctx, 388, 232, 18);
    ctx.fillStyle = '#3d2b1f';
    rect(ctx, 382, 220, 12, 4);
  }

  // rope ladder
  ctx.strokeStyle = '#d8c49a';
  ctx.lineWidth = 3;
  line(ctx, 330, 280, 330, 360);
  line(ctx, 356, 280, 356, 360);
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 5;
  line(ctx, 330, 296, 356, 296);
  if (!altered) line(ctx, 330, 318, 356, 318); // rung missing on changed side
  line(ctx, 330, 340, 356, 340);

  // owl on the branch
  ctx.fillStyle = '#8a6d4b';
  ellipse(ctx, 250, 210, 16, 20);
  ctx.fillStyle = '#6b4f33';
  ctx.beginPath();
  ctx.moveTo(238, 192); ctx.lineTo(242, 182); ctx.lineTo(246, 192);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(254, 192); ctx.lineTo(258, 182); ctx.lineTo(262, 192);
  ctx.closePath(); ctx.fill();
  if (altered) { // eyes closed
    ctx.strokeStyle = '#1d1d1d';
    ctx.lineWidth = 2;
    line(ctx, 241, 204, 247, 204);
    line(ctx, 253, 204, 259, 204);
  } else { // eyes open
    ctx.fillStyle = '#ffffff';
    circle(ctx, 244, 204, 4.5);
    circle(ctx, 256, 204, 4.5);
    ctx.fillStyle = '#1d1d1d';
    circle(ctx, 244, 204, 2);
    circle(ctx, 256, 204, 2);
  }
  ctx.fillStyle = '#f6a821';
  ctx.beginPath();
  ctx.moveTo(248, 210); ctx.lineTo(252, 210); ctx.lineTo(250, 215);
  ctx.closePath(); ctx.fill();

  // fireflies
  ctx.fillStyle = '#ffe66d';
  circle(ctx, 60, 300, 3);
  circle(ctx, 500, 300, 3);
  circle(ctx, 90, 340, 2.5);
}

export const LEVELS = [
  {
    name: 'Level 1 · Sunny Garden',
    timeLimit: 90,
    draw: drawGarden,
    differences: [
      { id: 'bird', x: 302, y: 194, r: 24, label: 'bird on the fence' },
      { id: 'sunflower', x: 470, y: 288, r: 30, label: 'sunflower colour' },
      { id: 'mushroom', x: 118, y: 352, r: 20, label: 'extra mushroom' },
      { id: 'butterfly', x: 401, y: 122, r: 22, label: 'butterfly' },
      { id: 'can', x: 96, y: 326, r: 26, label: 'watering can colour' },
    ],
  },
  {
    name: 'Level 2 · Pond at Dusk',
    timeLimit: 100,
    draw: drawPond,
    differences: [
      { id: 'frog', x: 180, y: 318, r: 24, label: 'frog on the lily pad' },
      { id: 'moon', x: 470, y: 70, r: 32, label: 'the moon' },
      { id: 'fish', x: 434, y: 258, r: 24, label: 'jumping fish' },
      { id: 'firefly', x: 350, y: 92, r: 16, label: 'missing firefly' },
      { id: 'cattail', x: 92, y: 240, r: 26, label: 'missing cattail' },
      { id: 'lily', x: 300, y: 342, r: 22, label: 'lily flower colour' },
      { id: 'stone', x: 482, y: 370, r: 22, label: 'extra stone' },
    ],
  },
  {
    name: 'Level 3 · Treehouse Night',
    timeLimit: 120,
    draw: drawTreehouse,
    differences: [
      { id: 'window', x: 342, y: 234, r: 26, label: 'lit window' },
      { id: 'star', x: 500, y: 60, r: 16, label: 'extra star' },
      { id: 'owl', x: 250, y: 204, r: 22, label: "owl's eyes" },
      { id: 'lantern', x: 388, y: 232, r: 20, label: 'lantern by the door' },
      { id: 'rung', x: 343, y: 318, r: 16, label: 'missing ladder rung' },
      { id: 'mushroom', x: 148, y: 202, r: 18, label: 'mushroom on the branch' },
      { id: 'cat', x: 322, y: 170, r: 22, label: 'cat on the roof' },
      { id: 'smoke', x: 440, y: 108, r: 22, label: 'chimney smoke' },
      { id: 'flag', x: 388, y: 119, r: 16, label: 'flag colour' },
    ],
  },
];

// Draw one panel. `altered` picks the changed side; `found` is a Set of
// difference ids already circled, drawn as red rings on both panels.
export function drawPanel(ctx, levelIndex, altered, found) {
  const level = LEVELS[levelIndex];
  ctx.save();
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  level.draw(ctx, altered);
  ctx.strokeStyle = '#e33';
  ctx.lineWidth = 4;
  for (const id of found) {
    const d = level.differences.find((x) => x.id === id);
    if (!d) continue;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(d.x - d.r - 4, d.y);
    ctx.lineTo(d.x - d.r + 4, d.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(d.x + d.r - 4, d.y);
    ctx.lineTo(d.x + d.r + 4, d.y);
    ctx.stroke();
  }
  ctx.restore();
}
