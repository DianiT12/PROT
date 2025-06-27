function ChatSection() {
    document.getElementById('videoCarousel').style.display = 'none';
    document.getElementById('adStrategySection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'block';
    document.getElementById('documentSection').style.display = 'none';
    const container = document.getElementById("editorContainer");
    const editor = document.getElementById("editor");

    // Ocultar el contenedor del editor
    container.style.display = "none";
    // Mostrar el editor
    editor.style.display = "none";
}

function toggleAdStrategy() {
    document.getElementById('videoCarousel').style.display = 'none';
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('adStrategySection').style.display = 'block';
    document.getElementById('documentSection').style.display = 'none';
    const container = document.getElementById("editorContainer");
    const editor = document.getElementById("editor");

    // Ocultar el contenedor del editor
    container.style.display = "none";
    // Mostrar el editor
    editor.style.display = "none";
}

function openDocumentSection() {
    document.getElementById('videoCarousel').style.display = 'none';
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('adStrategySection').style.display = 'none';
    document.getElementById('documentSection').style.display = 'block';
    const container = document.getElementById("editorContainer");
    const editor = document.getElementById("editor");

    // Ocultar el contenedor del editor
    container.style.display = "none";
    // Mostrar el editor
    editor.style.display = "none";
   }

function closeAdStrategy() {
    document.getElementById('adStrategySection').style.display = 'none';
    document.getElementById('videoCarousel').style.display = 'block';
    //Limpiar el Chat
    document.getElementById("prompt").value = "";
    document.getElementById("imageContainer").style.display = "none";
}

async function generateImage() {
    const prompt = document.getElementById("prompt").value.trim();
    const imageContainer = document.getElementById("imageContainer");
    // Mostrar el contenedor antes de generar la imagen
    imageContainer.style.display = "flex";
    imageContainer.innerHTML = `<p class="shake-text" style="color: black; font-size: 18px;">
      Generando imagen<span class="dots"></span>
    </p>`;

    if (!prompt) {
        alert("Por favor, ingresa una descripción.");
        return;
    }

    const API_KEY = "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"; // Reemplaza con tu clave real

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-2",
                prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const imageUrl = data.data[0].url;
            imageContainer.innerHTML = `
                <img src="${imageUrl}" alt="Imagen generada" style="margin-top: 8px; display: block; max-width: 40%; max-height: 40%;">
            `;
        } else {
            imageContainer.innerHTML = "<p style='color: red;'>Error al generar la imagen.</p>";
        }
    } catch (error) {
        imageContainer.innerHTML = "<p style='color: red;'>Error en la solicitud. Verifica tu clave API o conexión.</p>";
    }
}