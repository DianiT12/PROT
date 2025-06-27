function evaluateQuiz() {
  const nombre = document.getElementById("nombre").value.trim();
  const area = document.getElementById("area").value.trim();
  const questions = document.querySelectorAll("#formacion-inteligente .question");
  const result = document.getElementById("result");

  // Validar nombre y área
  if (nombre === "" || area === "") {
    alert("⚠️ Por favor, ingresa tu nombre y selecciona un área.");
    return;
  }

  let correctCount = 0;
  questions.forEach((question, index) => {
    const correctAnswer = question.dataset.correct;
    const selectedOption = document.querySelector(`input[name="q${index + 1}"]:checked`);
    
    if (selectedOption) {
      // Marcar visualmente correcto o incorrecto
      question.querySelectorAll("label").forEach(label => {
        const input = label.querySelector("input");
        label.classList.remove("correct", "incorrect");
        if (input.value === correctAnswer) {
          label.classList.add("correct");
        } else if (input.checked) {
          label.classList.add("incorrect");
        }
      });

      if (selectedOption.value === correctAnswer) {
        correctCount++;
      }
    }
  });

  const totalQuestions = questions.length;
  const score = (correctCount / totalQuestions) * 100;
  const aprobado = score >= 60;

  // Mostrar el resultado final
  result.innerHTML = `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-top: 20px;">
      <h3 style="color:${aprobado ? '#28a745' : '#dc3545'};">${aprobado ? '🎉 ¡Felicidades!' : '📚 Sigue practicando'}</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Área:</strong> ${area}</p>
      <p><strong>Puntaje:</strong> ${score.toFixed(1)}%</p>
      ${aprobado 
        ? '<p>Has aprobado con éxito la evaluación.</p>' 
        : '<p>Te recomendamos repasar el curso y volver a intentarlo.</p>'}
    </div>
  `;

  // Desplazar hasta el resultado
  result.scrollIntoView({ behavior: "smooth" });
}
