let originalMainMargin = null;
let originalVideoMargin = null;

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");
    const video = document.querySelector(".welcome-video");
    const overlay = document.getElementById("overlay-menu");
    const fechaHora = document.querySelector(".fecha-hora-ecuador");

    sidebar.classList.toggle("collapsed");

    const isCollapsed = sidebar.classList.contains("collapsed");
    localStorage.setItem("sidebarState", isCollapsed ? "collapsed" : "expanded");

    if (main) {
        if (originalMainMargin === null) originalMainMargin = main.style.marginLeft;
        main.classList.toggle("centered", isCollapsed);
        main.style.marginLeft = isCollapsed ? "" : originalMainMargin;
    }

    if (video) {
        if (originalVideoMargin === null) originalVideoMargin = video.style.marginLeft;
        video.classList.toggle("centered", isCollapsed);
        video.style.marginLeft = isCollapsed ? "" : originalVideoMargin;
    }

    if (fechaHora) {
        fechaHora.classList.toggle("ajustada", isCollapsed);
    }

    if (overlay) {
        overlay.style.display = isCollapsed ? "none" : "block";
    }
}

// Cargar estado inicial desde localStorage o forzar colapsado si no hay valor
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");
    const overlay = document.getElementById("overlay-menu");
    const fechaHora = document.querySelector(".fecha-hora-ecuador");

    const esMovil = window.innerWidth <= 768; // Puedes ajustar el breakpoint según tu diseño

    // Solo colapsar si NO es móvil
    if (!esMovil) {
        sidebar.classList.add("collapsed");
        if (main) main.classList.add("centered");
        if (fechaHora) fechaHora.classList.add("ajustada");
        if (overlay) overlay.style.display = "none";

        // Guardar estado solo si no existe
        if (!localStorage.getItem("sidebarState")) {
            localStorage.setItem("sidebarState", "collapsed");
        }
    } else {
        // En móviles, guardar el estado como expandido si no existe
        if (!localStorage.getItem("sidebarState")) {
            localStorage.setItem("sidebarState", "expanded");
        }
    }
});


// Toggle desde el botón
document.getElementById("collapse-menu").addEventListener("click", function () {
    toggleSidebar();
    let icon = this.querySelector("i");
    icon.classList.toggle("fa-chevron-left");
    icon.classList.toggle("fa-chevron-right");
});

// Cerrar el menú si se hace clic en el fondo oscuro
document.getElementById("overlay-menu").addEventListener("click", () => {
    let sidebar = document.querySelector(".sidebar");
    if (!sidebar.classList.contains("collapsed")) {
        toggleSidebar();
    }
});
