/* app.js
   من هنا يبدأ العرض، يتم توليد الواجهات من data.js
   ملاحظة: الكود موجّه ليعمل بدون بناء (vanilla JS) لتسهيل النسخ.
*/

const $ = selector => document.querySelector(selector);

// Sections
const sections = {
  hub: $('#hub'),
  worldcup: $('#worldcup'),
  continental: $('#continental'),
  head2head: $('#head2head'),
  stats: $('#stats'),
  kits: $('#kits')
};

// Navigation
document.querySelectorAll('.main-nav button').forEach(btn => {
  btn.addEventListener('click', e => {
    document.querySelectorAll('.main-nav button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.dataset.section;
    showSection(section);
  });
});

function showSection(name){
  Object.keys(sections).forEach(k=>{
    sections[k].classList.remove('active-section');
  });
  sections[name].classList.add('active-section');
  // on show, render
  if(name === 'hub') renderHub();
  if(name === 'worldcup') renderWorldCup();
  if(name === 'continental') renderContinental();
  if(name === 'head2head') renderHead2Head();
  if(name === 'stats') renderStats();
  if(name === 'kits') renderKits();
}

// Search
$('#search').addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  
  if(!q){ renderHub(); return; }
  const filtered = TEAMS.filter(t => t.name.toLowerCase().includes(q) || (t.notable.join(' ').toLowerCase().includes(q)));
  renderHub(filtered);
});

/* --------- Render Hub (قاعدة البيانات لكل منتخب) ---------- */
function renderHub(list = TEAMS){
  const el = sections.hub;
  el.innerHTML = `
    <h2>قاعدة بيانات المنتخبات العربية</h2>
    <p>استعراض بيانات المنتخبات العربية: ملفات، أبرز الإنجازات واللاعبين.</p>
    <div class="grid" id="teams-grid"></div>
  `;
  const grid = el.querySelector('#teams-grid');
  list.forEach(team => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="team-header">
        <div class="team-crest"><img class="t-crest" src=${team.crest}></div>
        <div style="flex:1">
          <h3>${team.name} <span class="tag">${team.conf}</span></h3>
          <p>
          <strong>المدرب:</strong> ${team.coach}
          </p>
          <p>
          <strong>أبرز اللاعبين:</strong> ${team.notablez.slice(0,3).join(' · ')}
          </p>
        </div>
        <div style="text-align:left">
          <button class="btn open" onclick="openTeam('${team.id}')">عرض الملف</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* Open team profile (عرض ملف منتخب) */
window.openTeam = function(teamId){
  const team = TEAMS.find(t=>t.id===teamId);
  if(!team) return alert('منتخب غير موجود');
  const el = sections.hub;
  el.innerHTML = `
    <div class="row" style="align-items:flex-start">
      <div style="width:260px">
        <div class="card">
          <div class="team-crest"><img style="width:70px" src=${team.crest}></div>
          <h3>${team.name}</h3>
          <p><strong>الاتحاد القاري:</strong> ${team.conf}</p>
          <p><strong>التصنيف الدولي:</strong> ${team.fifaRank} عالمياً</p>
          <p><strong>الملعب:</strong> ${team.stadium}</p>
          <p><strong>المدرب:</strong> ${team.coach}</p>
          <p><strong>قائد الفريق:</strong> ${team.captain || '-'}</p>
          <div style="margin-top:8px;">
            <button class="btn" onclick="showSection('worldcup'); renderWorldCup('${team.id}')">مشاركات المونديال</button>
            <button class="btn" onclick="showSection('continental'); renderContinental('${team.id}')">الإنجازات القارية</button>
          </div>
        </div>
      </div>

      <div style="flex:1">
        <div class="card">
          <h3>نبذة مختصرة:</h3>
          <table class="table">
            <tr><th>أول مشاركة في المونديال</th><td>${team.firstWorldCup || '-'}</td></tr>
            <tr><th>أبرز إنجاز في المونديال</th><td>${team.worldCup.best || '-'}</td></tr>
            <tr><th>ألقاب قارية وعربية</th><td>${team.afcon.titles || 0} من الألقاب</td></tr>
            <tr><th>الهداف التاريخي</th><td>${team.stats.goalsLeader.name} (${team.stats.goalsLeader.goals} هدف)</td></tr>
            <tr><th>الأكثر مشاركة مع المنتخب دولياً</th><td>${team.stats.capsLeader.name} (${team.stats.capsLeader.caps} مباراة دولية)</td></tr>
          </table>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>الخط الزمني:</h3>
          <p>عرض مبسط للأحداث الهامة </p>
          <div id="timeline"><em>${team.timeline}</em></div>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>الأساطير:</h3>
          <div class="grid">
            ${team.notable.map(n=>`<div class="card"><h3>${n}</h3><p>إنجازات وأرقام (جاري إعدادها ...)</p></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top:12px">
      <button class="btn" onclick="renderHub()">عودة للبيت</button>
    </div>
  `;
};

/* --------- World Cup Encyclopedia ---------- */
function renderWorldCup(teamId){
  const el = sections.worldcup;
  el.innerHTML = `<h2>موسوعة مشاركات المنتخبات العربية في كأس العالم</h2><div id="world-list" class="grid"></div>`;
  const list = TEAMS;
  const container = el.querySelector('#world-list');
  list.forEach(t=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <h3>${t.name} ${t.crestz}</h3>
      <p><strong>عدد المشاركات:</strong> ${t.worldCup.appearances || '-'}</p>
      <p><strong>أول مشاركة:</strong> ${t.firstWorldCup || '-'}</p>
      <p><strong>أبرز إنجاز:</strong> ${t.worldCup.best || '-'}</p>
      <div class="controls">
        <button class="btn" onclick="showTeamWorldHistory('${t.id}')">عرض التاريخ</button>
        <button class="btn" onclick="compareToAll('${t.id}')">قارن مع العرب</button>
      </div>
    `;
    container.appendChild(card);
  });
  if(teamId) showTeamWorldHistory(teamId);
}

window.showTeamWorldHistory = function(teamId){
  const t = TEAMS.find(x=>x.id===teamId);
  const target = sections.worldcup;
  target.innerHTML = `
    <h2>سجل ${t.name} في كأس العالم</h2>
    <div class="row">
      <div style="flex:1">
        <div class="card">
          <h3>${t.name} — ملخص</h3>
          <p>عدد المشاركات: ${t.worldCup.appearances || '-'}</p>
          <p>أبرز إنجاز: ${t.worldCup.best}</p>
          <p>أول مشاركة: ${t.firstWorldCup}</p>
        </div>
      </div>
    </div>
    <div style="margin-top:12px"><button class="btn" onclick="renderWorldCup()">عودة</button></div>
  `;
};

/* Compare with others (مقارنة بسيطة) */
window.compareToAll = function(teamId){
  const t = TEAMS.find(x=>x.id===teamId);
  const others = TEAMS.filter(x=>x.id!==teamId);
  const el = sections.worldcup;
  el.innerHTML = `
    <h2>مقارنة: ${t.name} مع باقي المنتخبات العربية</h2>
    <div class="grid">
      ${others.map(o=>`<div class="card"><h3>${o.name}</h3><p>أول مشاركة: ${o.firstWorldCup || '-'}</p><p>أبرز إنجاز: ${o.worldCup.best}</p></div>`).join('')}
    </div>
    <div style="margin-top:12px"><button class="btn" onclick="renderWorldCup()">عودة</button></div>
  `;
};

/* --------- Continental (الكؤوس القارية AFCON & AFC) ---------- */
function renderContinental(teamId){
  const el = sections.continental;
  el.innerHTML = `
    <h2>البطولات القارية: أمم إفريقيا و كأس آسيا و كأس العرب و كأس الخليج العربي</h2>
    <div class="grid">
      <div class="card green"><h3>CAF - كأس الأمم الأفريقية</h3><p>سجل المنتخبات العربية في أمم إفريقيا.</p></div>
      <div class="card green"><h3>AFC - كأس آسيا</h3><p>سجل المنتخبات العربية في كأس آسيا.</p></div>
    </div>
    <div class="grid">
      <div class="card green"><h3>AFC - كأس الخليج العربي</h3><p>سجل المنتخبات العربية في كأس الخليج.</p></div>
      <div class="card green"><h3>FIFA - كأس العرب</h3><p>سجل المنتخبات العربية في كأس العرب.</p></div>
    </div>
    <div id="continent-list" style="margin-top:12px"></div>
  `;
  // list teams with titles
  const listEl = el.querySelector('#continent-list');
  listEl.innerHTML = `<div class="grid">${TEAMS.map(t=>`<div class="card"><h3>${t.name} ${t.crestz}</h3><p>ألقاب قارية وعربية: ${t.afcon.titles || 0} من الألقاب</p><p>الإنجازات: ${t.afcon.best}</p></div>`).join('')}</div>`;
  if(teamId){
    // scroll to team card if needed (basic)
  }
}

/* --------- Head-to-Head ---------- */
function renderHead2Head(){
  const el = sections.head2head;
  el.innerHTML = `
    <h2>المواجهات العربية (وجهاً لوجه)</h2>
    <p>استعراض تاريخ أبرز المواجهات بين المنتخبات العربية.</p>
    <div class="card">
      <h3>بحث</h3>
      <div class="controls">
        <select id="h2h-home"></select>
        <select id="h2h-away"></select>
        <button class="btn" id="h2h-filter">عرض المواجهات</button>
      </div>
      <div id="h2h-results" style="margin-top:12px"></div>
    </div>
  `;
  const home = $('#h2h-home');
  const away = $('#h2h-away');
  TEAMS.forEach(t=>{
    const opt1 = document.createElement('option'); opt1.value=t.id; opt1.textContent=t.name; home.appendChild(opt1);
    const opt2 = document.createElement('option'); opt2.value=t.id; opt2.textContent=t.name; away.appendChild(opt2);
  });
  $('#h2h-filter').addEventListener('click', ()=>{
    const h = home.value, a = away.value;
    const matches = HEAD2HEAD.filter(m => (m.home===h && m.away===a) || (m.home===a && m.away===h));
    const results = $('#h2h-results');
    if(matches.length===0) results.innerHTML = `<p class="muted">لا توجد مواجهات مسجلة بين هذين المنتخبين في البيانات التجريبية.</p>`;
    else results.innerHTML = `<table class="table"><tr><th>التاريخ</th><th>المواجهة</th><th>النتيجة</th><th>المناسبة</th></tr>${matches.map(mm=>`<tr><td>${mm.date}</td><td>${teamName(mm.home)} vs ${teamName(mm.away)}</td><td>${mm.score}</td><td>${mm.comp}</td></tr>`).join('')}</table>`;
  });
}

/* --------- Stats & Charts ---------- */
function renderStats(){
  const el = sections.stats;
  el.innerHTML = `
    <h2>إحصائيات وتصنيفات (جماعية وفردية)</h2>
    <div class="grid">
      <div class="card">
        <h3>الأكثر فوزاً بالألقاب</h3>
        <div id="most-titles"></div>
      </div>
      <div class="card">
        <h3>الأكثر تأهلاً لكأس العالم</h3>
        <div id="most-apps"></div>
      </div>
      <div class="card">
        <h3>تصنيف الفيفا للعرب (حتي تاريخ ٢٢ ديسمبر ٢٠٢٥)</h3>
        <div id="fifaRank"></div>
      </div>
      <div class="card">
        <h3>الأكثر تمثيلاً للعرب دولياً</h3>
        <div id="capsPl"></div>
      </div>
    </div>
  `;

  // most titles
  const mt = GLOBAL_STATS.mostTitles.map(s=>{
    const team = TEAMS.find(t=>t.id===s.teamId);
    return `<div class="trophies" style="padding:6px 0"><strong>${team.crestz} ${team.name}</strong> · ${s.titles} من الألقاب</div>`;
  }).join('');
  $('#most-titles').innerHTML = mt;

  // most apps
  const mapps = GLOBAL_STATS.mostWorldCupAppearances.map(s=>{
    const team = TEAMS.find(t=>t.id===s.teamId);
    return `<div class="trophies" style="padding:6px 0"><strong>${team.crestz} ${team.name}</strong> <br> ${s.apps} من المشاركات في المونديال</div>`;
  }).join('');
  $('#most-apps').innerHTML = mapps;

  // fifa rank
  const fr = GLOBAL_STATS.fifaRank.map(s=>{
    const team = TEAMS.find(t=>t.id===s.teamId);
    return `<div class="ranking" style="padding:6px 0"><strong>${team.crestz} ${team.name}</strong> · ${s.fifaRank} عالمياً</div>`;
  }).join('');
  $('#fifaRank').innerHTML = fr;

  // captain caps
  const ca = GLOBAL_STATS.capsPl.map(s=>{
    const team = TEAMS.find(t=>t.id===s.teamId);
    return `<div class="ranking" style="padding:6px 0"><strong>${team.crestz} ${team.name}</strong> <br> ${s.playerN} · ${s.playerCaps} مباراة دولية</div>`;
  }).join('');
  $('#capsPl').innerHTML = ca;
}

/* --------- Kits Museum ---------- */
function renderKits(){
  const el = sections.kits;
  el.innerHTML = `<h2>متحف القمصان الوطنية</h2><p>صور القمصان التاريخية لكل منتخب.</p><div class="grid">${TEAMS.map(t=>`<div class="card"><div class="kit-img">${t.crest} ${t.name}</div><p>${t.kitYears.length} تصاميم مسجلة</p><button class="btn" onclick="showKits('${t.id}')">عرض القمصان</button></div>`).join('')}</div>`;
}

window.showKits = function(teamId){
  const team = TEAMS.find(t=>t.id===teamId);
  const el = sections.kits;
  el.innerHTML = `
    <h2>قَمصان ${team.name}</h2>
    <div class="grid">
      ${team.kitYears.length ? team.kitYears.map(k=>`<div class="card"><div class="kit-img">${k.year}</div><p>${k.desc}</p></div>`).join('') : `<div class="card"><p class="muted">لا توجد صور مسجلة — أضف في data.js</p></div>`}
    </div>
    <div style="margin-top:12px"><button class="btn" onclick="renderKits()">عودة</button></div>
  `;
};

/* Utility */
function teamName(id){ const t = TEAMS.find(x=>x.id===id); return t? t.name : id; }

/* Initial render */
renderHub();
// chef-belly