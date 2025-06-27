 function resetFormularioEvaluacion() {
  // Limpiar campo de nombre
  document.getElementById('nombreUsuario').value = '';

  // Deseleccionar todas las respuestas
  const inputs = document.querySelectorAll('#quizForm input[type="radio"]');
  inputs.forEach(input => input.checked = false);

  // Limpiar canvas y ocultar botones
  const canvas = document.getElementById('canvasCertificado');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.getElementById('descargarCertificado').style.display = 'none';
  document.getElementById('descargarCertificadoPDF').style.display = 'none';
}

function mostrarSeccion(id) {
  const secciones = ['mostrarModulo', 'seccionVideos', 'quizForm', 'certificado'];
  secciones.forEach(sec => {
    const elem = document.getElementById(sec);
    if (elem) elem.style.display = 'none';
  });

  if (id === 'quizForm') {
    resetFormularioEvaluacion();
  }

  const mostrar = document.getElementById(id);
  if (mostrar) {
    mostrar.style.display = 'block';
    window.scrollTo({ top: mostrar.offsetTop, behavior: 'smooth' });
  }
}


  function ocultarCertificado() {
    const cert = document.getElementById('certificado');
    const canvas = document.getElementById('canvasCertificado');
    const botonPNG = document.getElementById('descargarCertificado');
    const botonPDF = document.getElementById('descargarCertificadoPDF');

    if (cert) cert.style.display = 'none';
    if (botonPNG) botonPNG.style.display = 'none';
    if (botonPDF) botonPDF.style.display = 'none';

    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  document.getElementById('quizForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreUsuario').value.trim();
    if (!nombre) {
      alert('Por favor, ingresa tu nombre');
      return;
    }

    const preguntas = document.querySelectorAll('.question');
    let correctas = 0;
    preguntas.forEach((pregunta, index) => {
      const correcta = pregunta.getAttribute('data-correct');
      const seleccionada = document.querySelector(`input[name=q${index + 1}]:checked`);
      if (seleccionada && seleccionada.value === correcta) {
        correctas++;
      }
    });

    if (correctas >= 7) {
      generarCertificado(nombre);
    } else {
      alert(`Obtuviste ${correctas}/10 respuestas correctas. Necesitas al menos 7 para obtener el certificado.`);
    }
  });

  function generarCertificado(nombre) {
    document.getElementById('quizForm').style.display = 'none';
    document.getElementById('certificado').style.display = 'block';

    const canvas = document.getElementById('canvasCertificado');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'IMAGENES/certi.png';

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 36px Poppins, sans-serif';
      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'center';
      ctx.fillText(nombre, canvas.width / 2, canvas.height / 2 + 20);

      const image = canvas.toDataURL('image/png');

      const botonPNG = document.getElementById('descargarCertificado');
      botonPNG.href = image;
      botonPNG.download = 'certificado_' + nombre.replace(/\s+/g, '_') + '.png';
      botonPNG.style.display = 'inline-block';

      const botonPDF = document.getElementById('descargarCertificadoPDF');
      botonPDF.onclick = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
        pdf.addImage(image, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('certificado_' + nombre.replace(/\s+/g, '_') + '.pdf');
      };
      botonPDF.style.display = 'inline-block';

      // 🔔 Ocultar certificado tras 30 segundos
      setTimeout(() => {
        ocultarCertificado();
        alert("⏳ El certificado se ha ocultado después de 30 segundos.");
      }, 30000);
    };
  }