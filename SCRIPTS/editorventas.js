function toggleEditorAdVentas() {
  const container = document.getElementById("editorContainerAdVentas");
  const editor = document.getElementById("editorAdVentas");
  const isVisible = container.style.display === "flex" || container.style.display === "block";
  container.style.display = isVisible ? "none" : "flex";
  editor.style.display = isVisible ? "none" : "block";
}

function handleFormatChangeAdVentas() {
  const format = document.getElementById("formatSelectAdVentas").value;
  prepareCanvasAdVentas(format);
}

function prepareCanvasAdVentas(format) {
  const [w, h] = format.split("x");
  const editor = document.getElementById("editorAdVentas");
  editor.style.width = w + "px";
  editor.style.height = h + "px";
  document.getElementById("canvasSizeAdVentas").innerText = `Formato: ${w}x${h}`;
}

function clearEditorAdVentas() {
  const editor = document.getElementById("editorAdVentas");
  editor.innerHTML = "";
  editor.style.backgroundImage = "";
}

function addTextAdVentas() {
  const text = document.getElementById("customTextAdVentas").value;
  const color = document.getElementById("textColorAdVentas").value;
  const font = document.getElementById("fontFamilyAdVentas").value;
  const size = document.getElementById("fontSizeAdVentas").value;

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

  document.getElementById("editorAdVentas").appendChild(div);
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
  const editor = document.getElementById("editorAdVentas");
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

document.getElementById("uploadImageAdVentas").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const editor = document.getElementById("editorAdVentas");
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

document.getElementById("uploadBackgroundAdVentas").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    document.getElementById("editorAdVentas").style.backgroundImage = `url('${event.target.result}')`;
  };
  reader.readAsDataURL(file);
});

function applyFilterAdVentas(filterValue) {
  document.getElementById("editorAdVentas").style.filter = filterValue;
}

function downloadImageAdVentas() {
  const editor = document.getElementById("editorAdVentas");
  const tools = document.querySelectorAll('.element-tools');
  const draggables = document.querySelectorAll('.draggable');
  tools.forEach(t => t.style.display = 'none');
  draggables.forEach(el => el.style.border = 'none');

  html2canvas(editor).then(canvas => {
    const format = document.getElementById("formatSelectAdVentas").value;
    const link = document.createElement("a");
    link.download = `diseño_reset_${format}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    tools.forEach(t => t.style.display = 'flex');
    draggables.forEach(el => el.style.border = '1px dashed #ccc');
  });
}

prepareCanvasAdVentas('800x600');
