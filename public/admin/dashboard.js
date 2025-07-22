const apiKey = 'd3f7a8c2-98ab-4fa6-832c-69e9341cd95e'; // You’ll protect this

async function loadCompliments() {
  const res = await fetch('/admin/compliments', {
    headers: { 'x-api-key': apiKey }
  });
  const data = await res.json();

  const list = document.getElementById('complimentList');
  list.innerHTML = '';

  data.compliments.forEach(({ id, content, created_at, flagged  }) => {
    const li = document.createElement('li');

    const flagText = flagged === 1 ? 'Yes 🚩 look closer to see' : 'No';
    const flagClass = flagged === 1 ? 'flagged' : '';

    li.innerHTML = `
     <label>
        <input type="checkbox" class="compliment-check" value="${id}">
        ${content}
      </label>
      <div><strong>Created:</strong> ${new Date(created_at).toLocaleString()}</div>
      <div><strong>Flagged:</strong> <span class="${flagClass}">${flagText}</span></div>
      <button onclick="deleteCompliment(${id})">🗑️ Delete</button>
    `;
    list.appendChild(li);
  });
}

async function deleteCompliment(id) {
  const res = await fetch(`/admin/compliment/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': apiKey }
  });

  if (res.ok) {
    alert('Compliment deleted!');
    loadCompliments();
  } else {
    alert('Error deleting compliment.');
  }
}


async function deleteSelectedCompliments() {
  const checkboxes = document.querySelectorAll('.compliment-check:checked');
  if (checkboxes.length === 0) return alert("No compliments selected");

  const confirmed = confirm(`Delete ${checkboxes.length} compliment(s)?`);
  if (!confirmed) return;

  for (const box of checkboxes) {
    const id = box.value;
    await fetch(`/admin/compliment/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': apiKey }
    });
  }
 }

  

function filterCompliments() {
  const search = document.getElementById('filter').value.toLowerCase();
  const items = document.querySelectorAll('#complimentList li');
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(search) ? 'block' : 'none';
  });
}

loadCompliments();