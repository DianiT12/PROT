  const modulos = [
    {
      titulo: "Módulo 1: Estado del Arte de la IA",
      url: "https://docs.google.com/gview?url=https://d1433d7d-d965-4b9d-b204-00ffda52c242.usrfiles.com/ugd/d1433d_5e3c51e8f2e54955b48ad0ba27fb7f28.pdf&embedded=true"
    },
    {
      titulo: "Módulo 2: Exploración Práctica de Herramientas de IA",
      url: "https://docs.google.com/gview?url=https://d1433d7d-d965-4b9d-b204-00ffda52c242.usrfiles.com/ugd/d1433d_8a87b57e86044e2fb7e4baa9a4f6154f.pdf&embedded=true"
    },
    {
      titulo: "Módulo 3: IA Aplicada a la Gestión de Datos",
      url: "https://docs.google.com/gview?url=https://d1433d7d-d965-4b9d-b204-00ffda52c242.usrfiles.com/ugd/d1433d_d5a09b9bbfb3400cb6096ef6396dab4b.pdf&embedded=true"
    },
    {
      titulo: "Módulo 4: Implementación de IA en la Empresa",
      url: "https://docs.google.com/gview?url=https://d1433d7d-d965-4b9d-b204-00ffda52c242.usrfiles.com/ugd/d1433d_79a8ccf9a3f04ff78c5f6e85ee6a95f4.pdf&embedded=true"
    }
  ];

  let moduloActual = 0;
  function ocultarTodo() {
    document.getElementById('moduloContainer').style.display = 'none';
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('evaluacionContainer').style.display = 'none';
  }

  function mostrarModulo() {
    document.getElementById('moduloContainer').style.display = 'block';
    // Si quieres que además haga scroll automático al contenedor
    document.getElementById('moduloContainer').scrollIntoView({ behavior: 'smooth' });
  }

  function cambiarModulo(direccion) {
    moduloActual += direccion;
    if (moduloActual < 0) moduloActual = 0;
    if (moduloActual >= modulos.length) moduloActual = modulos.length - 1;
    
    document.getElementById('visorPDF').src = modulos[moduloActual].url;
    document.getElementById('tituloModulo').innerText = modulos[moduloActual].titulo;
    document.getElementById('progresoModulo').innerText = `Módulo ${moduloActual + 1} de ${modulos.length}`;
  }