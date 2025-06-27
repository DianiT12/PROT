function showSection(sectionId) {
    // Oculta todas las secciones antes de mostrar la deseada
    document.querySelectorAll('.section').forEach(section => section.style.display = "none");
    document.querySelectorAll('.section1').forEach(section => section.style.display = "none");

    // Muestra la sección seleccionada
    document.getElementById(sectionId).style.display = "block";

// ✅ Mostrar sección 'ventas-comercial' (Cerebro Central) al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  showSection('ventas-comercial');

  // Opcional: Oculta mensaje de bienvenida si está visible
  const mensajeBienvenida = document.getElementById("mensajeBienvenida");
  const mensajeKai = document.getElementById("mensajeKai");

  if (mensajeBienvenida) mensajeBienvenida.style.display = "none";
  if (mensajeKai) mensajeKai.style.display = "none";
});
 
    // Remueve la clase "active" de todos los elementos del menú
    document.querySelectorAll(".menu li").forEach(item => item.classList.remove("active"));

    // Agrega la clase "active" al botón que fue presionado
    let selectedItem = document.querySelector(`li[onclick="showSection('${sectionId}', event)"]`);
    if (selectedItem) {
        selectedItem.classList.add("active");
    }

    // Si la pantalla es de móvil o tablet, cierra el menú y muestra el contenido principal
    if (window.innerWidth <= 1024) {
        const sidebar = document.querySelector(".sidebar");
        const mainContent = document.querySelector(".main");
        const chatButton = document.querySelector(".chat-button");

        sidebar.classList.remove("open"); // Cierra el menú
        mainContent.style.display = "block"; // Vuelve a mostrar el contenido
        chatButton.style.display = "block"; // Muestra el botón de chat

        // Desplaza suavemente la sección seleccionada al centro
        setTimeout(() => {
            document.getElementById(sectionId).scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const videoContainer = document.getElementById("welcome-video-container"); 
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main");
    const chatButton = document.querySelector(".chat-button");
    const menuButton = document.querySelector(".menu-toggle"); 
    

    // Verifica que el botón del menú exista antes de agregar el evento
    if (!menuButton) {
        console.error("No se encontró el botón del menú. Verifica el HTML.");
        return;
    }

    // Función para abrir/cerrar menú y ocultar/mostrar video
    function toggleMenu() {
        const isOpening = !sidebar.classList.contains("open");
        sidebar.classList.toggle("open");

        if (isOpening) {
            if (mainContent) mainContent.style.display = "none"; 
            if (chatButton) chatButton.style.display = "none";
            if (videoContainer) videoContainer.style.display = "none"; 
        } else {
            if (mainContent) mainContent.style.display = "block"; 
            if (chatButton) chatButton.style.display = "block";
            if (videoContainer) videoContainer.style.display = "flex"; 
        }
    }

    // Agregar evento al botón del menú
    menuButton.addEventListener("click", toggleMenu);
});

function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => section.style.display = "none");

  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = "block";

    // Si es historial, carga automáticamente los datos del chat
    if (sectionId === "HistoryVentas") {
      displayHistoryVentas();
    }
  } else {
    console.warn("Sección no encontrada:", sectionId);
  }
}


// Agregar evento a las opciones del menú para registrar que se ha seleccionado una
document.querySelectorAll(".menu li").forEach(item => {
    item.addEventListener("click", function() {
        document.querySelector(".sidebar").classList.remove("open"); // Oculta el menú
        document.querySelector(".main").style.display = "block"; // Muestra el contenido
        document.querySelector(".chat-button").style.display = "block"; // Muestra el chat
    });
});

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => section.style.display = "none");
  
    const target = document.getElementById(sectionId);
    if (target) {
      target.style.display = "block";
  
      // Si es historial, carga automáticamente los datos del chat
      if (sectionId === "HistoryVentas") {
        mostrarHistorialVentas(); // ✅ Función correcta
      }
    } else {
      console.warn("Sección no encontrada:", sectionId);
    }
  }
  



  // 🔁 Oculta todos los módulos internos de Cerebro Catalyst
function ocultarModulosVentas() {
  const modulos = [
    "chatPreviewVentas",
    "chatSectionVentas",
    "videoCarouselVentas",
    "documentSectionVentas",
    "adStrategySectionVentas",
    "editorContainerVentas",
    "editorVentas"
  ];

  modulos.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// 🧠 Mostrar Vista Previa del Chat (Kai)
function abrirVistaPreviaKai() {
  ocultarModulosVentas();
  document.getElementById("chatPreviewVentas").style.display = "block";
}

// 🖼️ Mostrar Generador de Imágenes
function toggleAdStrategyVentas() {
  ocultarModulosVentas();
  document.getElementById("adStrategySectionVentas").style.display = "block";
}

// 📄 Mostrar Análisis Documental
function openDocumentSectionVentas() {
  ocultarModulosVentas();
  document.getElementById("documentSectionVentas").style.display = "block";
}

// ❌ Cerrar Chat y volver a mostrar el video de fondo
function closeChatVentas() {
  ocultarModulosVentas();
  const videoKai = document.getElementById("videoCarouselVentas");
  if (videoKai) videoKai.style.display = "block";
}

// ❌ Cerrar módulo de documentos y volver a video
function cerrarDocumentSectionVentas() {
  ocultarModulosVentas();
  const videoKai = document.getElementById("videoCarouselVentas");
  if (videoKai) {
    videoKai.style.display = "block";
    const videoTag = videoKai.querySelector("video");
    if (videoTag) videoTag.play();
  }
}

  

// 🔵 Función para ocultar todos los contenedores
function ocultarTodosLosContenedores() {
  // Ocultar módulo del curso
  const modulo = document.getElementById("moduloContainer");
  if (modulo) modulo.style.display = "none";

  // Ocultar formulario de evaluación
  const form = document.getElementById("quizForm");
  if (form) form.style.display = "none";

  // Ocultar sección de videos
  const videos = document.getElementById("seccionVideos");
  if (videos) videos.style.display = "none";

  // Ocultar sección principal de formación inteligente
  const formacion = document.getElementById("formacion-inteligente");
  if (formacion) formacion.style.display = "none";
}

// 🔵 Función para mostrar la sección de MÓDULO (Curso IA & Neuroliderazgo)
function mostrarModulo() {
  ocultarTodosLosContenedores(); // Limpiar todo

  const modulo = document.getElementById("moduloContainer");
  if (modulo) {
      modulo.style.display = "block";
      modulo.scrollIntoView({ behavior: 'smooth' });
  }
}

// 🔵 Función para mostrar la sección de VIDEOS/PODCAST
function mostrarVideos() {
  ocultarTodosLosContenedores(); // Limpiar todo

  const videos = document.getElementById("seccionVideos");
  if (videos) {
      videos.style.display = "block";
      videos.scrollIntoView({ behavior: 'smooth' });
  }
}

// 🔵 Función para mostrar el FORMULARIO de evaluación
function mostrarFormularioEvaluacion() {
  ocultarTodosLosContenedores(); // Limpiar todo

  const form = document.getElementById("quizForm");
  if (form) {
      form.style.display = "block";
      form.scrollIntoView({ behavior: 'smooth' });
  }
}

// 🔵 Función para volver a la sección principal de formación inteligente
function mostrarFormacionInteligente() {
  ocultarTodosLosContenedores(); // Limpiar todo

  const formacion = document.getElementById("formacion-inteligente");
  if (formacion) {
      formacion.style.display = "block";
      formacion.scrollIntoView({ behavior: 'smooth' });
  }
}

function openDocumentSectionComunicacion() {
  const docSection = document.getElementById("documentSectionComunicacion");
  const videoKai = document.getElementById("videoComunicacion"); // si tienes un video ahí

  if (docSection) docSection.style.display = "block";
  if (videoKai) videoKai.style.display = "none";
}
