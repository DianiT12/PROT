document.addEventListener("DOMContentLoaded", function () {
  const bienvenida = document.getElementById("mensajeBienvenida");
  const kai = document.getElementById("mensajeKai");

  // Mostrar solo bienvenida al inicio
  bienvenida.style.display = "inline-flex";
  kai.style.display = "none";
});

function cerrarMensaje(idCerrar, idMostrar = null) {
  const cerrar = document.getElementById(idCerrar);
  cerrar.style.display = "none";

  if (idMostrar) {
    const mostrar = document.getElementById(idMostrar);
    mostrar.style.display = "inline-flex";
  }
}
