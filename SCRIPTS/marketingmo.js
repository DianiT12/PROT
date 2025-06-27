const avatarMia = "IMAGENES/MiaMarketing.png";
let consultaMarketing = [];
let historialMarketing = JSON.parse(localStorage.getItem("consultasMarketing") || "[]");

function nuevaConsultaMarketing() {
  if (consultaMarketing.length > 0) {
    const userMsg = consultaMarketing.find(c => c.role === 'user')?.content || 'Consulta';
    const preview = userMsg.trim().split(" ").slice(0, 4).join(" ");
    const fecha = new Date().toLocaleDateString('es-EC');

    historialMarketing.push({
      nombre: preview + (userMsg.length > 60 ? "..." : ""),
      fecha: fecha,
      data: consultaMarketing
    });

    localStorage.setItem("consultasMarketing", JSON.stringify(historialMarketing));
  }

  consultaMarketing = [];
  document.getElementById("chatMessagesMarketing").innerHTML = "";
  renderSidebarMarketing();
}

function renderChatMarketing() {
  const chatBox = document.getElementById("chatMessagesMarketing");
  chatBox.innerHTML = "";
  consultaMarketing.forEach(entry => {
    const wrapper = document.createElement("div");
    wrapper.className = "message";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.gap = "10px";

    const messageHTML = entry.role === 'user'
      ? `<div style="background-color:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;">${entry.content}</div>`
      : `<img src='${avatarMia}' style='width:28px;height:28px;border-radius:50%;'><div style="background-color:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;">${entry.content}</div>`;

    wrapper.innerHTML = messageHTML;
    chatBox.appendChild(wrapper);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}


function renderSidebarMarketing() {
  const lista = document.getElementById("historialListaMarketing");
  lista.innerHTML = "";

  historialMarketing.forEach(({ nombre, data }, index) => {
    const li = document.createElement("li");
    li.innerText = nombre;
    li.onclick = () => {
      consultaMarketing = data;
      renderChatMarketing();
    };
    lista.appendChild(li);
  });
}

// Frases y porcentaje animado durante carga
let phraseIntervalMarketing;
let percentIntervalMarketing;

const frasesMia = [
  "💡 Analizando tendencias...",
  "📊 Leyendo datos del mercado...",
  "🧠 Activando insights neuro...",
  "🧩 Cruzando patrones de comportamiento...",
  "📣 Preparando tu estrategia...",
  "🔍 Afinando detalles para tu respuesta..."
];

function iniciarFrasesMarketing() {
  const fraseElement = document.getElementById("loadingPhraseMarketing");
  let index = 0;
  fraseElement.textContent = frasesMia[0];
  phraseIntervalMarketing = setInterval(() => {
    fraseElement.textContent = frasesMia[index % frasesMia.length];
    index++;
  }, 2500);
}

function iniciarPorcentajeMarketing() {
  const progress = document.getElementById("progressFillMarketing");
  let porcentaje = 0;
  progress.textContent = "0%";
  progress.style.width = "0%";
  progress.style.opacity = "1"; // ← Ahora visible

  percentIntervalMarketing = setInterval(() => {
    if (porcentaje >= 100) {
      clearInterval(percentIntervalMarketing); // ← Detener al llegar a 100
      return;
    }
    porcentaje += Math.floor(Math.random() * 5) + 1;
    if (porcentaje > 100) porcentaje = 100;

    progress.style.width = porcentaje + "%";
    progress.textContent = porcentaje + "%";
  }, 200);
}

function detenerFrasesMarketing() {
  clearInterval(phraseIntervalMarketing);
  clearInterval(percentIntervalMarketing);
  document.getElementById("loadingPhraseMarketing").textContent = "";
  const barra = document.getElementById("progressFillMarketing");
  barra.style.width = "0%";
  barra.textContent = "0%";
}

// Enviar pregunta a la IA
function askChatGPTMarketing() {
  const input = document.getElementById("userInputMarketing").value.trim();
  if (!input) return;

  consultaMarketing.push({ role: "user", content: input });
  renderChatMarketing();
  document.getElementById("userInputMarketing").value = "";

  // Mostrar barra + animaciones
  document.getElementById("loadingContainerMarketing").style.display = "block";
  iniciarFrasesMarketing();
  iniciarPorcentajeMarketing();

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres MIA, una asesora IA especializada en marketing estratégico y neurocomunicación." },
        ...consultaMarketing
      ],
      temperature: 0.7
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loadingContainerMarketing").style.display = "none";
      detenerFrasesMarketing();

      const respuesta = data.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
      consultaMarketing.push({ role: "assistant", content: respuesta });
      renderChatMarketing();
    })
    .catch(error => {
      document.getElementById("loadingContainerMarketing").style.display = "none";
      detenerFrasesMarketing();

      consultaMarketing.push({ role: "assistant", content: `Error: ${error.message}` });
      renderChatMarketing();
    });
}

// Otros controles
function startFullChatMarketing() {
  const input = document.getElementById("userInputPreviewMarketing").value.trim();
  if (input) {
    document.getElementById("userInputMarketing").value = input;
    document.getElementById("chatPreviewMarketing").style.display = "none";
    document.getElementById("chatSectionMarketing").style.display = "block";
    askChatGPTMarketing();
  }
}

function closeChatMarketing() {
  document.getElementById("chatPreviewMarketing").style.display = "none";
  document.getElementById("chatSectionMarketing").style.display = "none";
}

function clearChatHistoryMarketing() {
  consultaMarketing = [];
  historialMarketing = [];
  localStorage.removeItem("consultasMarketing");
  renderChatMarketing();
  renderSidebarMarketing();
}

// Cargar historial al abrir
window.onload = () => {
  renderSidebarMarketing();
  renderChatMarketing();
};
