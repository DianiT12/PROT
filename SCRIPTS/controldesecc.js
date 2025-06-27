function mostrarSeccion(id) {
    const secciones = ['mostrarModulo', 'seccionVideos', 'quizForm'];
    secciones.forEach(seccion => {
      document.getElementById(seccion).style.display = (seccion === id) ? 'block' : 'none';
    });
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }