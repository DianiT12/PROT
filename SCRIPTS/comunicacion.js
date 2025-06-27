let docContentComunicacion = '';
let consultaActualDocsComunicacion = [];
let historialDocsComunicacion = JSON.parse(localStorage.getItem("consultasDocsComunicacion") || "[]");

document.getElementById("fileInputDocsComunicacion").addEventListener("change", function () {
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

function askAIWithDocComunicacion() {
  const input = document.getElementById("userInputDocsComunicacion").value.trim();
  if (!input || !docContentComunicacion) return;

  consultaActualDocsComunicacion.push({ role: "user", content: input });
  renderDocChatComunicacion();
  document.getElementById("userInputDocsComunicacion").value = "";
  document.getElementById("loadingContainerDocsComunicacion").style.display = "block";

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer TU_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres LIA®, IA experta en comunicación. Archivo:\n\n" + docContentComunicacion },
        ...consultaActualDocsComunicacion
      ],
      temperature: 0.7
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("loadingContainerDocsComunicacion").style.display = "none";
    const respuesta = data.choices?.[0]?.message?.content || "LIA® no respondió.";
    consultaActualDocsComunicacion.push({ role: "assistant", content: respuesta });
    renderDocChatComunicacion();
  })
  .catch(() => {
    document.getElementById("loadingContainerDocsComunicacion").style.display = "none";
    consultaActualDocsComunicacion.push({ role: "assistant", content: "⚠️ Error de conexión o clave API inválida." });
    renderDocChatComunicacion();
  });
}

function renderDocChatComunicacion() {
  const chatBox = document.getElementById("chatMessagesDocsComunicacion");
  chatBox.innerHTML = "";
  consultaActualDocsComunicacion.forEach(entry => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = entry.role === 'user' ? 'flex-end' : 'flex-start';
    wrapper.style.gap = "10px";
    wrapper.innerHTML = entry.role === 'user'
      ? `<div style='background:#ccc; color:black; border-radius:10px; padding:10px 15px;'>${entry.content}</div>`
      : `<img src='${avatarKai}' style='width:28px;height:28px;border-radius:50%;'><div style='background:#eee; border-radius:10px; padding:10px 15px; text-align:justify; line-height:1.6; white-space:pre-line;'>${entry.content}</div>`;
    chatBox.appendChild(wrapper);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function nuevaConsultaDocsComunicacion() {
  if (consultaActualDocsComunicacion.length > 0) {
    const primerMensaje = consultaActualDocsComunicacion.find(c => c.role === 'user')?.content || 'Consulta';
    let vistaPrevia = primerMensaje.trim().split(" ").slice(0, 8).join(" ");
    if (primerMensaje.length > 60) vistaPrevia += "...";

    const ahora = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' });

    historialDocsComunicacion.push({ nombre: vistaPrevia, fecha: ahora, data: consultaActualDocsComunicacion });
    localStorage.setItem("consultasDocsComunicacion", JSON.stringify(historialDocsComunicacion));
  }

  consultaActualDocsComunicacion = [];
  document.getElementById("chatMessagesDocsComunicacion").innerHTML = "";
  renderDocSidebarComunicacion();
}

function renderDocSidebarComunicacion() {
  const lista = document.getElementById("historialListaDocsComunicacion");
  lista.innerHTML = "";

  historialDocsComunicacion.forEach(({ nombre, data }, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${nombre}</span>
      <button onclick="deleteDocHistorialComunicacion(${index})">🗑️</button>
    `;
    li.onclick = () => {
      consultaActualDocsComunicacion = data;
      renderDocChatComunicacion();
    };
    lista.appendChild(li);
  });
}

function deleteDocHistorialComunicacion(index) {
  historialDocsComunicacion.splice(index, 1);
  localStorage.setItem("consultasDocsComunicacion", JSON.stringify(historialDocsComunicacion));
  renderDocSidebarComunicacion();
}

function clearChatHistoryDocsComunicacion() {
  consultaActualDocsComunicacion = [];
  historialDocsComunicacion = [];
  localStorage.removeItem("consultasDocsComunicacion");
  renderDocChatComunicacion();
  renderDocSidebarComunicacion();
}

function cerrarDocumentSectionComunicacion() {
  document.getElementById("documentSectionComunicacion").style.display = "none";
  document.getElementById("videoComunicacion").style.display = "block";
}
