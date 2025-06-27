 function openModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'flex'; // Mostrar modal con display:flex
    document.getElementById('localVideo').play();
  }

  function closeModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('localVideo');
    video.pause();
    video.currentTime = 0;
    modal.style.display = 'none'; // Ocultar modal
  }