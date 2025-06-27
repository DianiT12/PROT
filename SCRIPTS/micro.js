  let audioContext = null;
  let analyser = null;
  let source = null;
  let stream = null;
  let dataArray = null;
  const animationIds = {};

  async function iniciarVisualizadorYVoz(idTextarea, visualizerId, buttonId) {
    try {
      const micButton = document.getElementById(buttonId);
      micButton.classList.add("mic-active");

      // Mostrar mensaje "🔊 Grabando..."
      document.getElementById(`grabandoLabel${visualizerId.includes('Preview') ? 'Preview' : 'Section'}`).style.display = 'block';

      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (!audioContext) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        dataArray = new Uint8Array(analyser.fftSize);
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      } else {
        await audioContext.resume();
      }

      iniciarOnda(visualizerId);
      iniciarReconocimientoVoz(idTextarea, visualizerId, buttonId);
    } catch (err) {
      alert("No se pudo acceder al micrófono. Verifica los permisos.");
      console.error(err);
    }
  }

  function iniciarOnda(visualizerId) {
    const container = document.getElementById(visualizerId);
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = 80;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function draw() {
      animationIds[visualizerId] = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#c00");
      gradient.addColorStop(1, "#999");

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }

    draw();
  }

  function fadeOutOnda(visualizerId) {
    cancelAnimationFrame(animationIds[visualizerId]);

    const canvas = document.querySelector(`#${visualizerId} canvas`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let alpha = 1;

    function fade() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, `rgba(204,0,0,${alpha})`);
      grad.addColorStop(1, `rgba(153,153,153,${alpha})`);

      ctx.lineWidth = 2;
      ctx.strokeStyle = grad;
      ctx.beginPath();
      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      alpha -= 0.05;
      if (alpha > 0) {
        requestAnimationFrame(fade);
      } else {
        document.getElementById(visualizerId).innerHTML = '';
        audioContext.suspend();
      }
    }

    fade();
  }

  function iniciarReconocimientoVoz(idTextarea, visualizerId, buttonId) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-EC';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = function(event) {
      document.getElementById(idTextarea).value = event.results[0][0].transcript;
    };

    recognition.onerror = function(event) {
      console.error("Error en reconocimiento de voz:", event.error);
    };

    recognition.onend = function() {
      fadeOutOnda(visualizerId);
      document.getElementById(buttonId).classList.remove("mic-active");
      document.getElementById(`grabandoLabel${visualizerId.includes('Preview') ? 'Preview' : 'Section'}`).style.display = 'none';
    };
  }
