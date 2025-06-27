  function mostrarModulo(modulo) {
      const tituloModulo = document.getElementById("tituloModulo");
      const descripcionModulo = document.getElementById("descripcionModulo");
      const tituloVideo = document.getElementById("tituloVideo");
      const video = document.getElementById("videoModulo");
      const fuente = document.getElementById("fuenteVideo");
  
      if (modulo === '1') {
        tituloModulo.innerText = "Módulo I: IA & NeuroLiderazgo";
        descripcionModulo.innerText = "Estado del Arte de la IA / LA IMPORTANCIA EN LA SOCIEDAD";
        tituloVideo.innerText = "Estado del Arte de la IA";
        video.poster = "IMAGENES/modulo1.png";
        fuente.src = "IMAGENES/FormacionArtesanosModulo_I.mp4";
      } else if (modulo === '2') {
        tituloModulo.innerText = "Módulo II: Neuroliderazgo Aplicado";
        descripcionModulo.innerText = "Exploración Práctica de Herramientas de IA";
        tituloVideo.innerText = "Neuroliderazgo en acción";
        video.poster = "IMAGENES/MODULO2.png";
        fuente.src = "IMAGENES/FormacionArtesanosModulo_II.mp4";
      }
  
      // Recargar el video
      video.load();
    }