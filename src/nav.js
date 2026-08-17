<script>
const CH = [
  {s:'week-1', n:1, t:'Foundations of a Database System',
   d:'Why a file is not enough, the three levels a database is described at, and what the engine is doing when you hand it a query.'},
  {s:'week-2', n:2, t:'The Relational Model and Basic SQL',
   d:'Relations, keys and constraints, then building tables and asking the first real questions with SELECT, FROM and WHERE.'},
  {s:'week-3', n:3, t:'Aggregation, Joins and Subqueries',
   d:'The university schema, grouping rows into summaries, joins, queries that contain other queries, views and triggers, worked on the lecture&rsquo;s own examples.'},
  {s:'week-4', n:4, t:'Relational Algebra and ER Modelling',
   d:'The formal algebra SQL compiles into, division, tuple and domain relational calculus, and how a real schema is designed and mapped to tables.'},
  {s:'week-5', n:5, t:'Functional Dependencies and Decomposition',
   d:'What it means for one attribute to determine another, closures, canonical cover, and splitting a table without losing anything.'},
  {s:'week-6', n:6, t:'Normal Forms',
   d:'1NF through BCNF and 4NF: deciding which form a relation is in, why 3NF is the practical target, and what temporal relations record.'},
  {s:'week-7', n:7, t:'Applications and Databases',
   d:'Layers, tiers and the web architecture, cookies and sessions, then talking to PostgreSQL from Python and the injection bug that parameters prevent.'},
  {s:'week-8', n:8, t:'Complexity, Disks and Buffers',
   d:'Why one algorithm beats another, how a search tree is shaped, what a spinning disk costs per read, how files are organised, and which page to evict.'},
];
const idx = s => CH.findIndex(c => c.s === s);

function chead(slug) {
  const c = CH[idx(slug)];
  return `<div class="wrap"><div class="chead">
    <div class="crumb">DBMS Bible &middot; Chapter ${c.n}</div>
    <h1>${c.t}</h1><p class="subtitle">${c.d}</p></div>`;
}
function cfoot(slug) {
  const i = idx(slug), p = CH[i - 1], n = CH[i + 1];
  const L = p ? `<a href="#/${p.s}"><div class="tag">Previous</div>
      <div class="nm">${ARW_L} ${p.t}</div></a>` : '';
  const R = n ? `<a href="#/${n.s}"><div class="tag">Next</div>
      <div class="nm">${n.t} ${ARW_R}</div></a>`
    : `<a href="#/"><div class="tag">The end</div>
      <div class="nm">Back to contents ${ARW_R}</div></a>`;
  return `<div class="cfoot"><div class="side">${L}</div><div class="side r">${R}</div></div></div>`;
}
function topbar(slug) {
  if (!slug) return `<span>DBMS Bible</span><span>Eight chapters</span>`;
  const i = idx(slug), p = CH[i - 1], n = CH[i + 1];
  return `<a href="#/">${ARW_L} DBMS Bible</a><div class="navr">` +
    (p ? `<a href="#/${p.s}">${ARW_L} Prev</a>` : `<span class="dis">${ARW_L} Prev</span>`) +
    (n ? `<a href="#/${n.s}">Next ${ARW_R}</a>` : `<span class="dis">Next ${ARW_R}</span>`) +
    `</div>`;
}
function renderTOC() {
  return `<div class="wrap"><div class="toc-head">
    <h1 class="toc-title">DBMS Bible</h1>
    <p class="toc-sub">A from-scratch guide to database systems: the relational model, SQL,
    relational algebra, schema design, normalization, and how the storage engine underneath
    actually works.</p></div>
    <div class="toc-label">Table of contents</div>
    ${CH.map(c => `<a class="toc-row" href="#/${c.s}">
      <span class="num">Chapter ${c.n}</span>
      <span class="nm"><b>${c.t}</b><span>${c.d}</span></span>
      <span class="arw">${ARW_R}</span></a>`).join('')}
    <div style="height:64px"></div></div>`;
}
</script>
