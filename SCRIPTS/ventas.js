function AcVentas() {
  let ContenedorVentas = document.getElementById("AcVentas");
  ContenedorVentas.style.display =ContenedorVentas.style.display === "none" ? "block" : "none";
}

function agregarMeta(area) {
  const titulo = prompt("Título de la meta:");
  const fecha = prompt("Fecha límite:");
  const kpi = prompt("KPI:");
  const responsable = prompt("Responsable:");
  if (!titulo) return;

  const card = document.createElement('div');
  const id = 'meta-' + Date.now();
  card.className = 'meta-card';
  card.id = id;
  card.setAttribute('draggable', true);

  card.innerHTML = `
    <div class="acciones">
      <i class="fas fa-pencil-alt" onclick="editarMeta('${id}')"></i>
      <i class="fas fa-trash" onclick="eliminarMeta('${id}')"></i>
    </div>
    <h4>${titulo}</h4>
    <p>📅 Fecha límite: ${fecha}</p>
    <p>🎯 KPI: ${kpi}</p>
    <p>👤 Responsable: ${responsable}</p>
  `;

  // Eventos drag
  addDragEvents(card);

  document.getElementById(`area-${area}`).appendChild(card);
}

function editarMeta(id) {
  const card = document.getElementById(id);
  const nuevoTitulo = prompt("Editar título:", card.querySelector('h4').textContent);
  const nuevaFecha = prompt("Editar fecha límite:");
  const nuevoKPI = prompt("Editar KPI:");
  const nuevoResponsable = prompt("Editar responsable:");
  if (!nuevoTitulo) return;

  card.querySelector('h4').textContent = nuevoTitulo;
  const ps = card.querySelectorAll('p');
  ps[0].innerHTML = `📅 Fecha límite: ${nuevaFecha}`;
  ps[1].innerHTML = `🎯 KPI: ${nuevoKPI}`;
  ps[2].innerHTML = `👤 Responsable: ${nuevoResponsable}`;
}

function eliminarMeta(id) {
  if (confirm("¿Eliminar esta meta?")) {
    document.getElementById(id).remove();
  }
}

function addDragEvents(card) {
  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', card.id);
    setTimeout(() => card.style.opacity = '0.5', 0);
  });

  card.addEventListener('dragend', e => {
    card.style.opacity = '1';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const columns = document.querySelectorAll('.area-column');
  const cards = document.querySelectorAll('.meta-card');

  cards.forEach(addDragEvents);

  columns.forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', e => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData('text/plain');
      const card = document.getElementById(cardId);
      col.querySelector('div').appendChild(card);
      col.classList.remove('drag-over');
    });
  });
});