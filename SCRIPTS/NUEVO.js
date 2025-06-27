  document.getElementById("quizForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value.trim();
    if (!nombre) {
      alert("Por favor, ingresa tu nombre completo.");
      return;
    }

    const preguntas = document.querySelectorAll(".question");
    let correctas = 0;

    preguntas.forEach((pregunta, index) => {
      const seleccionada = document.querySelector(`input[name="q${index + 1}"]:checked`);
      if (seleccionada && seleccionada.value === pregunta.dataset.correct) {
        correctas++;
      }
    });

    if (correctas >= 7) {
      mostrarCertificado(nombre);
    } else {
      alert(`Obtuviste ${correctas}/10. Sigue practicando para obtener tu certificado.`);
      mostrarBotonCerrar();
    }
  });

  function mostrarCertificado(nombre) {
    const certificado = document.getElementById("certificado");
    const canvas = document.getElementById("canvasCertificado");
    const ctx = canvas.getContext("2d");
    const imagen = new Image();
    imagen.src = 'IMAGENES/certificado-plantilla.png'; // cambia esto si tu ruta es distinta

    imagen.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#1e1e1e";
      ctx.font = "bold 36px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(nombre, canvas.width / 2, 430); // Ajusta la posición Y según tu plantilla

      certificado.style.display = "block";
      document.getElementById("descargarCertificadoPDF").style.display = "inline-block";
      crearBotonCerrar();
    };
  }

  document.getElementById("descargarCertificadoPDF").addEventListener("click", function () {
    const canvas = document.getElementById("canvasCertificado");
    const nombre = document.getElementById("nombreUsuario").value.trim();
    html2canvas(canvas).then(canvas => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("landscape", "pt", [1000, 707]);
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 1000, 707);
      pdf.save(`Certificado-${nombre}.pdf`);
      reiniciarFormulario();
    });
  });

  function crearBotonCerrar() {
    let salir = document.createElement("button");
    salir.id = "btnSalir";
    salir.textContent = "❌ Cerrar";
    salir.style.marginLeft = "20px";
    salir.className = "btn-descarga";
    salir.onclick = reiniciarFormulario;
    document.getElementById("certificado").appendChild(salir);
  }

  function mostrarBotonCerrar() {
    const certificado = document.getElementById("certificado");
    certificado.innerHTML = `
      <h2>❗ Resultado</h2>
      <p style="font-size: 18px;">No alcanzaste el puntaje mínimo para el certificado (7/10).</p>
    `;
    crearBotonCerrar();
    certificado.style.display = "block";
  }

  function reiniciarFormulario() {
    document.getElementById("quizForm").reset();
    document.getElementById("nombreUsuario").value = "";
    document.getElementById("quizForm").style.display = "none";
    document.getElementById("certificado").style.display = "none";
    const canvas = document.getElementById("canvasCertificado");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("descargarCertificadoPDF").style.display = "none";
    const btnSalir = document.getElementById("btnSalir");
    if (btnSalir) btnSalir.remove();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
