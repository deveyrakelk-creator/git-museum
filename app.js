const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
function scrollToTarget(selector){
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if(!el) return;
  const offset = (document.querySelector('.site-header')?.offsetHeight || 80) + 18;
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

const collectionData = {
  bronze: {
    en: 'BRONZE COLLECTION',
    title: '青铜器馆藏',
    desc: '青铜器专题以礼器、铭刻器与器物构件为主，突出早期铸造工艺、礼制秩序与金文制度信息。',
    tags: ['礼器', '铭刻', '铸造工艺', '青铜文明'],
    note: '青铜器专题适合放在导览路线前段，用“器形—纹饰—文字—礼制”的顺序组织讲解。',
    badge: '礼制文明',
    bg: './assets/classified/bronze_ritual_set.jpg',
    spotlight: {
      title: '铜钁',
      img: './assets/classified/bronze_jue.jpg',
      desc: '器形挺拔，纹饰凝练，青铜质感厚重，适合作为青铜器专题的主展示文物。',
      facts: ['类别：青铜器', '主题：铸造与纹饰', '展示重点：器形、质感与早期工艺']
    },
    cards: [
      {title:'青铜礼乐器', img:'./assets/classified/bronze_ritual_set.jpg', tags:['礼器','礼乐'], desc:'以礼制场景为核心，反映古代社会秩序、祭祀活动与礼乐制度。'},
      {title:'铜方壶', img:'./assets/classified/bronze_square_hu.jpg', tags:['器形','陈列'], desc:'方正稳重，形制规整，可用于强调青铜器的庄重造型与礼制秩序。'},
      {title:'新莽铜诏版', img:'./assets/classified/bronze_xinmang_edict.jpg', tags:['铭刻','制度'], desc:'保留文字信息和制度痕迹，可引出青铜器在历史文献与制度传播中的作用。'}
    ],
    more: [
      {title:'展区亮点', type:'青铜器导览', desc:'本展区以礼器、铭刻器和实用器为主，展示青铜铸造、器形结构与礼制文化。'},
      {title:'观看重点', type:'参观提示', desc:'可重点观察器物轮廓、纹饰布局和铭刻文字，理解青铜器的庄重气质。'},
      {title:'相关展品', type:'馆藏线索', desc:'可结合青铜礼乐器、铜方壶、铜钁、新莽铜诏版等展品进行对比观看。'}
    ]
  },
  painting: {
    en: 'PAINTING COLLECTION',
    title: '书画馆藏',
    desc: '书画专题以书法卷轴与山水画轴为核心，突出笔墨结构、装裱形制与文人审美。',
    tags: ['书法', '山水', '卷轴', '笔墨'],
    note: '书画类文物数量较少时不强行凑满卡片，保留留白并用卷轴背景增强文雅气质。',
    badge: '笔墨雅韵',
    bg: './assets/classified/painting_calligraphy_zhang.jpg',
    spotlight: {
      title: '张在辛隶书轴',
      img: './assets/classified/painting_calligraphy_zhang.jpg',
      desc: '笔势沉稳，结体端正，适合作为书画专题的主展示物，体现碑学气息与章法秩序。',
      facts: ['类别：书法', '形制：卷轴', '展示重点：笔法、结构与章法']
    },
    cards: [
      {title:'沈宗敬松岩飞瀑图轴', img:'./assets/classified/painting_landscape_shen.jpg', tags:['山水','画轴'], desc:'以松岩飞瀑为主题，山石层次与水气流动相互映衬，呈现文人山水的静穆气象。'}
    ],
    more: [
      {title:'展区亮点', type:'书画导览', desc:'本展区以书法卷轴与山水图轴为主，呈现传统笔墨、章法结构与文人审美。'},
      {title:'观看重点', type:'参观提示', desc:'可重点观察字形结构、笔墨浓淡、画面层次和卷轴形制，感受书画作品的节奏。'},
      {title:'相关展品', type:'馆藏线索', desc:'可结合张在辛隶书轴、沈宗敬松岩飞瀑图轴等展品了解书画馆藏。'}
    ]
  },
  ceramic: {
    en: 'CERAMIC COLLECTION',
    title: '陶瓷器馆藏',
    desc: '陶瓷器以釉色、胎质、器形与纹样见长，适合呈现温润、华美且具有装饰秩序的展陈气质。',
    tags: ['三彩', '青花', '釉里红', '陶塑'],
    note: '陶瓷器专题以三彩三足罐为主视觉，并配合彩绘陶马、青花釉里红纹样等内容形成层次。',
    badge: '釉色华章',
    bg: './assets/classified/ceramic_sancai_tripod.jpg',
    spotlight: {
      title: '三彩三足罐',
      img: './assets/classified/ceramic_sancai_tripod.jpg',
      desc: '釉彩温润，造型饱满，是陶瓷器专题中最适合承担主视觉的重点文物。',
      facts: ['类别：陶瓷器', '特点：三彩釉色', '展示重点：器形、釉色与体量感']
    },
    cards: [
      {title:'青花釉里红缠枝花卉纹盆', img:'./assets/classified/ceramic_blue_red_basin.jpg', tags:['青花','釉里红'], desc:'纹样繁密有序，蓝白与红彩相映，装饰性强，适合作为陶瓷纹样展示重点。'},
      {title:'彩绘陶马', img:'./assets/classified/ceramic_painted_horse.jpg', tags:['陶塑','马俑'], desc:'形态生动，色彩古雅，可作为陶瓷专题中更具叙事性的辅助文物。'},
      {title:'蛋壳陶高柄杯', img:'./assets/classified/ceramic_eggshell_cup.jpg', tags:['器形','高柄杯'], desc:'器形轻盈，轮廓修长，用于补充陶瓷器在形制变化上的多样性。'}
    ],
    more: [
      {title:'展区亮点', type:'陶瓷器导览', desc:'本展区以釉色、器形和纹样为主线，展示陶瓷器从实用器物到审美器物的变化。'},
      {title:'观看重点', type:'参观提示', desc:'可重点观察釉色流动、器物比例和纹饰布局，理解陶瓷工艺与装饰特点。'},
      {title:'相关展品', type:'馆藏线索', desc:'可结合三彩三足罐、青花釉里红盆、彩绘陶马、蛋壳陶高柄杯等展品观看。'}
    ]
  },
  jade: {
    en: 'JADE COLLECTION',
    title: '玉石器馆藏',
    desc: '玉石器专题以温润材质和古雅器形为核心，适合构建冷静、神秘而精致的展陈氛围。',
    tags: ['玉刀', '头像', '指环', '磨制工艺'],
    note: '玉石器图片数量较少时不强行补齐，保留精致小件的展示节奏，避免重复占位。',
    badge: '温润古雅',
    bg: './assets/classified/jade_head.jpg',
    spotlight: {
      title: '玉神人头像',
      img: './assets/classified/jade_head.jpg',
      desc: '造型凝练，神态庄重，具有鲜明的文化象征意义，适合作为玉石器专题的视觉焦点。',
      facts: ['类别：玉石器', '主题：人物头像', '展示重点：神态、象征与材质']
    },
    cards: [
      {title:'玉刀', img:'./assets/classified/jade_blade.jpg', tags:['玉石器','礼器'], desc:'器形修长，质地莹润，体现早期玉器制作与礼仪用途。'},
      {title:'玉蝉指环', img:'./assets/classified/jade_cicada_ring.jpg', tags:['小件','佩饰'], desc:'造型精巧，适合在详情弹窗中展示细部纹理与佩饰含义。'}
    ],
    more: [
      {title:'展区亮点', type:'玉石器导览', desc:'本展区以玉质器物和小型佩饰为主，展示玉器材质、磨制工艺与象征意义。'},
      {title:'观看重点', type:'参观提示', desc:'可重点观察玉器轮廓、表面光泽和细部纹理，感受温润古雅的材质特征。'},
      {title:'相关展品', type:'馆藏线索', desc:'可结合玉刀、玉神人头像、玉蝉指环等展品理解玉石器的类型差异。'}
    ]
  }
};

let activeCategory = 'bronze';
function renderCollection(key='bronze') {
  activeCategory = key;
  const data = collectionData[key];
  const detailSection = document.querySelector('#collectionDetail');
  detailSection?.classList.add('switching');
  setTimeout(() => detailSection?.classList.remove('switching'), 480);
  $('#detailEn').textContent = data.en;
  $('#detailTitle').textContent = data.title;
  $('#detailDesc').textContent = data.desc;
  $('#detailNote').textContent = data.note;
  $('#spotlightBadge').textContent = data.badge;
  $('#spotlightTitle').textContent = data.spotlight.title;
  $('#spotlightImage').src = data.spotlight.img;
  $('#spotlightImage').alt = data.spotlight.title;
  $('#spotlightDesc').textContent = data.spotlight.desc;
  $('#detailTags').innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
  $('#spotlightFacts').innerHTML = data.spotlight.facts.map(f => `<li>${f}</li>`).join('');
  const detailCardsBox = $('#detailCards');
  detailCardsBox.classList.toggle('few-cards', data.cards.length < 3);
  detailCardsBox.innerHTML = data.cards.map(item => `
    <article class="detail-card interactive-card" data-tilt>
      <img src="${item.img}" alt="${item.title}" />
      <div>
        <h3>${item.title}</h3>
        <div class="tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <p>${item.desc}</p>
        <span class="open-detail">查看详情 →</span>
      </div>
    </article>
  `).join('');
  $('#moreStrip').innerHTML = data.more.map(item => `
    <div class="more-item">
      <small>${item.type}</small>
      <strong>${item.title}</strong>
      <p>${item.desc}</p>
    </div>
  `).join('');
  $('.detail-bg').style.background = `linear-gradient(180deg, rgba(255,251,243,.78), rgba(245,234,213,.88)), url('${data.bg}') center/cover no-repeat`;
  initTiltCards();
  bindLocalGlow();
}
renderCollection();

$$('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    $$('.category-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    renderCollection(card.dataset.category);
    scrollToTarget('#collectionDetail');
  });
});

function setCategory(key){
  $$('.category-card').forEach(c => c.classList.toggle('active', c.dataset.category === key));
  $$('.detail-switcher button').forEach(b => b.classList.toggle('active', b.dataset.switch === key));
  renderCollection(key);
  scrollToTarget('#collectionDetail');
}
$$('.detail-switcher button').forEach(btn => btn.addEventListener('click', () => setCategory(btn.dataset.switch)));


$('#moreCollectionsBtn').addEventListener('click', () => {
  scrollToTarget('#moreStrip');
});

$$('.jump-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.target);
    if (target) scrollToTarget(target);
  });
});

const header = $('#siteHeader');
const backTop = $('#backTop');
const backTopInline = $('#backTopInline');
backTopInline.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
  });
});
function updateActiveNav(){
  header.classList.toggle('scrolled', window.scrollY > 32);
  backTop.classList.toggle('show', window.scrollY > 550);
  const fromTop = window.scrollY + 170;
  const zones = [
    ['#home', ['#home']],
    ['#overview', ['#overview']],
    ['#collections', ['#collections', '#collectionDetail']],
    ['#monitor-detail', ['#monitor-detail', '#radar-detail']],
    ['#route-detail', ['#route-detail']],
    ['#project', ['#project']]
  ];
  let activeHref = '#home';
  zones.forEach(([href, ids]) => {
    ids.forEach(id => {
      const section = document.querySelector(id);
      if (!section) return;
      if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) activeHref = href;
    });
  });
  $$('.nav a, .quick-dock a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === activeHref));
}
window.addEventListener('scroll', updateActiveNav);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
$$('.section-reveal').forEach(el => observer.observe(el));

const cursorGlow = $('#cursorGlow');
const cursorBadge = $('#cursorBadge');
const cursorTrailLayer = $('#cursorTrailLayer');
let lastTrailTime = 0;
let lastTrailX = 0;
let lastTrailY = 0;
function spawnCursorTrail(x, y, angle){
  if(!cursorTrailLayer) return;
  const dot = document.createElement('span');
  dot.className = 'cursor-trail-dot';
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  dot.style.setProperty('--rot', angle + 'deg');
  cursorTrailLayer.appendChild(dot);
  setTimeout(() => dot.remove(), 650);
}
document.addEventListener('pointermove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  if(cursorBadge){
    cursorBadge.style.left = e.clientX + 'px';
    cursorBadge.style.top = e.clientY + 'px';
  }
  const boost = e.target.closest('.interactive-card, .panel, .quick-dock a, .btn, .nav a, .hero-stage, .route-stop, .category-card');
  document.body.classList.toggle('hover-boost', !!boost);
  const now = performance.now();
  const dx = e.clientX - lastTrailX;
  const dy = e.clientY - lastTrailY;
  const distance = Math.hypot(dx, dy);
  if(distance > 9 && now - lastTrailTime > (boost ? 14 : 24)){
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    spawnCursorTrail(e.clientX - dx * .32, e.clientY - dy * .32, angle);
    lastTrailTime = now;
    lastTrailX = e.clientX;
    lastTrailY = e.clientY;
  }
});

function initTiltCards(){
  $$('[data-tilt]').forEach(card => {
    if (card.dataset.bound) return;
    card.dataset.bound = '1';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.boxShadow = '0 24px 48px rgba(61,39,20,.14), 0 8px 22px rgba(61,39,20,.10)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}
initTiltCards();

const heroStage = $('.hero-stage');
heroStage.addEventListener('mousemove', (e) => {
  const rect = heroStage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  heroStage.querySelectorAll('.parallax').forEach(layer => {
    const depth = Number(layer.dataset.depth || 0);
    const tx = (x - rect.width / 2) / rect.width * depth;
    const ty = (y - rect.height / 2) / rect.height * depth;
    layer.style.transform = `translate(${tx}px, ${ty}px)`;
  });
});
heroStage.addEventListener('mouseleave', () => {
  heroStage.querySelectorAll('.parallax').forEach(layer => layer.style.transform = 'translate(0,0)');
});


function getCurrentItems(){
  const data = collectionData[activeCategory] || collectionData.bronze;
  return {data, items:[data.spotlight, ...data.cards]};
}
let currentModalItem = null;
function openArtifactModal(item){
  currentModalItem = item;
  const addBtn = document.querySelector('#addRouteBtn');
  if(addBtn){ addBtn.classList.remove('added'); addBtn.textContent = '加入导览路线'; }
  const data = collectionData[activeCategory] || collectionData.bronze;
  $('#modalTitle').textContent = item.title;
  $('#modalImage').src = item.img;
  $('#modalImage').alt = item.title;
  $('#modalDesc').textContent = item.desc;
  $('#modalCategory').textContent = data.title;
  const tags = item.tags || data.tags || [];
  $('#modalTags').innerHTML = tags.map(t => `<span>${t}</span>`).join('');
  const infoMap = {
    '三彩三足罐': ['三彩陶器', '釉色与器形'],
    '青花釉里红缠枝花卉纹盆': ['青花釉里红瓷器', '纹样与色彩'],
    '彩绘陶马': ['彩绘陶塑', '造型与姿态'],
    '蛋壳陶高柄杯': ['蛋壳陶器', '轻薄胎体'],
    '黑釉线条罐': ['黑釉陶瓷', '釉色对比'],
    '青铜礼乐器': ['礼乐器物', '礼制秩序'],
    '铜方壶': ['青铜容器', '器形结构'],
    '铜钁': ['青铜工具', '生产生活'],
    '铜鸟柱': ['青铜构件', '鸟形装饰'],
    '新莽铜诏版': ['铭刻文物', '文字信息'],
    '张在辛隶书轴': ['书法卷轴', '笔法章法'],
    '沈宗敬松岩飞瀑图轴': ['山水图轴', '山水层次'],
    '玉刀': ['玉质器物', '线条与磨制'],
    '玉神人头像': ['玉质人像', '人物造型'],
    '玉蝉指环': ['玉质佩饰', '细部工艺']
  };
  const mapped = infoMap[item.title] || [];
  const typeText = item.type || item.typeText || mapped[0] || (tags[0] ? tags[0] : data.title.replace('馆藏',''));
  const focusText = item.focus || item.focusText || mapped[1] || (tags[1] ? tags[1] : '器形与纹饰');
  const typeEl = $('#modalType');
  const focusEl = $('#modalFocus');
  if(typeEl) typeEl.textContent = typeText;
  if(focusEl) focusEl.textContent = focusText;
  $('#artifactModal').classList.add('show');
  $('#artifactModal').setAttribute('aria-hidden','false');
}
function closeArtifactModal(){
  $('#artifactModal').classList.remove('show');
  $('#artifactModal').setAttribute('aria-hidden','true');
}
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeArtifactModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeArtifactModal(); });
$('#spotlightImage')?.addEventListener('click', () => {
  const data = collectionData[activeCategory] || collectionData.bronze;
  openArtifactModal(data.spotlight);
});
$('#detailCards')?.addEventListener('click', (e) => {
  const card = e.target.closest('.detail-card');
  if(!card) return;
  const idx = [...card.parentNode.children].indexOf(card);
  const data = collectionData[activeCategory] || collectionData.bronze;
  openArtifactModal(data.cards[idx]);
});

// light follows pointer inside important cards
function bindLocalGlow(){
  $$('.overview-card,.category-card,.detail-card,.panel').forEach(el => {
    if(el.dataset.glowBound) return;
    el.dataset.glowBound = '1';
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}
bindLocalGlow();

// ==================== 直连 ESP32 MJPEG 流 ====================
const stream = $('#stream');
const placeholder = $('#streamPlaceholder');
const ESP32_STREAM = 'http://10.231.134.200:81/stream';

function stopStream() {
    stream.src = '';
    stream.style.display = 'none';
    if (placeholder) placeholder.style.display = 'grid';
}

function connectStream() {
    stopStream();
    stream.src = ESP32_STREAM;
}

if (stream) {
    stream.onload = function() {
        stream.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        const metaStrongs = document.querySelectorAll('.camera-meta strong');
        if (metaStrongs[0]) metaStrongs[0].textContent = '正常运行';
        if (metaStrongs[1]) metaStrongs[1].textContent = 'MJPEG 直连';
    };

    stream.onerror = function() {
        stopStream();
        const metaStrongs = document.querySelectorAll('.camera-meta strong');
        if (metaStrongs[0]) metaStrongs[0].textContent = '连接中断';
        if (metaStrongs[1]) metaStrongs[1].textContent = '已断开';
    };
}

$('#reconnectBtn')?.addEventListener('click', connectStream);
$('#fullscreenBtn')?.addEventListener('click', () => {
    const box = document.querySelector('.camera-shell');
    if (box && box.requestFullscreen) box.requestFullscreen();
});

connectStream();

// radar drawing
const radarState = { angle: 20, dir: 1, distance: 46, front: 42, left: 68, right: 53, suggest: 'SAFE' };
function drawRadar(canvas, compact = false, mini = false) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.save();
  ctx.fillStyle = mini ? '#0f3036' : compact ? '#0f3036' : 'rgba(247,235,210,.96)';
  ctx.fillRect(0,0,w,h);
  const cx = w * 0.5;
  const cy = h * 0.85;
  const maxR = Math.min(w, h) * (mini ? 0.78 : compact ? 0.72 : 0.8);
  ctx.strokeStyle = compact || mini ? 'rgba(205,186,130,.30)' : 'rgba(114,80,43,.36)';
  ctx.lineWidth = mini ? 1 : 1.35;
  for (let r = 0.25; r <= 1.0; r += 0.25) {
    ctx.beginPath(); ctx.arc(cx, cy, maxR * r, Math.PI, 0); ctx.stroke();
  }
  for (let a = 0; a <= 180; a += 30) {
    const rad = Math.PI - a * Math.PI / 180;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + maxR * Math.cos(rad), cy - maxR * Math.sin(rad)); ctx.stroke();
  }
  ctx.strokeStyle = compact || mini ? 'rgba(219,192,108,.46)' : 'rgba(139,92,52,.35)';
  ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();
  const angle = radarState.angle;
  const rad = Math.PI - angle * Math.PI / 180;
  const grad = ctx.createLinearGradient(cx, cy, cx + maxR * Math.cos(rad), cy - maxR * Math.sin(rad));
  grad.addColorStop(0, compact || mini ? 'rgba(198,227,164,.12)' : 'rgba(100,124,116,.12)');
  grad.addColorStop(1, compact || mini ? 'rgba(182,226,141,.92)' : 'rgba(109,133,123,.78)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = compact || mini ? 3.5 : 5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + maxR * Math.cos(rad), cy - maxR * Math.sin(rad)); ctx.stroke();
  const rr = maxR * (Math.max(12, radarState.distance) / 90);
  const ox = cx + rr * Math.cos(rad), oy = cy - rr * Math.sin(rad);
  ctx.fillStyle = compact || mini ? '#d7a653' : '#9a4024';
  ctx.beginPath(); ctx.arc(ox, oy, compact || mini ? 6 : 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = compact || mini ? 'rgba(215,166,83,.34)' : 'rgba(154,64,36,.26)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(ox, oy, compact || mini ? 14 : 20, 0, Math.PI * 2); ctx.stroke();
  if (!compact && !mini) {
    ctx.fillStyle = 'rgba(69,44,26,.78)';
    ctx.font = '18px Georgia';
    ctx.fillText(`${Math.round(angle)}°`, cx + maxR * .6, cy - maxR * .78);
    ctx.fillText(`${Math.round(radarState.distance)}cm`, ox + 16, oy - 10);
  }
  ctx.restore();
}

function tickRadar() {
  radarState.angle += radarState.dir * 1.15;
  if (radarState.angle > 165) { radarState.angle = 165; radarState.dir = -1; }
  if (radarState.angle < 15) { radarState.angle = 15; radarState.dir = 1; }
  radarState.distance = 34 + 18 * Math.sin(Date.now() / 900) + 8 * Math.cos(radarState.angle / 15);
  radarState.front = 42 + 11 * Math.sin(Date.now() / 1200);
  radarState.left = 68 + 7 * Math.cos(Date.now() / 1500);
  radarState.right = 53 + 9 * Math.sin(Date.now() / 1350 + 0.8);
  radarState.suggest = radarState.front < 28 ? 'WARN' : 'SAFE';
  const setText = (id, value) => { const el = document.querySelector('#' + id); if (el) el.textContent = value; };
  setText('angleText', Math.round(radarState.angle) + '°');
  setText('distanceText', Math.round(radarState.distance) + ' cm');
  setText('distanceSmall', Math.round(radarState.distance) + ' cm');
  setText('frontText', Math.round(radarState.front) + ' cm');
  setText('leftText', Math.round(radarState.left) + ' cm');
  setText('rightText', Math.round(radarState.right) + ' cm');
  setText('suggestText', radarState.suggest);
  setText('timeText', new Date().toLocaleTimeString('zh-CN', { hour12: false }));
  drawRadar(document.querySelector('#radarMiniCanvas'), true, true);
  drawRadar(document.querySelector('#radarLargeCanvas'), false, false);
  requestAnimationFrame(tickRadar);
}
tickRadar();

function tryRadarSocket() {
  try {
    const ws = new WebSocket(`ws://${location.host}/radar`);
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.type !== 'radar') return;
      Object.assign(radarState, data);
    };
  } catch (e) {}
}
tryRadarSocket();

window.dispatchEvent(new Event('scroll'));


// v14: homepage artifact carousel, based on v9 page with v12-style restrained rotation
(function(){
  const artifacts = [
    './assets/cutouts/sancai_tripod.png',
    './assets/cutouts/porcelain_plate.png',
    './assets/cutouts/jade_head.png',
    './assets/cutouts/exam_scroll.png'
  ];
  const current = document.querySelector('#carouselCurrent');
  const prev = document.querySelector('#carouselPrev');
  const next = document.querySelector('#carouselNext');
  const dotsWrap = document.querySelector('#carouselDots');
  const track = document.querySelector('#carouselTrack');
  const count = document.querySelector('#carouselCount');
  const main = document.querySelector('.artifact-main');
  if(!current || !prev || !next || !dotsWrap || !track || !count || !main) return;
  let idx = 0;
  let start = Date.now();
  const duration = 2500;
  let auto = true;

  dotsWrap.innerHTML = artifacts.map((_, i) => `<button type="button" aria-label="切换到第${i+1}件文物" data-i="${i}"></button>`).join('');
  const dots = [...dotsWrap.querySelectorAll('button')];
  dots.forEach(btn => btn.addEventListener('click', () => {
    const nextIdx = Number(btn.dataset.i);
    const direction = nextIdx > idx ? 'right' : 'left';
    idx = nextIdx;
    start = Date.now();
    render(direction);
  }));

  function render(direction='right'){
    const pre = (idx - 1 + artifacts.length) % artifacts.length;
    const nex = (idx + 1) % artifacts.length;
    current.src = artifacts[idx];
    prev.src = artifacts[pre];
    next.src = artifacts[nex];
    count.textContent = `${String(idx+1).padStart(2,'0')} / ${String(artifacts.length).padStart(2,'0')}`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    main.classList.remove('slide-from-right','slide-from-left');
    void main.offsetWidth;
    main.classList.add(direction === 'left' ? 'slide-from-left' : 'slide-from-right');
  }
  function step(direction='right'){
    idx = direction === 'left' ? (idx - 1 + artifacts.length) % artifacts.length : (idx + 1) % artifacts.length;
    start = Date.now();
    render(direction);
  }
  document.querySelector('#heroPrevBtn')?.addEventListener('click', () => step('left'));
  document.querySelector('#heroNextBtn')?.addEventListener('click', () => step('right'));
  document.querySelector('.hero-carousel')?.addEventListener('mouseenter', () => auto = false);
  document.querySelector('.hero-carousel')?.addEventListener('mouseleave', () => { auto = true; start = Date.now(); });
  function tick(){
    const ratio = Math.min((Date.now() - start) / duration, 1);
    track.style.width = (ratio * 100) + '%';
    if(auto && ratio >= 1) step('right');
    requestAnimationFrame(tick);
  }
  render();
  tick();
})();

// v16: route hover highlight and station note. No page jump / no detail popup.
(function(){
  const stops = Array.from(document.querySelectorAll('.route-line-large .route-stop'));
  const note = document.querySelector('#routeCurrentNote');
  if(!stops.length || !note) return;

  const routeText = {
    lobby: {
      name: '序厅',
      desc: '参观起点，用于了解山东大学博物馆智慧导览与安防巡检平台的整体功能。'
    },
    bronze: {
      name: '青铜器',
      desc: '本展区重点呈现青铜礼乐器、铜方壶等展品，展示青铜器的礼制意义与铸造工艺。'
    },
    painting: {
      name: '书画',
      desc: '本展区展示书法与山水图轴，突出笔墨章法、卷轴形式与传统文人审美。'
    },
    ceramic: {
      name: '陶瓷器',
      desc: '本展区展示三彩三足罐、青花釉里红盆等展品，呈现陶瓷器的釉色、器形与纹样之美。'
    },
    jade: {
      name: '玉石器',
      desc: '本展区展示玉刀、玉神人头像、玉蝉指环等展品，体现玉器工艺与象征意义。'
    },
    exit: {
      name: '尾厅',
      desc: '参观收束区域，用于回顾导览路线、系统功能与智慧文博项目成果。'
    }
  };

  function setRouteActive(key){
    const data = routeText[key] || routeText.lobby;
    stops.forEach(stop => stop.classList.toggle('current', stop.dataset.route === key));
    note.innerHTML = `<span>当前站点</span><strong>${data.name}</strong><p>${data.desc}</p>`;
  }

  window.setRouteActive = setRouteActive;
  stops.forEach(stop => {
    const key = stop.dataset.route;
    stop.addEventListener('mouseenter', () => setRouteActive(key));
    stop.addEventListener('focus', () => setRouteActive(key));
    stop.addEventListener('click', (e) => {
      e.preventDefault();
      setRouteActive(key);
    });
  });
})();


// v19: team floating panel, semi-dynamic patrol log, route-add feedback
(function(){
  const btn = document.querySelector('#teamFloatBtn');
  const panel = document.querySelector('#teamPanel');
  const close = document.querySelector('#teamCloseBtn');
  if(btn && panel){
    function toggle(show){
      const next = typeof show === 'boolean' ? show : !panel.classList.contains('show');
      panel.classList.toggle('show', next);
      panel.setAttribute('aria-hidden', String(!next));
      btn.setAttribute('aria-expanded', String(next));
    }
    btn.addEventListener('click', () => toggle());
    btn.addEventListener('mouseenter', () => toggle(true));
    // v20: keep panel stable; close with button or second click instead of accidental mouseleave
    close?.addEventListener('click', () => toggle(false));
  }
})();

const patrolLogTypes = [
  {kind:'normal', title:'摄像头接入', msg:'摄像头模块连接成功，实时监控画面等待刷新。'},
  {kind:'normal', title:'雷达扫描', msg:() => `雷达扫描角度 ${Math.round(radarState?.angle || 57)}°，当前距离 ${Math.round(radarState?.distance || 37)} cm。`},
  {kind:'warn', title:'避障提醒', msg:() => `前方距离 ${Math.round(radarState?.front || 52)} cm，系统建议保持低速巡检。`},
  {kind:'route', title:'路线状态', msg:'导览路线保持运行，当前节点可随路线模块切换。'},
  {kind:'normal', title:'系统巡检', msg:'监控、雷达与导览模块运行状态正常。'}
];
function nowTime(){ return new Date().toLocaleTimeString('zh-CN',{hour12:false}); }
function addPatrolLog(title, msg, kind='normal'){
  const box = document.querySelector('#patrolTimeline');
  if(!box) return;
  const article = document.createElement('article');
  article.className = kind;
  article.innerHTML = `<time>${nowTime()}</time><b>${title}</b><p>${typeof msg === 'function' ? msg() : msg}</p>`;
  box.prepend(article);
  while(box.children.length > 6) box.lastElementChild.remove();
}
window.addPatrolLog = addPatrolLog;
(function initPatrolLog(){
  addPatrolLog('系统启动','导览平台完成初始化，进入文物精华路线。','normal');
  setTimeout(()=>addPatrolLog('摄像头接入','ESP32-CAM 画面接入成功，实时监控窗口开始刷新。','normal'), 400);
  setTimeout(()=>addPatrolLog('雷达扫描','雷达模块进入扫描状态，等待环境测距数据更新。','route'), 800);
  let i = 0;
  setInterval(()=>{
    const item = patrolLogTypes[i % patrolLogTypes.length];
    addPatrolLog(item.title, item.msg, item.kind);
    i++;
  }, 4200);
})();

const selectedRouteItems = [];
function showRouteToast(text){
  const toast = document.querySelector('#routeToast');
  if(!toast) return;
  toast.innerHTML = `<div class="route-toast-inner"><b>✓</b><span>${text}</span></div>`;
  toast.classList.add('show');
  clearTimeout(showRouteToast._timer);
  showRouteToast._timer = setTimeout(()=>toast.classList.remove('show'), 2400);
}
function renderSelectedRoute(){
  const list = document.querySelector('#selectedRouteList');
  const box = document.querySelector('#selectedRouteBox');
  if(!list || !box) return;
  if(!selectedRouteItems.length){
    list.innerHTML = '';
    return;
  }
  box.querySelector('p').textContent = '已加入导览路线的展品，可作为后续讲解节点。';
  list.innerHTML = selectedRouteItems.map(name => `<em>${name}</em>`).join('');
}
document.querySelector('#addRouteBtn')?.addEventListener('click', () => {
  const item = currentModalItem;
  if(!item) return;
  if(!selectedRouteItems.includes(item.title)) selectedRouteItems.push(item.title);
  renderSelectedRoute();
  const btn = document.querySelector('#addRouteBtn');
  btn.classList.add('added');
  btn.textContent = '已加入路线';
  const routeKey = activeCategory || 'lobby';
  if(window.setRouteActive) window.setRouteActive(routeKey);
  showRouteToast(`已将“${item.title}”加入导览路线`);
  addPatrolLog('导览节点加入', `展品“${item.title}”已加入当前导览路线。`, 'route');
});

// add more meaningful logs to existing interactions
$$('.route-line-large .route-stop').forEach(stop => {
  stop.addEventListener('mouseenter', () => addPatrolLog('路线节点切换', `当前导览节点切换至：${stop.innerText.replace(/\n/g,' ')}`, 'route'));
});
