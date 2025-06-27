let docContent = '';
let consultaActualDocs = [];
let historialDocs = JSON.parse(localStorage.getItem("consultasDocs") || "[]");

window.onload = () => {
  renderDocChat();
  renderDocSidebar();
};

document.getElementById("fileInputDocs").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  const mensajeAviso = document.createElement("div");
  mensajeAviso.id = "mensajeArchivoListo";
  mensajeAviso.textContent = "✅ Documento listo, ahora puedes hacer tu pregunta.";
  mensajeAviso.style.marginTop = "10px";
  mensajeAviso.style.fontSize = "14px";
  mensajeAviso.style.color = "#2a6ec9";
  mensajeAviso.style.textAlign = "center";
  mensajeAviso.style.fontWeight = "600";

  // Elimina aviso anterior si existe
  const contenedorChat = document.querySelector(".chat-section");
  const avisoExistente = document.getElementById("mensajeArchivoListo");
  if (avisoExistente) avisoExistente.remove();

  if (file.type === "application/pdf") {
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let text = "";
      for (let i = 1; i <= Math.min(40, pdf.numPages); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + " ";
      }
      docContent = text;
      contenedorChat.appendChild(mensajeAviso);
    };
    reader.readAsArrayBuffer(file);
  } else {
    reader.onload = () => {
      docContent = reader.result;
      contenedorChat.appendChild(mensajeAviso);
    };
    reader.readAsText(file);
  }
});


function askAIWithDoc() {
  const input = document.getElementById("userInputDocs").value.trim();
  if (!input || !docContent) return;

  consultaActualDocs.push({ role: "user", content: input });
  renderDocChat();
  document.getElementById("userInputDocs").value = "";
  document.getElementById("loadingContainerDocs").style.display = "block";
  startLoadingBarDocs();  // <-- Agregado aquí
  

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres KAI®, una IA especializada en análisis documental. Aquí está el contenido del archivo:\n\n" + docContent },
        ...consultaActualDocs
      ],
      temperature: 0.7
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("loadingContainerDocs").style.display = "none";
    const respuesta = data.choices?.[0]?.message?.content || "KAI® no respondió.";
    consultaActualDocs.push({ role: "assistant", content: respuesta });
    renderDocChat();
  })
  .catch(() => {
    document.getElementById("loadingContainerDocs").style.display = "none";
    consultaActualDocs.push({ role: "assistant", content: "⚠️ Error de conexión o clave API inválida." });
    renderDocChat();
  });
}

function renderDocChat() {
  const chatBox = document.getElementById("chatMessagesDocs");
  chatBox.innerHTML = "";

  consultaActualDocs.forEach(entry => {
    const wrapper = document.createElement("div");
    const bubble = document.createElement("div");

    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.alignItems = "flex-start";
    wrapper.style.marginBottom = "12px";

    if (entry.role === 'assistant') {
      const avatar = document.createElement("img");
      avatar.src = avatarKai;
      avatar.alt = "KAI avatar";
      avatar.style.width = "30px";
      avatar.style.height = "30px";
      avatar.style.borderRadius = "50%";
      avatar.style.marginRight = "10px";
      avatar.style.flexShrink = "0";

      wrapper.appendChild(avatar);
    }

    bubble.textContent = entry.content;
    bubble.style.maxWidth = "85%";
    bubble.style.padding = "12px 16px";
    bubble.style.borderRadius = "14px";
    bubble.style.lineHeight = "1.6";
    bubble.style.fontSize = "15px";
    bubble.style.whiteSpace = "pre-line";
    bubble.style.textAlign = "justify";
    bubble.style.backgroundColor = "#e0e0e0";
    bubble.style.color = "#000";

    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function nuevaConsultaDocs() {
  if (consultaActualDocs.length > 0) {
    const primerMensaje = consultaActualDocs.find(c => c.role === 'user')?.content || 'Consulta';
    let vistaPrevia = primerMensaje.trim().split(" ").slice(0, 8).join(" ");
    if (primerMensaje.length > 60) vistaPrevia += "...";

    const ahora = new Date();
    const fechaEcuador = ahora.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    historialDocs.push({
      nombre: vistaPrevia,
      fecha: fechaEcuador,
      data: consultaActualDocs
    });

    localStorage.setItem("consultasDocs", JSON.stringify(historialDocs));
  }

  consultaActualDocs = [];
  document.getElementById("chatMessagesDocs").innerHTML = "";
  renderDocSidebar();
}


function renderDocSidebar() {
  const lista = document.getElementById("historialListaDocs");
  lista.innerHTML = "";

  // Agrupado por fecha local
  const agrupadoPorFecha = {};
  historialDocs.forEach((consulta, i) => {
    const fecha = consulta.fecha || new Date().toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    if (!agrupadoPorFecha[fecha]) agrupadoPorFecha[fecha] = [];
    agrupadoPorFecha[fecha].push({ ...consulta, index: i });
  });

  // Ordenar fechas de forma descendente
  const fechasOrdenadas = Object.keys(agrupadoPorFecha).sort((a, b) => {
    const [dA, mA, yA] = a.split("/").map(Number);
    const [dB, mB, yB] = b.split("/").map(Number);
    return new Date(yB, mB - 1, dB) - new Date(yA, mA - 1, dA);
  });

  fechasOrdenadas.forEach(fecha => {
    const tituloFecha = document.createElement("h4");
    tituloFecha.textContent = fecha;
    lista.appendChild(tituloFecha);

    agrupadoPorFecha[fecha].forEach(({ nombre, data, index }) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.marginBottom = "6px";

      const inputTitulo = document.createElement("input");
      inputTitulo.value = nombre;
      inputTitulo.title = "Haz clic para editar";
      inputTitulo.style.border = "none";
      inputTitulo.style.background = "transparent";
      inputTitulo.style.flexGrow = "1";
      inputTitulo.style.cursor = "pointer";

      inputTitulo.onclick = () => {
        consultaActualDocs = data;
        renderDocChat();
      };

      inputTitulo.onchange = () => {
        historialDocs[index].nombre = inputTitulo.value.trim() || "Consulta";
        localStorage.setItem("consultasDocs", JSON.stringify(historialDocs));
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        historialDocs.splice(index, 1);
        localStorage.setItem("consultasDocs", JSON.stringify(historialDocs));
        renderDocSidebar();
      };

      li.appendChild(inputTitulo);
      li.appendChild(deleteBtn);
      lista.appendChild(li);
    });
  });
}

function clearChatHistoryDocs() {
  consultaActualDocs = [];
  historialDocs = [];
  localStorage.removeItem("consultasDocs");
  renderDocChat();
  renderDocSidebar();
}

function cerrarDocumentSectionVentas() {
  const docSection = document.getElementById("documentSectionVentas");
  const videoKai = document.getElementById("videoCarouselVentas");

  if (docSection) docSection.style.display = "none";
  if (videoKai) {
    videoKai.style.display = "block";
    const videoTag = videoKai.querySelector("video");
    if (videoTag) videoTag.play(); // opcional: iniciar video
  }
}

