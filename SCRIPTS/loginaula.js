  // Mostrar el login
  function abrirLogin() {
    document.getElementById("loginFlotante").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  }

  // Cerrar login
  function cerrarLogin() {
    document.getElementById("loginFlotante").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("mensajeError").innerText = "";
  }

  function validarLogin() {
  const user = document.getElementById("usuario").value.trim().toLowerCase();
  const pass = document.getElementById("contrasena").value.trim();

  // Lista de usuarios válidos: usuario => contraseña
  const usuarios = {
    "eli": "eli123",
    "estefy": "estefy123",
    "esteban": "admin"
  };

  // Verifica si el usuario existe y la contraseña coincide
  if (usuarios[user] && usuarios[user] === pass) {
    const nombreCapitalizado = capitalizarNombre(user);

    // Guardar en localStorage
    localStorage.setItem("nombreUsuario", nombreCapitalizado);

    // Ocultar login y mostrar bienvenida
    document.getElementById("loginFlotante").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("mensajeError").innerText = "";

    const mensaje = `👋 Bienvenida/o ${nombreCapitalizado} al Aula Virtual`;
    const mensajeDiv = document.getElementById("mensajeBienvenidalogin");
    mensajeDiv.innerText = mensaje;
    mensajeDiv.style.display = "block";

    // Redirigir después de 3 segundos
    setTimeout(() => {
      window.location.href = "aulaianeuro.html";
    }, 3000);
  } else {
    document.getElementById("mensajeError").innerText = "Credenciales incorrectas.";
  }
}

// Capitalizar nombre
function capitalizarNombre(nombre) {
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}


  // Capitaliza el nombre
  function capitalizarNombre(nombre) {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
  }