// Script de bienvenida
document.addEventListener("DOMContentLoaded", function() {
    let menuItems = document.querySelectorAll(".menu li");
    menuItems.forEach(item => {
    item.addEventListener("click", function() {
        let videoContainer = document.getElementById("welcome-video-container");
            if (videoContainer) {
            videoContainer.style.display = "none"; // Oculta el video
            }
        });
    });
});