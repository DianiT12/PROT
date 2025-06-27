async function generateImageVentasDani() {
  const prompt = document.getElementById("promptVentasDani").value.trim();
  const imageContainer = document.getElementById("imageContainerVentasDani");
  imageContainer.style.display = "flex";

  if (!prompt) return alert("Por favor, ingresa una descripción.");

  imageContainer.innerHTML = `
  <style>
    .modern-loader-wrapper {
      text-align: center;
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #loaderPhraseVentas {
      font-size: 16px;
      color: #111;
      font-weight: bold;
      margin: 10px 0 5px;
      text-align: center;
    }

    .emoji-orbit {
      position: relative;
      width: 60px;
      height: 60px;
      margin-top: 10px;
    }

    .emoji-orbit .emoji {
      position: absolute;
      font-size: 26px;
      animation: spin-orbit 6s linear infinite;
    }

    .emoji:nth-child(1) {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      animation-delay: 0s;
    }

    .emoji:nth-child(2) {
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      animation-delay: 0.8s;
    }

    .emoji:nth-child(3) {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      animation-delay: 1.6s;
    }

    .emoji:nth-child(4) {
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      animation-delay: 2.4s;
    }

    @keyframes spin-orbit {
      0% { transform: rotate(0deg) translate(30px) rotate(0deg); }
      100% { transform: rotate(360deg) translate(30px) rotate(-360deg); }
    }
  </style>

  <div class="modern-loader-wrapper">
    <p id="loaderPhraseVentas" class="loader-text">Generando imagen con KAI®...</p>
    <div class="emoji-orbit">
      <div class="emoji">🎨</div>
      <div class="emoji">✏️</div>
      <div class="emoji">📸</div>
      <div class="emoji">🪄</div>
    </div>
  </div>
  `;

  const frasesCargando = [
    "🔁 Transformando ideas en imagen...",
    "✨ Dando forma visual a tu imaginación...",
    "🧠 IA en proceso creativo...",
    "⏳ Procesando tu visión, espera un momento...",
    "🎨 Activando creatividad de KAI®..."
  ];

  let i = 0;
  const loaderPhraseElement = document.getElementById("loaderPhraseVentas");
  const intervalId = setInterval(() => {
    loaderPhraseElement.textContent = frasesCargando[i % frasesCargando.length];
    i++;
  }, 2500);

  const API_KEY = "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";

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await response.json();
    clearInterval(intervalId);

    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url;
      imageContainer.innerHTML = `<img src="${imageUrl}" style="max-width:80%; margin-top:10px;">`;
    } else {
      imageContainer.innerHTML = "<p style='color:red;'>Error al generar la imagen.</p>";
    }
  } catch (err) {
    clearInterval(intervalId);
    imageContainer.innerHTML = "<p style='color:red;'>Error en la solicitud. Revisa tu API Key.</p>";
  }
}

// Mostrar/ocultar editor visual
function toggleEditorVentasDani() {
  const container = document.getElementById("editorContainerVentasDani");
  container.style.display = container.style.display === "none" ? "block" : "none";
}

// Ajustar tamaño del canvas según formato
function prepareCanvasVentasDani(format) {
  const [w, h] = format.split("x");
  const canvas = document.getElementById("editorVentasDani");
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  document.getElementById("canvasSizeVentasDani").innerText = `Formato: ${format}`;
}

// Limpiar canvas
function clearEditorVentasDani() {
  document.getElementById("editorVentasDani").innerHTML = "";
}

// Agregar texto al canvas
function addTextVentasDani() {
  const text = document.getElementById("customTextVentasDani").value;
  const color = document.getElementById("textColorVentasDani").value;
  const font = document.getElementById("fontFamilyVentasDani").value;
  const size = document.getElementById("fontSizeVentasDani").value;
  const div = document.createElement("div");
  div.contentEditable = true;
  div.textContent = text;
  div.style.color = color;
  div.style.fontFamily = font;
  div.style.fontSize = `${size}px`;
  div.style.position = "absolute";
  div.style.left = "50px";
  div.style.top = "50px";
  div.style.cursor = "move";
  div.draggable = true;
  document.getElementById("editorVentasDani").appendChild(div);
}

// Aplicar filtro al canvas
function applyFilterVentasDani(filter) {
  document.getElementById("editorVentasDani").style.filter = filter;
}

// Descargar imagen del editor
function downloadImageVentasDani() {
  const editor = document.getElementById("editorVentasDani");
  html2canvas(editor).then(canvas => {
    const link = document.createElement("a");
    link.download = `imagen_dani_reset.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}
