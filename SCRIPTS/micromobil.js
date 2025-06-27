 function esDispositivoMovil() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (esDispositivoMovil()) {
      const btnMicPreview = document.getElementById('btnMicPreview');
      const btnMicSection = document.getElementById('btnMicSection');
      const visualPreview = document.getElementById('voiceVisualizerPreview');
      const visualSection = document.getElementById('voiceVisualizerSection');

      if (btnMicPreview) btnMicPreview.style.display = 'none';
      if (btnMicSection) btnMicSection.style.display = 'none';
      if (visualPreview) visualPreview.style.display = 'none';
      if (visualSection) visualSection.style.display = 'none';
    }
  });