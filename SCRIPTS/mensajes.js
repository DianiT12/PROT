  function cerrarMensaje(id) {
    const mensaje = document.getElementById(id);
    if (mensaje) {
      mensaje.style.animation = "fadeFloatOut 1s ease forwards";
      setTimeout(() => {
        mensaje.style.display = "none";

        // Al cerrar mensajeBienvenida, mostrar mensajeKai
        if (id === 'mensajeBienvenida') {
          const kai = document.getElementById('mensajeKai');
          if (kai) {
            kai.style.display = "flex";
            kai.style.animation = "fadeFloatIn 0.6s ease forwards";

            // Cierre automático de Kai luego de 90s desde que aparece
            setTimeout(() => {
              cerrarMensaje('mensajeKai');
            }, 90000);
          }
        }
      }, 1000);
    }
  }

  // Cierre automático de mensajeBienvenida después de 90s
  setTimeout(() => {
    cerrarMensaje('mensajeBienvenida');
  }, 90000);