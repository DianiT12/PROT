function generarPrompt() {
    const area = document.getElementById('area').value;
    const realidad = document.getElementById('realidad').value.trim();
    const experto = document.getElementById('experto').value.trim();
    const salida = document.getElementById('salida').value.trim();
    const especificaciones = document.getElementById('especificaciones').value.trim();
    const terminos = document.getElementById('terminos').value.trim();

    let prompt = `Actúa como experto en ${area}.\n\n`;
    if (experto) prompt += `Asume el rol de: ${experto}.\n\n`;
    if (realidad) prompt += `Contexto actual:\n${realidad}\n\n`;
    if (salida) prompt += `Salida esperada:\n${salida}\n\n`;
    if (especificaciones) prompt += `Formato / Estilo:\n${especificaciones}\n\n`;
    if (terminos) prompt += `Términos y restricciones:\n${terminos}\n\n`;

    document.getElementById('promptFinal').value = prompt;
  }

  function mostrarModal(texto) {
    document.getElementById('modalPrompt').value = texto;
    document.getElementById('modal').style.display = 'block';
  }

  function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
  }

  function copiarPrompt() {
    const prompt = document.getElementById('modalPrompt');
    prompt.select();
    document.execCommand('copy');
    alert('¡Prompt copiado al portapapeles!');
  }