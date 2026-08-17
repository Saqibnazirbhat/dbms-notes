<script>
const app = $('#app'), bar = $('#topbar');
function route() {
  ANIM.clear();   /* stop every loop from the outgoing page before it is replaced */
  const h = location.hash.replace(/^#\/?/, '');
  const c = CH.find(x => x.s === h);
  bar.innerHTML = topbar(c ? c.s : null);
  if (c) {
    const R = window['renderWeek' + c.n], I = window['initWeek' + c.n];
    if (typeof R === 'function') {
      app.innerHTML = R();
      if (typeof I === 'function') { try { I(); } catch (e) { console.error('init', c.n, e); } }
    } else {
      app.innerHTML = `<div class="wrap"><div class="chead"><h1>${c.t}</h1>
        <p class="subtitle">This chapter is not built yet.</p></div></div>`;
    }
  } else {
    app.innerHTML = renderTOC();
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();
</script>
