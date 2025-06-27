let docContentContabilidad = '';
let chatContabilidad = [];

document.getElementById("fileInputContabilidad").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  const status = document.getElementById("loadingPhraseContabilidad");
  status.textContent = "⏳ Cargando documento...";

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
      docContentContabilidad = text.trim();
      status.textContent = "✅ Documento cargado correctamente.";
    };
    reader.readAsArrayBuffer(file);
  } else {
    reader.onload = () => {
      docContentContabilidad = reader.result.trim();
      status.textContent = "✅ Documento cargado correctamente.";
    };
    reader.readAsText(file);
  }
});

function askAIWithContabilidad() {
  const input = document.getElementById("userInputContabilidad").value.trim();
  if (!input || !docContentContabilidad) return;

  chatContabilidad.push({ role: "user", content: input });
  renderChatContabilidad();
  document.getElementById("userInputContabilidad").value = "";
  document.getElementById("loadingContainerContabilidad").style.display = "block";
  startLoadingBarContabilidad();

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres JOSE, un IA contador y asesor financiero experto en interpretación de documentos contables. Aquí está el contenido del documento:\n\n" + docContentContabilidad
        },
        ...chatContabilidad
      ],
      temperature: 0.7
    })
  })
    .then(res => res.json())
    .then(data => {
      resetLoadingBarContabilidad();
      document.getElementById("loadingContainerContabilidad").style.display = "none";
      const respuesta = data.choices?.[0]?.message?.content || "No hubo respuesta.";
      chatContabilidad.push({ role: "assistant", content: respuesta });
      renderChatContabilidad();
    })
    .catch(() => {
      resetLoadingBarContabilidad();
      document.getElementById("loadingContainerContabilidad").style.display = "none";
      chatContabilidad.push({ role: "assistant", content: "⚠️ Error al conectar con la IA." });
      renderChatContabilidad();
    });
}

function renderChatContabilidad() {
  const chatBox = document.getElementById("chatMessagesContabilidad");
  chatBox.innerHTML = "";

  chatContabilidad.forEach(entry => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.gap = "10px";

    const message = document.createElement("div");
    message.style.borderRadius = "10px";
    message.style.padding = "10px 15px";
    message.style.maxWidth = "80%";
    message.style.whiteSpace = "pre-line";
    message.style.textAlign = "justify";

    if (entry.role === 'user') {
      message.style.background = "#e0e0e0";
      message.style.color = "black";
      message.textContent = entry.content;
      message.style.marginBottom = "12px";
      wrapper.appendChild(message);
    } else {
      const avatar = document.createElement("img");
      avatar.src = "IMAGENES/Jose-Conta.png";
      avatar.style.width = "28px";
      avatar.style.height = "28px";
      avatar.style.borderRadius = "50%";

      message.style.background = "#e0e0e0";
      message.style.color = "black";
      message.style.lineHeight = "1.7";
      message.style.marginBottom = "10px";
      message.style.padding = "14px 16px";
      message.style.fontSize = "15px";
      message.innerHTML = entry.content.replace(/\n/g, "<br>");

      wrapper.appendChild(avatar);
      wrapper.appendChild(message);
    }

    chatBox.appendChild(wrapper);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChatContabilidad() {
  chatContabilidad = [];
  document.getElementById("chatMessagesContabilidad").innerHTML = "";
}

let historialContabilidad = JSON.parse(localStorage.getItem("consultasContabilidad") || "[]");

function nuevaConsultaContabilidad() {
  if (chatContabilidad.length > 0) {
    const primerMensaje = chatContabilidad.find(c => c.role === 'user')?.content || 'Consulta';
    let vistaPrevia = primerMensaje.trim().split(" ").slice(0, 8).join(" ");
    if (primerMensaje.length > 60) vistaPrevia += "...";

    const fechaHoy = new Date().toLocaleDateString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    historialContabilidad.push({
      nombre: vistaPrevia,
      fecha: fechaHoy,
      data: chatContabilidad
    });

    localStorage.setItem("consultasContabilidad", JSON.stringify(historialContabilidad));
  }

  chatContabilidad = [];
  document.getElementById("chatMessagesContabilidad").innerHTML = "";
  renderSidebarContabilidad();
}

function renderSidebarContabilidad() {
  const lista = document.getElementById("historialListaContabilidad");
  lista.innerHTML = "";

  const agrupadoPorFecha = {};
  historialContabilidad.forEach((consulta, index) => {
    const fecha = consulta.fecha;
    if (!agrupadoPorFecha[fecha]) agrupadoPorFecha[fecha] = [];
    agrupadoPorFecha[fecha].push({ ...consulta, index });
  });

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

      const input = document.createElement("input");
      input.value = nombre;
      input.style.border = "none";
      input.style.background = "transparent";
      input.style.flexGrow = "1";
      input.style.cursor = "pointer";
      input.title = "Haz clic para cargar o editar";

      input.onclick = () => {
        chatContabilidad = data;
        renderChatContabilidad();
      };

      input.onchange = () => {
        historialContabilidad[index].nombre = input.value.trim() || "Consulta";
        localStorage.setItem("consultasContabilidad", JSON.stringify(historialContabilidad));
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        historialContabilidad.splice(index, 1);
        localStorage.setItem("consultasContabilidad", JSON.stringify(historialContabilidad));
        renderSidebarContabilidad();
      };

      li.appendChild(input);
      li.appendChild(deleteBtn);
      lista.appendChild(li);
    });
  });
}

function clearChatHistoryContabilidad() {
  chatContabilidad = [];
  historialContabilidad = [];
  localStorage.removeItem("consultasContabilidad");
  renderChatContabilidad();
  renderSidebarContabilidad();
}

function startLoadingBarContabilidad() {
  const bar = document.getElementById("loadingBarContabilidad");
  const phrase = document.getElementById("loadingPhraseContabilidad");

  const frases = [
    "📊 Leyendo balances contables...",
    "🧮 Procesando cifras y flujos...",
    "📘 Identificando errores comunes...",
    "🧠 Analizando insights financieros...",
    "💼 Preparando informe fiscal..."
  ];

  let progress = 0;
  let fraseIndex = 0;

  clearInterval(window.loadingIntervalContabilidad);

  window.loadingIntervalContabilidad = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 4;
    if (progress > 100) progress = 100;

    bar.style.width = progress + "%";
    bar.textContent = progress + "%";

    if (progress >= (fraseIndex + 1) * 20 && fraseIndex < frases.length) {
      phrase.textContent = frases[fraseIndex];
      fraseIndex++;
    }

    if (progress >= 100) {
      clearInterval(window.loadingIntervalContabilidad);
    }
  }, 300);
}

function resetLoadingBarContabilidad() {
  clearInterval(window.loadingIntervalContabilidad);
  const bar = document.getElementById("loadingBarContabilidad");
  const phrase = document.getElementById("loadingPhraseContabilidad");
  bar.style.width = "0%";
  bar.textContent = "0%";
  phrase.textContent = "Inicializando...";
}

window.onload = () => {
  renderSidebarContabilidad();
  renderChatContabilidad();
};
