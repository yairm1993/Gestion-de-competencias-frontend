// ===============================
// 📥 Recuperar datos de la vacante seleccionada
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const vacanteGuardada = localStorage.getItem('vacanteSeleccionada');
  if (!vacanteGuardada) return;

  const vacante = JSON.parse(vacanteGuardada);

  // 👇 Aquí debes llenar tus inputs de dnc.html con los datos
  document.getElementById('inputNombre').value = vacante.nombre || '';
  document.getElementById('inputArea').value = vacante.area || '';
  document.getElementById('inputRequisitor').value = vacante.requisitor || '';
  document.getElementById('inputTipoProceso').value = vacante.tipoProceso || '';
  document.getElementById('inputPrioridad').value = vacante.prioridad || '';
});
