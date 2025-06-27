// Mostrar / Ocultar editor visual
function toggleEditorVentasDani() {
  const editor = document.getElementById("editorContainerVentasDani");
  const button = event.target;
  const isVisible = editor.style.display === "flex" || editor.style.display === "block";
  editor.style.display = isVisible ? "none" : "flex";
  button.textContent = isVisible ? "Abrir Editor Visual" : "Cerrar Editor Visual";
}

// Cerrar automáticamente el editor si se hace clic en cualquier otro botón fuera de él
document.addEventListener("click", function (e) {
  const editor = document.getElementById("editorContainerVentasDani");
  const toggleButton = document.querySelector("[onclick='toggleEditorVentasDani()']");

  // Si el editor está oculto, no hacer nada
  if (!editor || (editor.style.display !== "flex" && editor.style.display !== "block")) return;

  // Si se hizo clic dentro del editor o en el botón que lo muestra, no cerrar
  if (editor.contains(e.target) || (toggleButton && toggleButton.contains(e.target))) return;

  // Ocultar el editor
  editor.style.display = "none";
  if (toggleButton) toggleButton.textContent = "Abrir Editor Visual";
});


// Cambiar formato y tamaño del canvas
function handleFormatChangeVentasDani() {
  const format = document.getElementById("formatSelectVentasDani").value;
  prepareCanvasVentasDani(format);
}


function prepareCanvasVentasDani(format) {
  const [w, h] = format.split("x").map(Number);
  const editor = document.getElementById("editorVentasDani");
  const container = editor.parentElement;

  // Resetear transform para forzar nueva posición si el usuario cambia de formato
  editor.style.transform = "none";

  // Set exact size
  editor.style.width = w + "px";
  editor.style.height = h + "px";

  // Escalado responsivo (si el canvas es más grande que el contenedor)
  const scaleW = container.clientWidth / w;
  const scaleH = container.clientHeight / h;
  const scale = Math.min(scaleW, scaleH, 1); // no escalar si cabe completo

  // Si es formato Story (ej. 1080x1920), mover un poco a la derecha
  const offsetX = (w === 1080 && h === 1920) ? 150 : 0;

  editor.style.transform = `translate(${offsetX}px, 0px) scale(${scale})`;
  editor.style.transformOrigin = "top left";

  document.getElementById("canvasSizeVentasDani").innerText = `Formato: ${w}x${h}`;
}

// Agregar texto al editor
function addTextVentas() {
  const text = document.getElementById("customTextVentasDani").value;
  const color = document.getElementById("textColorVentasDani").value;
  const font = document.getElementById("fontFamilyVentasDani").value;
  const size = document.getElementById("fontSizeVentasDani").value;

  const div = document.createElement("div");
  div.className = "text-box draggable";
  div.setAttribute("data-x", 0);
  div.setAttribute("data-y", 0);
  div.style.color = color;
  div.style.fontFamily = font;
  div.style.fontSize = size + "px";
  div.style.transform = "translate(0px, 0px) rotate(0deg)";
  div.contentEditable = true;
  div.textContent = text;

  const tools = document.createElement("div");
  tools.className = "element-tools";
  tools.innerHTML = `
    <button onclick="rotateElement(this)">↻</button>
    <button onclick="duplicateElement(this)">⧉</button>
    <button onclick="deleteElement(this)">🗑️</button>`;
  div.appendChild(tools);

  document.getElementById("editorVentasDani").appendChild(div);
  enableInteract(div);
}

// Funciones para manipular elementos
function deleteElement(btn) {
  const box = btn.closest('.draggable') || btn.closest('.text-box');
  if (box) box.remove();
}

function rotateElement(btn) {
  const box = btn.closest('.draggable') || btn.closest('.text-box');
  if (!box) return;
  let current = box.style.transform.match(/rotate\((\d+)deg\)/);
  let angle = current ? parseInt(current[1]) : 0;
  angle = (angle + 15) % 360;
  const x = box.getAttribute("data-x") || 0;
  const y = box.getAttribute("data-y") || 0;
  box.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
}

function duplicateElement(btn) {
  const original = btn.closest('.draggable') || btn.closest('.text-box');
  if (!original) return;
  const clone = original.cloneNode(true);
  const editor = document.getElementById("editorVentasDani");
  let x = parseFloat(original.getAttribute("data-x") || 0) + 20;
  let y = parseFloat(original.getAttribute("data-y") || 0) + 20;
  const rotation = original.style.transform.match(/rotate\((\d+)deg\)/);
  const rotateValue = rotation ? rotation[1] : 0;
  clone.setAttribute("data-x", x);
  clone.setAttribute("data-y", y);
  clone.style.transform = `translate(${x}px, ${y}px) rotate(${rotateValue}deg)`;
  editor.appendChild(clone);
  enableInteract(clone);
}

// Drag & Resize
function enableInteract(el) {
  el.addEventListener("click", function () {
    document.querySelectorAll(".draggable").forEach(d => d.classList.remove("selected"));
    el.classList.add("selected");
  });

  interact(el)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          const rotation = target.style.transform.match(/rotate\((\d+)deg\)/);
          const rotateValue = rotation ? rotation[1] : 0;
          target.style.transform = `translate(${x}px, ${y}px) rotate(${rotateValue}deg)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          let { x, y } = event.target.dataset;
          x = parseFloat(x) || 0;
          y = parseFloat(y) || 0;
          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`
          });
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          const rotation = event.target.style.transform.match(/rotate\((\d+)deg\)/);
          const rotateValue = rotation ? rotation[1] : 0;
          event.target.style.transform = `translate(${x}px, ${y}px) rotate(${rotateValue}deg)`;
          event.target.setAttribute('data-x', x);
          event.target.setAttribute('data-y', y);
        }
      }
    });
}

// Imagen y fondo
document.getElementById("uploadImageVentasDani").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const editor = document.getElementById("editorVentasDani");
    const wrapper = document.createElement("div");
    wrapper.className = "draggable";
    wrapper.setAttribute("data-x", 0);
    wrapper.setAttribute("data-y", 0);
    wrapper.style.transform = "translate(0px, 0px) rotate(0deg)";
    wrapper.style.width = "200px";
    const img = document.createElement("img");
    img.src = event.target.result;
    const tools = document.createElement("div");
    tools.className = "element-tools";
    tools.innerHTML = `
      <button onclick="rotateElement(this)">↻</button>
      <button onclick="duplicateElement(this)">⧉</button>
      <button onclick="deleteElement(this)">🗑️</button>`;
    wrapper.appendChild(tools);
    wrapper.appendChild(img);
    editor.appendChild(wrapper);
    enableInteract(wrapper);
  };
  reader.readAsDataURL(file);
});

document.getElementById("uploadBackgroundVentasDani").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    document.getElementById("editorVentasDani").style.backgroundImage = `url('${event.target.result}')`;
  };
  reader.readAsDataURL(file);
});

// Filtros
function applyFilterVentas(filterValue) {
  document.getElementById("editorVentasDani").style.filter = filterValue;
}

// Descargar como imagen
function downloadImageVentas() {
  const editor = document.getElementById("editorVentasDani");
  if (!editor) return;

  const tools = editor.querySelectorAll('.element-tools');
  tools.forEach(tool => tool.style.visibility = 'hidden');

  html2canvas(editor, {
    allowTaint: true,
    useCORS: true,
    scale: 2
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'imagen_reset.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    tools.forEach(tool => tool.style.visibility = 'visible');
  }).catch(err => {
    console.error("Error al generar imagen:", err);
  });
}

// Paleta de color
function toggleColorPicker() {
  const popup = document.getElementById("colorPalettePopup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function hideColorPicker() {
  document.getElementById("colorPalettePopup").style.display = "none";
}

// Ocultar picker si haces clic fuera
document.addEventListener("click", function (e) {
  const popup = document.getElementById("colorPalettePopup");
  const emoji = document.querySelector(".color-emoji");
  if (!popup.contains(e.target) && !emoji.contains(e.target)) {
    popup.style.display = "none";
  }
});


