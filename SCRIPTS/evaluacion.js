function evaluateQuiz() {
  const nombre = document.getElementById("nombre").value.trim();
  const area = document.getElementById("area").value;
  const resultBox = document.getElementById("result");

  if (!nombre || !area) {
    alert("⚠️ Por favor, completa tu nombre y selecciona un área antes de enviar la evaluación.");
    return;
  }

  const questions = document.querySelectorAll("#quizForm .question");
  let correctAnswers = 0;

  questions.forEach((q) => {
    const correct = q.dataset.correct;
    const selected = q.querySelector('input[type="radio"]:checked');
    if (selected && selected.value === correct) {
      correctAnswers++;
    }
  });

  const total = questions.length;
  const score = (correctAnswers / total) * 100;

  resultBox.classList.remove("aprobado", "reprobado");

  if (score >= 90) {
    resultBox.classList.add("aprobado");
    resultBox.innerHTML = `
      🎉 <strong>${nombre}</strong> | Área: <strong>${area}</strong><br>
      ✅ ¡Aprobaste con <strong>${score.toFixed(1)}%</strong> (${correctAnswers} de ${total} respuestas correctas)!
    `;
    document.getElementById("certButton").style.display = "inline-block";
  } else {
    resultBox.classList.add("reprobado");
    resultBox.innerHTML = `
      ❌ <strong>${nombre}</strong> | Área: <strong>${area}</strong><br>
      Obtuviste <strong>${score.toFixed(1)}%</strong> (${correctAnswers} de ${total} correctas). Sigue adelante y vuelve a intentarlo.
    `;
    document.getElementById("certButton").style.display = "none";
  }
}