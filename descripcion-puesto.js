document.addEventListener('DOMContentLoaded', () => {
  const vacanteSeleccionada = JSON.parse(localStorage.getItem('vacanteSeleccionada'));

  if (vacanteSeleccionada) {
    console.log('📦 Vacante recibida:', vacanteSeleccionada);

    // Muestra los datos en la interfaz (puedes adaptarlo a tus inputs reales)
    document.getElementById('dpNombrePuesto').value = vacanteSeleccionada.nombre;
    document.getElementById('dpArea').value = vacanteSeleccionada.area;
    document.getElementById('dpRequisitor').value = vacanteSeleccionada.requisitor;
  } else {
    console.warn('⚠️ No se encontró ninguna vacante seleccionada.');
  }
});
