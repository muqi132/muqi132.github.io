(function localQuotesBrowser() {
  if (window.__blogmanagerQuotes) { window.__blogmanagerQuotes.enter(); return; }
  let active = null;
  let timer = null;
  const leave = () => { active = null; clearTimeout(timer); timer = null; };
  const enter = () => {
    const dataNode = document.getElementById('blogmanager-quotes-data');
    const target = document.getElementById('subtitle');
    if (!dataNode || !target || active === dataNode) return;
    clearTimeout(timer);
    active = dataNode;
    const data = JSON.parse(dataNode.textContent);
    const quote = data.quotes.length ? data.quotes[Math.floor(Math.random() * data.quotes.length)] : { text: data.fallback, from: '' };
    const wrapper = target.parentElement;
    wrapper.hidden = !quote.text;
    target.replaceChildren();
    const text = document.createElement('span');
    text.className = 'bm-quote-text';
    const from = document.createElement('small');
    from.className = 'bm-quote-from';
    from.textContent = quote.from || '';
    from.hidden = !quote.from;
    target.append(text, from);
    if (!data.typewriter) text.textContent = quote.text;
    else {
      const characters = Array.from(quote.text);
      let index = 0;
      const type = () => {
        if (active !== dataNode || !target.isConnected) return;
        text.textContent += characters[index++] || '';
        if (index < characters.length) timer = setTimeout(type, 65);
      };
      type();
    }
  };
  window.__blogmanagerQuotes = { enter };
  document.addEventListener('pjax:send', leave);
  document.addEventListener('pjax:complete', enter);
  window.addEventListener('pageshow', event => { if (event.persisted) { leave(); enter(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enter, { once: true });
  else enter();
})();