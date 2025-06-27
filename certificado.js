// Mostrar formulario
function mostrarFormulario() {
    document.getElementById('quizForm').style.display = 'block';
    window.scrollTo(0, document.getElementById('quizForm').offsetTop);
  }
  
  // Validar respuestas
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
  
  // Generar certificado personalizado
  function generarCertificado(nombre) {
    document.getElementById('quizForm').style.display = 'none';
    document.getElementById('certificado').style.display = 'block';
  
    const canvas = document.getElementById('canvasCertificado');
    const ctx = canvas.getContext('2d');
  
    const img = new Image();
    img.src = 'IMAGENES/certi.png'; // Ruta local a tu imagen de certificado
  
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      // Escribir nombre en el certificado
      ctx.font = 'bold 36px Poppins, sans-serif';
      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'center';
      ctx.fillText(nombre, canvas.width / 2, canvas.height / 2 + 20);
  
     // Cuando termine de dibujar, habilitar la descarga
const downloadButton = document.getElementById('descargarCertificado');
const image = canvas.toDataURL('image/png');
downloadButton.href = image;
downloadButton.download = 'certificado_' + nombre.replace(/\s+/g, '_') + '.png';
downloadButton.style.display = 'inline-block'; // Mostrar el botón

    };
  }
  