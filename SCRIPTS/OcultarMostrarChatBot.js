// Funcionalidad para mostrar/ocultar el chatbot
document.getElementById("chat-toggle1").addEventListener("click", function () {
    let chatContainer = document.getElementById("chat-container");
    let chatContainer1 = document.getElementById("chat-container1");
    if (chatContainer1.style.display === "none" || chatContainer1.style.display === "") {
        chatContainer1.style.display = "block";
        chatContainer.style.display = "none";
    } else {
        chatContainer1.style.display = "none";
    }
});