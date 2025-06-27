function ChatSectionVentas() {
    document.getElementById('videoCarouselVentas').style.display = 'none';
    document.getElementById('adStrategySectionVentas').style.display = 'none';
    document.getElementById('chatSectionVentas').style.display = 'block';
    document.getElementById('documentSectionVentas').style.display = 'none';
    const container = document.getElementById("editorContainerVentas");
    const editor = document.getElementById("editorVentas");

    container.style.display = "none";
    editor.style.display = "none";
}

function toggleAdStrategyVentas() {
    document.getElementById('videoCarouselVentas').style.display = 'none';
    document.getElementById('chatSectionVentas').style.display = 'none';
    document.getElementById('adStrategySectionVentas').style.display = 'block';
    document.getElementById('documentSectionVentas').style.display = 'none';
    const container = document.getElementById("editorContainerVentas");
    const editor = document.getElementById("editorVentas");

    container.style.display = "none";
    editor.style.display = "none";
}

function openDocumentSectionVentas() {
    document.getElementById('videoCarouselVentas').style.display = 'none';
    document.getElementById('chatSectionVentas').style.display = 'none';
    document.getElementById('adStrategySectionVentas').style.display = 'none';
    document.getElementById('documentSectionVentas').style.display = 'block';
    const container = document.getElementById("editorContainerVentas");
    const editor = document.getElementById("editorVentas");

    container.style.display = "none";
    editor.style.display = "none";
}

function closeAdStrategyVentas() {
    document.getElementById('adStrategySectionVentas').style.display = 'none';
    document.getElementById('videoCarouselVentas').style.display = 'block';
    document.getElementById("promptVentas").value = "";
    document.getElementById("imageContainerVentas").style.display = "none";
}

async function generateImageVentas() {
    const prompt = document.getElementById("promptVentas").value.trim();
    const imageContainer = document.getElementById("imageContainerVentas");
  
    imageContainer.style.display = "flex";
    imageContainer.innerHTML = `
      <style>
        .infinite-loader {
          width: 80px;
          height: 80px;
          border: 8px solid rgba(0, 0, 0, 0.1);
          border-left-color: black;
          border-radius: 50%;
          animation: spinLoader 1.2s linear infinite;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
          margin: 0 auto;
        }
  
        @keyframes spinLoader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
  
        #fraseLoader {
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          margin-top: 12px;
          color: #222;
        }
      </style>
  
      <div style="text-align: center; width: 100%;">
        <div class="infinite-loader"></div>
        <p id="fraseLoader">Cargando magia visual...</p>
      </div>
    `;
  
    if (!prompt) {
      alert("Por favor, ingresa una descripción.");
      return;
    }
  
    // 🌟 Frases rotativas
    const frases = [
      "🎨 Transformando tu idea en arte visual...",
      "🤖 Procesando tu visión con IA...",
      "🧠 Dando forma a tu imaginación...",
      "✨ Conectando creatividad y tecnología...",
      "⏳ Visualizando tu prompt con precisión..."
    ];
    let i = 0;
    const fraseElement = document.getElementById("fraseLoader");
    const intervaloFrases = setInterval(() => {
      fraseElement.textContent = frases[i % frases.length];
      i++;
    }, 2500);
  
    const API_KEY = "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";
  
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024"
        })
      });
  
      const data = await response.json();
      clearInterval(intervaloFrases); // 🛑 Detener rotación de frases
  
      if (data.data && data.data.length > 0) {
        const imageUrl = data.data[0].url;
        imageContainer.innerHTML = `
          <img src="${imageUrl}" alt="Imagen generada" style="margin-top: 8px; display: block; max-width: 80%; max-height: 80%;">
        `;
      } else {
        imageContainer.innerHTML = "<p style='color: red;'>Error al generar la imagen.</p>";
      }
    } catch (error) {
      clearInterval(intervaloFrases);
      imageContainer.innerHTML = "<p style='color: red;'>Error en la solicitud. Verifica tu clave API o conexión.</p>";
    }
  }
  