function toggleEditor() {
  const container = document.getElementById("editorContainer");
  const editor = document.getElementById("editor");
  
  // Verificar si el contenedor del editor está visible
  const isVisible = container.style.display === "flex" || container.style.display === "block";

  if (isVisible) {
    // Ocultar el contenedor del editor
    container.style.display = "none";
    // Mostrar el editor
    editor.style.display = "none";
  } else {
    // Mostrar el contenedor del editor
    container.style.display = "flex";
    // Ocultar el editor
    editor.style.display = "block";
  }
}

function handleFormatChange() {
  const format = document.getElementById("formatSelect").value;
  prepareCanvas(format);
}

function prepareCanvas(format) {
  const [w, h] = format.split("x");
  const editor = document.getElementById("editor");
  editor.style.width = w + "px";
  editor.style.height = h + "px";
  document.getElementById("canvasSize").innerText = `Formato: ${w}x${h}`;
}

function clearEditor() {
  const editor = document.getElementById("editor");
  editor.innerHTML = "";
  editor.style.backgroundImage = "";
}

function cerrarEditor() {
  const container = document.getElementById("editorContainer");
  const editor = document.getElementById("editor");

  // Ocultar el contenedor del editor
  container.style.display = "none";
  // Mostrar el editor
  editor.style.display = "none";
}

function addText() {
  const text = document.getElementById("customText").value;
  const color = document.getElementById("textColor").value;
  const font = document.getElementById("fontFamily").value;
  const size = document.getElementById("fontSize").value;

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

  document.getElementById("editor").appendChild(div);
  enableInteract(div);
}

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
  const editor = document.getElementById("editor");
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

function centerSelectedElement() {
  const selected = document.querySelector('.draggable.selected');
  const editor = document.getElementById("editor");
  if (!selected) return;
  const centerX = (editor.clientWidth - selected.offsetWidth) / 2;
  const centerY = (editor.clientHeight - selected.offsetHeight) / 2;
  selected.style.transform = `translate(${centerX}px, ${centerY}px) rotate(0deg)`;
  selected.setAttribute("data-x", centerX);
  selected.setAttribute("data-y", centerY);
}

function addEmoji(emoji) {
  if (!emoji) return;
  const div = document.createElement("div");
  div.className = "text-box draggable";
  div.setAttribute("data-x", 0);
  div.setAttribute("data-y", 0);
  div.style.fontSize = "48px";
  div.style.transform = "translate(0px, 0px) rotate(0deg)";
  div.textContent = emoji;

  const tools = document.createElement("div");
  tools.className = "element-tools";
  tools.innerHTML = `
    <button onclick="rotateElement(this)">↻</button>
    <button onclick="duplicateElement(this)">⧉</button>
    <button onclick="deleteElement(this)">🗑️</button>`;
  div.appendChild(tools);

  document.getElementById("editor").appendChild(div);
  enableInteract(div);
}

function applyFilter(filterValue) {
  document.getElementById("editor").style.filter = filterValue;
}

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

document.addEventListener("keydown", function (e) {
  const selected = document.querySelector('.draggable.selected');
  if (!selected) return;

  if (e.key === "Delete") {
    selected.remove();
  }

  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    const btn = selected.querySelector(".element-tools button:nth-child(2)");
    if (btn) duplicateElement(btn);
  }

  if (e.key === "Escape") {
    selected.classList.remove("selected");
  }
});

document.getElementById("uploadImage").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const editor = document.getElementById("editor");
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

document.getElementById("uploadBackground").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    document.getElementById("editor").style.backgroundImage = `url('${event.target.result}')`;
  };
  reader.readAsDataURL(file);
});

// 1. Modal de AI
function openAIHelper() {
  document.getElementById("aiModal").style.display = "block";
}

function closeAIHelper() {
  document.getElementById("aiModal").style.display = "none";
}

// 2. Simulación de generación IA
function generateAIText() {
  const prompt = document.getElementById("aiPrompt").value.toLowerCase();
  let result = "Texto generado por Lia®...";

  if (prompt.includes("motivacional")) {
    result = "El futuro pertenece a quienes creen en la belleza de sus sueños.";
  } else if (prompt.includes("venta") || prompt.includes("promo")) {
    result = "¡Últimos días para aprovechar hasta un 50% de descuento!";
  } else if (prompt.includes("bienvenida")) {
    result = "¡Bienvenido a una experiencia visual inolvidable!";
  }

  const div = document.createElement("div");
  div.className = "text-box draggable";
  div.setAttribute("data-x", 0);
  div.setAttribute("data-y", 0);
  div.style.fontSize = "24px";
  div.style.transform = "translate(0px, 0px) rotate(0deg)";
  div.textContent = result;

  const tools = document.createElement("div");
  tools.className = "element-tools";
  tools.innerHTML = `
    <button onclick="rotateElement(this)">↻</button>
    <button onclick="duplicateElement(this)">⧉</button>
    <button onclick="deleteElement(this)">🗑️</button>`;
  div.appendChild(tools);

  document.getElementById("editor").appendChild(div);
  enableInteract(div);
  closeAIHelper();
}

// 3. Cargar Plantillas
function loadTemplate(templateName) {
  clearEditor();

  if (templateName === "fraseMotivacional") {
    document.getElementById("customText").value = "Cree en ti. El primer paso es decidir que puedes.";
    addText();
  } else if (templateName === "ofertaPromo") {
    document.getElementById("customText").value = "🔥 ¡50% OFF solo hoy! 🔥";
    addText();
  } else if (templateName === "bienvenida") {
    document.getElementById("customText").value = "👋 ¡Bienvenido al equipo!";
    addText();
  }

  document.getElementById("templateSelect").value = ""; // Reiniciar
}

// 4. Atajos de teclado: eliminar, duplicar, centrar, escape
document.addEventListener("keydown", function (e) {
  const selected = document.querySelector('.draggable.selected');
  if (!selected) return;

  if (e.key === "Delete") {
    selected.remove();
  }

  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    const btn = selected.querySelector(".element-tools button:nth-child(2)");
    if (btn) duplicateElement(btn);
  }

  if (e.ctrlKey && e.key.toLowerCase() === "e") {
    e.preventDefault();
    centerSelectedElement();
  }

  if (e.key === "Escape") {
    selected.classList.remove("selected");
  }
});

function setTextAlign(align) {
  const selected = document.querySelector('.draggable.selected');
  if (selected) {
    selected.style.textAlign = align;
  }
}

function toggleBold() {
  const selected = document.querySelector('.draggable.selected');
  if (selected) {
    selected.style.fontWeight = selected.style.fontWeight === "bold" ? "normal" : "bold";
  }
}

function toggleItalic() {
  const selected = document.querySelector('.draggable.selected');
  if (selected) {
    selected.style.fontStyle = selected.style.fontStyle === "italic" ? "normal" : "italic";
  }
}

function toggleUnderline() {
  const selected = document.querySelector('.draggable.selected');
  if (selected) {
    selected.style.textDecoration = selected.style.textDecoration === "underline" ? "none" : "underline";
  }
}

function downloadImage() {
  const editor = document.getElementById("editor");
  const tools = document.querySelectorAll('.element-tools');
  const draggables = document.querySelectorAll('.draggable');
  tools.forEach(t => t.style.display = 'none');
  draggables.forEach(el => el.style.border = 'none');

  const watermark = document.createElement("div");
  watermark.innerText = "CREADO POR RESET®";
  watermark.style.position = "absolute";
  watermark.style.bottom = "10px";
  watermark.style.right = "10px";
  watermark.style.fontSize = "14px";
  watermark.style.fontWeight = "bold";
  watermark.style.fontFamily = "'Poppins', sans-serif";
  watermark.style.color = "#FF5E00";
  watermark.style.textShadow = "1px 1px 2px rgba(0,0,0,0.6)";
  editor.appendChild(watermark);

  html2canvas(editor).then(canvas => {
    const format = document.getElementById("formatSelect").value;
    const link = document.createElement("a");
    link.download = `diseño_reset_${format}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    editor.removeChild(watermark);
    tools.forEach(t => t.style.display = 'flex');
    draggables.forEach(el => el.style.border = '1px dashed #ccc');
  });
}

prepareCanvas('800x600');
