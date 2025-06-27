 function actualizarFechaHoraEcuador() {
      const opciones = {
        timeZone: 'America/Guayaquil',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
    
      const fecha = new Date().toLocaleString('es-EC', opciones);
      document.getElementById('fechaHoraEcuador').innerHTML = `${fecha}`;
    }
    
    setInterval(actualizarFechaHoraEcuador, 1000);
    actualizarFechaHoraEcuador();