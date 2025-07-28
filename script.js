const dataUrl = 'data.json';
let items = [];

function formatDate(unix) {
  const d = new Date(unix * 1000);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function urgencyToColor(urgency) {
  switch (urgency) {
    case 2: return '#e74c3c';   // red
    case 1: return '#f39c12';   // orange
    case 0:
    default: return '#f1c40f';  // yellow
  }
}


async function loadData() {
  const res = await fetch(dataUrl);
  items = await res.json();
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '';
  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.borderColor = urgencyToColor(item.urgency);
    card.innerHTML = `
      <div class="title">${item.title}</div>
      <div class="due">${formatDate(item.due)}</div>
    `;
    card.addEventListener('click', () => openPopup(idx));
    grid.appendChild(card);
  });
}

function openPopup(index) {
  const item = items[index];
  document.getElementById('popup-title').innerText = item.title;
  document.getElementById('popup-text').innerText = item.text;
  const linksDiv = document.getElementById('popup-links');
  linksDiv.innerHTML = '';
  item.links.forEach((link, li) => {
    const btn = document.createElement('button');
    btn.innerText = link.label;
    btn.addEventListener('click', () => handleLink(item.id, li));
    linksDiv.appendChild(btn);
  });
  document.getElementById('popup-overlay').classList.add('show');
}

function handleLink(itemId, linkIndex) {
  const item = items.find(i => i.id === itemId);
  const link = item.links[linkIndex];

  switch (link.type) {
    case 'revision':
      window.location.href = `revision.html?item=${itemId}&link=${linkIndex}`;
      break;
  }
}


document.getElementById('close-popup').addEventListener('click', () => {
  document.getElementById('popup-overlay').classList.remove('show');
});

loadData();
