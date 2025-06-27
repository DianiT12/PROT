// talentoia.js
const avatarLia = "IMAGENES/ErikaTalento.png";
let consultaTalento = [];
let historialTalento = JSON.parse(localStorage.getItem("consultasTalento") || "[]");

function nuevaConsultaTalento() {
  if (consultaTalento.length > 0) {
    const userMsg = consultaTalento.find(c => c.role === 'user')?.content || 'Consulta';
    const preview = userMsg.trim().split(" ").slice(0, 4).join(" ");
    const fecha = new Date().toLocaleDateString('es-EC');

    historialTalento.push({
      nombre: preview + (userMsg.length > 60 ? "..." : ""),
      fecha: fecha,
      data: consultaTalento
    });

    localStorage.setItem("consultasTalento", JSON.stringify(historialTalento));
  }

  consultaTalento = [];
  document.getElementById("chatMessagesTalento").innerHTML = "";
  renderSidebarTalento();
}

function renderChatTalento() {
  const chatBox = document.getElementById("chatMessagesTalento");
  chatBox.innerHTML = "";
  consultaTalento.forEach(entry => {
    const wrapper = document.createElement("div");
    wrapper.className = "message";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.gap = "10px";

    const messageHTML = entry.role === 'user'
      ? `<div style="background-color:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;">${entry.content}</div>`
      : `<img src='${avatarLia}' style='width:28px;height:28px;border-radius:50%;'><div style="background-color:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;">${entry.content}</div>`;

    wrapper.innerHTML = messageHTML;
    chatBox.appendChild(wrapper);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderSidebarTalento() {
  const lista = document.getElementById("historialListaTalento");
  lista.innerHTML = "";
  historialTalento.forEach(({ nombre, data }, index) => {
    const li = document.createElement("li");
    li.innerText = nombre;
    li.onclick = () => {
      consultaTalento = data;
      renderChatTalento();
    };
    lista.appendChild(li);
  });
}

const frasesLia = [
  "💡 Explorando clima laboral...",
  "🧠 Analizando habilidades blandas...",
  "📘 Procesando políticas de bienestar...",
  "🎯 Alineando cultura organizacional...",
  "🤝 Sintonizando liderazgo consciente..."
];

let phraseIntervalTalento;
let percentIntervalTalento;

function iniciarFrasesTalento() {
  const fraseElement = document.getElementById("loadingPhraseTalento");
  let index = 0;
  fraseElement.textContent = frasesLia[0];
  phraseIntervalTalento = setInterval(() => {
    fraseElement.textContent = frasesLia[index % frasesLia.length];
    index++;
  }, 2500);
}

function iniciarPorcentajeTalento() {
  const progress = document.getElementById("progressFillTalento");
  let porcentaje = 0;
  progress.textContent = "0%";
  progress.style.width = "0%";
  percentIntervalTalento = setInterval(() => {
    if (porcentaje >= 100) {
      clearInterval(percentIntervalTalento);
      return;
    }
    porcentaje += Math.floor(Math.random() * 5) + 1;
    if (porcentaje > 100) porcentaje = 100;
    progress.style.width = porcentaje + "%";
    progress.textContent = porcentaje + "%";
  }, 200);
}

function detenerFrasesTalento() {
  clearInterval(phraseIntervalTalento);
  clearInterval(percentIntervalTalento);
  document.getElementById("loadingPhraseTalento").textContent = "";
  const barra = document.getElementById("progressFillTalento");
  barra.style.width = "0%";
  barra.textContent = "0%";
}

function askChatGPTTalento() {
  const input = document.getElementById("userInputTalento").value.trim();
  if (!input) return;

  consultaTalento.push({ role: "user", content: input });
  renderChatTalento();
  document.getElementById("userInputTalento").value = "";

  document.getElementById("loadingContainerTalento").style.display = "block";
  iniciarFrasesTalento();
  iniciarPorcentajeTalento();

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres LIA, una IA especialista en talento humano, clima laboral, bienestar, selección y cultura organizacional." },
        ...consultaTalento
      ],
      temperature: 0.7
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loadingContainerTalento").style.display = "none";
      detenerFrasesTalento();
      const respuesta = data.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
      consultaTalento.push({ role: "assistant", content: respuesta });
      renderChatTalento();
    })
    .catch(error => {
      document.getElementById("loadingContainerTalento").style.display = "none";
      detenerFrasesTalento();
      consultaTalento.push({ role: "assistant", content: `Error: ${error.message}` });
      renderChatTalento();
    });
}

function clearChatHistoryTalento() {
  consultaTalento = [];
  historialTalento = [];
  localStorage.removeItem("consultasTalento");
  renderChatTalento();
  renderSidebarTalento();
}

window.onload = () => {
  renderSidebarTalento();
  renderChatTalento();
};
