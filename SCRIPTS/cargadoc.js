let loadingIntervalDocs;
  
    function startLoadingBarDocs() {
      const bar = document.getElementById("progressBarDocs");
      const phrase = document.getElementById("progressPhraseDocs");
      let progress = 0;
      let fraseIndex = 0;
  
      const frases = [
  "📘 Revisando tu documento académico...",
  "🎓 Identificando conceptos clave universitarios...",
  "📚 Analizando la estructura argumentativa...",
  "🧠 Sintetizando aportes teóricos y prácticos...",
  "📝 Preparando un resumen con enfoque académico..."
];

  
      bar.style.width = "0%";
      bar.textContent = "0%";
      phrase.textContent = frases[0];
  
      clearInterval(loadingIntervalDocs);
      loadingIntervalDocs = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 4;
        if (progress > 100) progress = 100;
  
        bar.style.width = progress + "%";
        bar.textContent = progress + "%";
  
        if (progress >= (fraseIndex + 1) * 20 && fraseIndex < frases.length - 1) {
          fraseIndex++;
          phrase.textContent = frases[fraseIndex];
        }
  
        if (progress >= 100) clearInterval(loadingIntervalDocs);
      }, 300);
    }
  
    function resetLoadingBarDocs() {
      clearInterval(loadingIntervalDocs);
      document.getElementById("progressBarDocs").style.width = "0%";
      document.getElementById("progressBarDocs").textContent = "0%";
      document.getElementById("progressPhraseDocs").textContent = "📘 Iniciando análisis del documento...";
    }