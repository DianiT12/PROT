const avatarKai = "IMAGENES/Kai.jpeg";
let consultaActual = [];
let historialConsultas = JSON.parse(localStorage.getItem("consultasVentas") || "[]");

window.onload = () => {
  renderChatHistory();
  renderSidebarHistory();
};

function nuevaConsultaVentas() {
  if (consultaActual.length > 0) {
    const primerMensaje = consultaActual.find(c => c.role === 'user')?.content || 'Consulta';
    const vistaPrevia = primerMensaje.trim().split(" ").slice(0, 4).join(" ");

    const ahora = new Date();
    const fechaEcuador = ahora.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    historialConsultas.push({
      nombre: vistaPrevia + (primerMensaje.length > 60 ? "..." : ""),
      fecha: fechaEcuador,
      data: consultaActual
    });

    localStorage.setItem("consultasVentas", JSON.stringify(historialConsultas));
  }

  consultaActual = [];
  document.getElementById("chatMessages").innerHTML = "";
  renderSidebarHistory();
}

function renderChatHistory() {
  const chatBox = document.getElementById("chatMessages");
  chatBox.innerHTML = "";
  consultaActual.forEach(entry => {
    const wrapper = document.createElement("div");
    wrapper.className = "message";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.gap = "10px";
    wrapper.innerHTML = entry.role === 'user'
    wrapper.innerHTML = entry.role === 'user'
    ? `<div style='background:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;'>${entry.content}</div>`
    : `<img src='${avatarKai}' style='width:28px;height:28px;border-radius:50%;'><div style='background:#e0e0e0; color:black; border-radius:10px; padding:10px 15px; text-align:justify; line-height:1.6; white-space:pre-line;'>${entry.content}</div>`;  
    chatBox.appendChild(wrapper);
  });
  scrollChatToBottom();
}


let indexFrase = 0;
const labelFrase = document.getElementById("fraseCargaVentas");
const intervaloFrase = setInterval(() => {
  indexFrase = (indexFrase + 1) % frasesAlternativas.length;
  labelFrase.textContent = frasesAlternativas[indexFrase];
}, 3000);

function renderSidebarHistory() {
  const lista = document.getElementById("historialListaVentas");
  lista.innerHTML = "";

  // Agrupar por fecha (ej. "23/04/2025")
  const agrupadoPorFecha = {};
  historialConsultas.forEach((consulta, i) => {
    const fecha = consulta.fecha || new Date().toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    if (!agrupadoPorFecha[fecha]) agrupadoPorFecha[fecha] = [];
    agrupadoPorFecha[fecha].push({ ...consulta, index: i });
  });

  const fechasOrdenadas = Object.keys(agrupadoPorFecha).sort((a, b) => {
    const [diaA, mesA, anioA] = a.split("/").map(Number);
    const [diaB, mesB, anioB] = b.split("/").map(Number);
    return new Date(anioB, mesB - 1, diaB) - new Date(anioA, mesA - 1, diaA);
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
      inputTitulo.style.border = "none";
      inputTitulo.style.background = "transparent";
      inputTitulo.style.flexGrow = "1";
      inputTitulo.style.cursor = "pointer";
      inputTitulo.title = "Haz clic para editar";
      inputTitulo.onchange = () => {
        historialConsultas[index].nombre = inputTitulo.value.trim() || "Consulta";
        localStorage.setItem("consultasVentas", JSON.stringify(historialConsultas));
      };

      inputTitulo.onclick = () => {
        consultaActual = data;
        renderChatHistory();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        historialConsultas.splice(index, 1);
        localStorage.setItem("consultasVentas", JSON.stringify(historialConsultas));
        renderSidebarHistory();
      };

      li.appendChild(inputTitulo);
      li.appendChild(deleteBtn);
      lista.appendChild(li);
    });
  });
}
function askChatGPTVentas() {
  const input = document.getElementById("userInputVentas").value.trim();
  if (!input) return;

  consultaActual.push({ role: "user", content: input });
  renderChatHistory();
  document.getElementById("userInputVentas").value = "";

  mostrarBarraCargaKai(); // Aquí activamos la barra de carga

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres KAI®, un asesor IA experto en investigación académica, diseño curricular y acompañamiento universitario." },
        ...consultaActual
      ],
      temperature: 0.7
    })
  })
  .then(res => res.json())
  .then(data => {
    detenerBarraCargaKai(); // detenemos al llegar respuesta
    if (data.error) throw new Error(data.error.message);

    const respuesta = data.choices?.[0]?.message?.content || "No se recibió respuesta.";
    consultaActual.push({ role: "assistant", content: respuesta });
    renderChatHistory();
  })
  .catch(error => {
    detenerBarraCargaKai(); // también detenemos si hay error
    consultaActual.push({ role: "assistant", content: `KAI®: ${error.message}` });
    renderChatHistory();
  });
}

let barraKaiInterval = null;
let frasesKaiInterval = null;

function mostrarBarraCargaKai() {
  const container = document.getElementById("loadingContainerVentas");
  const barra = document.getElementById("barraProgresoKai");
  const frase = document.getElementById("fraseCargaVentas");

  const frases = [
  "🧠 Procesando con enfoque académico...",
  "📖 Analizando fuentes bibliográficas...",
  "📊 Interpretando datos y resultados...",
  "💡 Generando hipótesis relevantes...",
  "📝 Integrando variables en un marco teórico..."
];


  let progreso = 0;
  let fraseIndex = 0;

  container.style.display = "block";
  barra.style.width = "0%";
  barra.textContent = "0%";
  frase.textContent = frases[0];

  barraKaiInterval = setInterval(() => {
    progreso += Math.floor(Math.random() * 8) + 3;
    if (progreso >= 100) {
      progreso = 100;
      clearInterval(barraKaiInterval);
    }
    barra.style.width = progreso + "%";
    barra.textContent = progreso + "%";
  }, 700);

  frasesKaiInterval = setInterval(() => {
    fraseIndex = (fraseIndex + 1) % frases.length;
    frase.textContent = frases[fraseIndex];
  }, 2500);
}

function detenerBarraCargaKai() {
  clearInterval(barraKaiInterval);
  clearInterval(frasesKaiInterval);
  document.getElementById("loadingContainerVentas").style.display = "none";
}


function scrollChatToBottom() {
  const chatBox = document.getElementById("chatMessages");
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChatHistoryVentas() {
  consultaActual = [];
  historialConsultas = [];
  localStorage.removeItem("consultasVentas");
  renderChatHistory();
  renderSidebarHistory();
}

function closeChatVentas() {
  document.getElementById("chatSectionVentas").style.display = "none";
  document.getElementById('videoCarouselVentas').style.display = 'block';
}

function abrirVistaPreviaKai() {
  // Mostrar vista previa, ocultar vista completa
  document.getElementById("chatPreviewVentas").style.display = "block";
  document.getElementById("chatSectionVentas").style.display = "none";

  // Ocultar el video correctamente
  const videoKai = document.getElementById("videoCarouselVentas");
  if (videoKai) {
    videoKai.style.display = "none";
  }
}

function startFullChatVentas() {
  const input = document.getElementById("userInputPreviewVentas").value.trim();
  if (input !== "") {
    document.getElementById("userInputVentas").value = input;

    // Ocultar preview y mostrar chat completo
    document.getElementById("chatPreviewVentas").style.display = "none";
    document.getElementById("chatSectionVentas").style.display = "block";

    askChatGPTVentas(); // Lógica del envío automático
  }
}

function closeChatVentas() {
  // Ocultar ambos chats
  document.getElementById("chatPreviewVentas").style.display = "none";
  document.getElementById("chatSectionVentas").style.display = "none";

  // Volver a mostrar el video
  const videoKai = document.getElementById("videoCarouselVentas");
  if (videoKai) {
    videoKai.style.display = "block";
  }
}