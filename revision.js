const params = new URLSearchParams(window.location.search);
const itemId = params.get('item');
const linkIndex = parseInt(params.get('link'), 10);
let items = [];

async function loadRevision() {
  const res = await fetch('data.json');
  items = await res.json();
  const item = items.find(i => i.id === itemId);
  if (!item || !item.links[linkIndex].revision) return;
  const revs = item.links[linkIndex].revision;
  renderNav(revs);
  loadDoc(revs[0].url, 0);
}

function renderNav(revs) {
  const nav = document.getElementById('nav-list');
  nav.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.id = 'back-button';
  backBtn.innerText = '← Back';
  backBtn.addEventListener('click', () => {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.history.go(-1);
    }
  });
  nav.appendChild(backBtn);

  revs.forEach((rev, idx) => {
    const btn = document.createElement('button');
    btn.innerText = rev.label;
    btn.addEventListener('click', () => loadDoc(rev.url, idx));
    nav.appendChild(btn);
  });
}

function loadDoc(url, idx) {
  const navButtons = document.querySelectorAll('.rev-nav button');
  navButtons.forEach((b, i) => {
    if (b.id !== 'back-button') {
      b.classList.toggle('active', i - 1 === idx); // shift index because back button is first
    }
  });
  document.getElementById('doc-frame').src = url;
}

loadRevision();
