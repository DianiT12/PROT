let docContentComunicacion = '';
let chatComunicacion = [];

document.getElementById("fileInputComunicacion").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
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
      docContentComunicacion = text;
    };
    reader.readAsArrayBuffer(file);
  } else {
    reader.onload = () => {
      docContentComunicacion = reader.result;
    };
    reader.readAsText(file);
  }
});

function askAIWithComunicacion() {
    const input = document.getElementById("userInputComunicacion").value.trim();
    if (!input || !docContentComunicacion) return;
  
    chatComunicacion.push({ role: "user", content: input });
    renderChatComunicacion();
    document.getElementById("userInputComunicacion").value = "";
    document.getElementById("loadingContainerComunicacion").style.display = "block";
    startLoadingBarComunicacion();
  
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Eres JUAN, una IA especializada en temas legales estratégica y análisis de documentos legales. Aquí está el contenido del documento:\n\n" + docContentComunicacion },
          ...chatComunicacion
        ],
        temperature: 0.7
      })
    })
    .then(res => res.json())
    .then(data => {
      resetLoadingBarComunicacion();
      document.getElementById("loadingContainerComunicacion").style.display = "none";
      const respuesta = data.choices?.[0]?.message?.content || "No hubo respuesta.";
      chatComunicacion.push({ role: "assistant", content: respuesta });
      renderChatComunicacion();
    })
    .catch(() => {
      resetLoadingBarComunicacion();
      document.getElementById("loadingContainerComunicacion").style.display = "none";
      chatComunicacion.push({ role: "assistant", content: "⚠️ Error al conectar con la IA." });
      renderChatComunicacion();
    });
  }
  

function renderChatComunicacion() {
    const chatBox = document.getElementById("chatMessagesComunicacion");
    chatBox.innerHTML = "";
  
    chatComunicacion.forEach(entry => {
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
        message.style.marginBottom = "12px"; // ← Agregado este margen inferior
        wrapper.appendChild(message);
      }
      
     else {
        const avatar = document.createElement("img");
        avatar.src = "IMAGENES/JuanLegal.png";
        avatar.style.width = "28px";
        avatar.style.height = "28px";
        avatar.style.borderRadius = "50%";
      
        message.style.background = "#e0e0e0";
        message.style.color = "black";
        message.style.lineHeight = "1.7"; // Espaciado entre líneas
        message.style.marginBottom = "10px"; // Separación del mensaje
        message.style.padding = "14px 16px"; // Espacio interno
        message.style.fontSize = "15px"; // Tamaño de fuente legible
        message.innerHTML = entry.content.replace(/\n/g, "<br>"); // Doble salto visual
      
        wrapper.appendChild(avatar);
        wrapper.appendChild(message);
      }
      
  
      chatBox.appendChild(wrapper);
    });
  
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  

function clearChatComunicacion() {
  chatComunicacion = [];
  document.getElementById("chatMessagesComunicacion").innerHTML = "";
}

let historialComunicacion = JSON.parse(localStorage.getItem("consultasComunicacion") || "[]");

function nuevaConsultaComunicacion() {
  if (chatComunicacion.length > 0) {
    const primerMensaje = chatComunicacion.find(c => c.role === 'user')?.content || 'Consulta';
    let vistaPrevia = primerMensaje.trim().split(" ").slice(0, 8).join(" ");
    if (primerMensaje.length > 60) vistaPrevia += "...";

    const fechaHoy = new Date().toLocaleDateString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    historialComunicacion.push({
      nombre: vistaPrevia,
      fecha: fechaHoy,
      data: chatComunicacion
    });

    localStorage.setItem("consultasComunicacion", JSON.stringify(historialComunicacion));
  }

  chatComunicacion = [];
  document.getElementById("chatMessagesComunicacion").innerHTML = "";
  renderSidebarComunicacion();
}

function renderSidebarComunicacion() {
  const lista = document.getElementById("historialListaComunicacion");
  lista.innerHTML = "";

  const agrupadoPorFecha = {};
  historialComunicacion.forEach((consulta, index) => {
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
        chatComunicacion = data;
        renderChatComunicacion();
      };

      input.onchange = () => {
        historialComunicacion[index].nombre = input.value.trim() || "Consulta";
        localStorage.setItem("consultasComunicacion", JSON.stringify(historialComunicacion));
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        historialComunicacion.splice(index, 1);
        localStorage.setItem("consultasComunicacion", JSON.stringify(historialComunicacion));
        renderSidebarComunicacion();
      };

      li.appendChild(input);
      li.appendChild(deleteBtn);
      lista.appendChild(li);
    });
  });
}

function clearChatHistoryComunicacion() {
  chatComunicacion = [];
  historialComunicacion = [];
  localStorage.removeItem("consultasComunicacion");
  renderChatComunicacion();
  renderSidebarComunicacion();
}

window.onload = () => {
  renderSidebarComunicacion();
  renderChatComunicacion();
};


document.getElementById("fileInputComunicacion").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    const status = document.getElementById("estadoCargaDoc");
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
        docContentComunicacion = text.trim();
        status.textContent = "✅ Documento cargado correctamente.";
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = () => {
        docContentComunicacion = reader.result.trim();
        status.textContent = "✅ Documento cargado correctamente.";
      };
      reader.readAsText(file);
    }
  });
  
  let loadingIntervalComunicacion = null;
function startLoadingBarComunicacion() {
  const bar = document.getElementById("loadingBarComunicacion");
  const phrase = document.getElementById("loadingPhraseComunicacion");

  const frases = [
    "📘 Leyendo el documento como estratega...",
    "🧠 Descifrando patrones de comunicación...",
    "🧩 Encontrando insights clave de marketing...",
    "📊 Analizando argumentos y estructura lógica...",
    "💡 Sintetizando hallazgos relevantes para ti..."
  ];

  let progress = 0;
  let fraseIndex = 0;

  clearInterval(loadingIntervalComunicacion); // Evitar múltiples intervalos

  loadingIntervalComunicacion = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 4; // Aumento entre 4% y 8%
    if (progress > 100) progress = 100;

    bar.style.width = progress + "%";
    bar.textContent = progress + "%";

    if (progress >= (fraseIndex + 1) * 20 && fraseIndex < frases.length) {
      phrase.textContent = frases[fraseIndex];
      fraseIndex++;
    }

    if (progress >= 100) {
      clearInterval(loadingIntervalComunicacion);
    }
  }, 300);
}

function resetLoadingBarComunicacion() {
  clearInterval(loadingIntervalComunicacion);
  const bar = document.getElementById("loadingBarComunicacion");
  const phrase = document.getElementById("loadingPhraseComunicacion");
  bar.style.width = "0%";
  bar.textContent = "0%";
  phrase.textContent = "Inicializando...";
}
