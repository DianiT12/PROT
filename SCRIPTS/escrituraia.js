// escrituraia.js
const avatarLucas = "IMAGENES/SofiaComunicacion.png";
let consultaEscritura = [];
let historialEscritura = JSON.parse(localStorage.getItem("consultasEscritura") || "[]");

function nuevaConsultaEscritura() {
  if (consultaEscritura.length > 0) {
    const userMsg = consultaEscritura.find(c => c.role === 'user')?.content || 'Consulta';
    const preview = userMsg.trim().split(" ").slice(0, 4).join(" ");
    const fecha = new Date().toLocaleDateString('es-EC');

    historialEscritura.push({
      nombre: preview + (userMsg.length > 60 ? "..." : ""),
      fecha: fecha,
      data: consultaEscritura
    });

    localStorage.setItem("consultasEscritura", JSON.stringify(historialEscritura));
  }

  consultaEscritura = [];
  document.getElementById("chatMessagesEscritura").innerHTML = "";
  renderSidebarEscritura();
}

function renderChatEscritura() {
  const chatBox = document.getElementById("chatMessagesEscritura");
  chatBox.innerHTML = "";
  consultaEscritura.forEach(entry => {
    const wrapper = document.createElement("div");
    wrapper.className = "message";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.gap = "10px";

    const messageHTML = entry.role === 'user'
      ? `<div style=\"background-color:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;\">${entry.content}</div>`
      : `<img src='${avatarLucas}' style='width:28px;height:28px;border-radius:50%;'><div style=\"background-color:#e0e0e0; color:black; border-radius:10px; padding:10px 15px;\">${entry.content}</div>`;

    wrapper.innerHTML = messageHTML;
    chatBox.appendChild(wrapper);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderSidebarEscritura() {
  const lista = document.getElementById("historialListaEscritura");
  lista.innerHTML = "";
  historialEscritura.forEach(({ nombre, data }, index) => {
    const li = document.createElement("li");
    li.innerText = nombre;
    li.onclick = () => {
      consultaEscritura = data;
      renderChatEscritura();
    };
    lista.appendChild(li);
  });
}

const frasesLucas = [
  "✍️ Trazando la mejor introducción...",
  "💬 Afinando el mensaje para persuadir...",
  "📢 Elaborando un cierre impactante...",
  "🧠 Buscando claridad y coherencia...",
  "🎯 Redacción enfocada en conversión..."
];

let phraseIntervalEscritura;
let percentIntervalEscritura;

function iniciarFrasesEscritura() {
  const fraseElement = document.getElementById("loadingPhraseEscritura");
  let index = 0;
  fraseElement.textContent = frasesLucas[0];
  phraseIntervalEscritura = setInterval(() => {
    fraseElement.textContent = frasesLucas[index % frasesLucas.length];
    index++;
  }, 2500);
}

function iniciarPorcentajeEscritura() {
  const progress = document.getElementById("progressFillEscritura");
  let porcentaje = 0;
  progress.textContent = "0%";
  progress.style.width = "0%";
  percentIntervalEscritura = setInterval(() => {
    if (porcentaje >= 100) {
      clearInterval(percentIntervalEscritura);
      return;
    }
    porcentaje += Math.floor(Math.random() * 5) + 1;
    if (porcentaje > 100) porcentaje = 100;
    progress.style.width = porcentaje + "%";
    progress.textContent = porcentaje + "%";
  }, 200);
}

function detenerFrasesEscritura() {
  clearInterval(phraseIntervalEscritura);
  clearInterval(percentIntervalEscritura);
  document.getElementById("loadingPhraseEscritura").textContent = "";
  const barra = document.getElementById("progressFillEscritura");
  barra.style.width = "0%";
  barra.textContent = "0%";
}

function askChatGPTEscritura() {
  const input = document.getElementById("userInputEscritura").value.trim();
  if (!input) return;

  consultaEscritura.push({ role: "user", content: input });
  renderChatEscritura();
  document.getElementById("userInputEscritura").value = "";

  document.getElementById("loadingContainerEscritura").style.display = "block";
  iniciarFrasesEscritura();
  iniciarPorcentajeEscritura();

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres SOFÍA, una redactora creativa IA especialista en redacción emocional, persuasiva y estratégica para todo tipo de formatos." },
        ...consultaEscritura
      ],
      temperature: 0.7
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loadingContainerEscritura").style.display = "none";
      detenerFrasesEscritura();
      const respuesta = data.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
      consultaEscritura.push({ role: "assistant", content: respuesta });
      renderChatEscritura();
    })
    .catch(error => {
      document.getElementById("loadingContainerEscritura").style.display = "none";
      detenerFrasesEscritura();
      consultaEscritura.push({ role: "assistant", content: `Error: ${error.message}` });
      renderChatEscritura();
    });
}

function clearChatHistoryEscritura() {
  consultaEscritura = [];
  historialEscritura = [];
  localStorage.removeItem("consultasEscritura");
  renderChatEscritura();
  renderSidebarEscritura();
}

window.onload = () => {
  renderSidebarEscritura();
  renderChatEscritura();
};
