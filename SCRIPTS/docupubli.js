let docContentPublicidad = '';
let chatPublicidad = [];

document.getElementById("fileInputPublicidad").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  const status = document.getElementById("loadingPhrasePublicidad");
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
      docContentPublicidad = text.trim();
      status.textContent = "✅ Documento cargado correctamente.";
    };
    reader.readAsArrayBuffer(file);
  } else {
    reader.onload = () => {
      docContentPublicidad = reader.result.trim();
      status.textContent = "✅ Documento cargado correctamente.";
    };
    reader.readAsText(file);
  }
});

function askAIWithPublicidad() {
  const input = document.getElementById("userInputPublicidad").value.trim();
  if (!input || !docContentPublicidad) return;

  chatPublicidad.push({ role: "user", content: input });
  renderChatPublicidad();
  document.getElementById("userInputPublicidad").value = "";
  document.getElementById("loadingContainerPublicidad").style.display = "block";
  startLoadingBarPublicidad();

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
          content: "Eres DANI, un estratega publicitario IA que analiza campañas, optimiza anuncios y brinda insights creativos para mejorar el rendimiento de marketing. Aquí está el contenido del documento:\n\n" + docContentPublicidad
        },
        ...chatPublicidad
      ],
      temperature: 0.7
    })
  })
    .then(res => res.json())
    .then(data => {
      resetLoadingBarPublicidad();
      document.getElementById("loadingContainerPublicidad").style.display = "none";
      const respuesta = data.choices?.[0]?.message?.content || "No hubo respuesta.";
      chatPublicidad.push({ role: "assistant", content: respuesta });
      renderChatPublicidad();
    })
    .catch(() => {
      resetLoadingBarPublicidad();
      document.getElementById("loadingContainerPublicidad").style.display = "none";
      chatPublicidad.push({ role: "assistant", content: "⚠️ Error al conectar con la IA." });
      renderChatPublicidad();
    });
}

function renderChatPublicidad() {
  const chatBox = document.getElementById("chatMessagesPublicidad");
  chatBox.innerHTML = "";

  chatPublicidad.forEach(entry => {
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
      avatar.src = "IMAGENES/Dani - Ventas.png";
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

function clearChatPublicidad() {
  chatPublicidad = [];
  document.getElementById("chatMessagesPublicidad").innerHTML = "";
}

let historialPublicidad = JSON.parse(localStorage.getItem("consultasPublicidad") || "[]");

function nuevaConsultaPublicidad() {
  if (chatPublicidad.length > 0) {
    const primerMensaje = chatPublicidad.find(c => c.role === 'user')?.content || 'Consulta';
    let vistaPrevia = primerMensaje.trim().split(" ").slice(0, 8).join(" ");
    if (primerMensaje.length > 60) vistaPrevia += "...";

    const fechaHoy = new Date().toLocaleDateString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    historialPublicidad.push({
      nombre: vistaPrevia,
      fecha: fechaHoy,
      data: chatPublicidad
    });

    localStorage.setItem("consultasPublicidad", JSON.stringify(historialPublicidad));
  }

  chatPublicidad = [];
  document.getElementById("chatMessagesPublicidad").innerHTML = "";
  renderSidebarPublicidad();
}

function renderSidebarPublicidad() {
  const lista = document.getElementById("historialListaPublicidad");
  lista.innerHTML = "";

  const agrupadoPorFecha = {};
  historialPublicidad.forEach((consulta, index) => {
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
        chatPublicidad = data;
        renderChatPublicidad();
      };

      input.onchange = () => {
        historialPublicidad[index].nombre = input.value.trim() || "Consulta";
        localStorage.setItem("consultasPublicidad", JSON.stringify(historialPublicidad));
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        historialPublicidad.splice(index, 1);
        localStorage.setItem("consultasPublicidad", JSON.stringify(historialPublicidad));
        renderSidebarPublicidad();
      };

      li.appendChild(input);
      li.appendChild(deleteBtn);
      lista.appendChild(li);
    });
  });
}

function clearChatHistoryPublicidad() {
  chatPublicidad = [];
  historialPublicidad = [];
  localStorage.removeItem("consultasPublicidad");
  renderChatPublicidad();
  renderSidebarPublicidad();
}

function startLoadingBarPublicidad() {
  const bar = document.getElementById("loadingBarPublicidad");
  const phrase = document.getElementById("loadingPhrasePublicidad");

  const frases = [
    "🎯 Analizando mensaje publicitario...",
    "📊 Optimizando pauta para plataformas...",
    "🧠 Identificando sesgos cognitivos...",
    "📣 Potenciando narrativa de campaña...",
    "🚀 Maximizando ROI en medios digitales..."
  ];

  let progress = 0;
  let fraseIndex = 0;

  clearInterval(window.loadingIntervalPublicidad);

  window.loadingIntervalPublicidad = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 4;
    if (progress > 100) progress = 100;

    bar.style.width = progress + "%";
    bar.textContent = progress + "%";

    if (progress >= (fraseIndex + 1) * 20 && fraseIndex < frases.length) {
      phrase.textContent = frases[fraseIndex];
      fraseIndex++;
    }

    if (progress >= 100) {
      clearInterval(window.loadingIntervalPublicidad);
    }
  }, 300);
}

function resetLoadingBarPublicidad() {
  clearInterval(window.loadingIntervalPublicidad);
  const bar = document.getElementById("loadingBarPublicidad");
  const phrase = document.getElementById("loadingPhrasePublicidad");
  bar.style.width = "0%";
  bar.textContent = "0%";
  phrase.textContent = "Inicializando...";
}

window.onload = () => {
  renderSidebarPublicidad();
  renderChatPublicidad();
};
