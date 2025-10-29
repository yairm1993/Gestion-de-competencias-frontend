// ===============================
// 📦 VARIABLES GLOBALES
// ===============================
let vacantes = [];
let vacanteEditando = null;

document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const listaVacantes = document.getElementById('listaVacantes');
  const btnCrear = document.getElementById('btnCrearVacante');

  // Modal
  const modalVacante = document.getElementById('modalVacante');
  const cerrarModalVacante = document.getElementById('cerrarModalVacante');
  const cancelarModalVacante = document.getElementById('cancelarModalVacante');
  const btnGuardarVacante = document.getElementById('btnGuardarVacante');

  // Inputs
  const inputNombre = document.getElementById('inputNombreVacante');
  const inputArea = document.getElementById('inputAreaVacante');
  const inputRequisitor = document.getElementById('inputRequisitorVacante');
  const inputTipo = document.getElementById('inputTipoContratacion');
  const inputPrioridad = document.getElementById('inputPrioridad');
  const inputFecha = document.getElementById('inputFechaEstimada');
  const inputComentarios = document.getElementById('inputComentarios');
  const inputTipoProceso = document.getElementById('inputTipoProceso');

  // Filtros
  const filtroVacante = document.getElementById('filtroVacante');
  const filtroRequisitor = document.getElementById('filtroRequisitor');
  const filtroEstatus = document.getElementById('filtroEstatus');
  const filtroGeneral = document.getElementById('filtroGeneral');
  const filtroTipoProceso = document.getElementById('filtroTipoProceso');

  // ===============================
  // 🟢 ABRIR / CERRAR MODAL
  // ===============================
  btnCrear.addEventListener('click', () => {
    vacanteEditando = null;
    modalVacante.classList.add('active');
    inputNombre.focus();
  });

  function cerrarModal() {
    modalVacante.classList.remove('active');
    document.querySelectorAll('.form-vacante input, .form-vacante select, .form-vacante textarea')
      .forEach(el => el.value = '');
    vacanteEditando = null;
  }

  cerrarModalVacante.addEventListener('click', cerrarModal);
  cancelarModalVacante.addEventListener('click', cerrarModal);

  // ===============================
  // 📝 GUARDAR VACANTE (NUEVA O EDITADA)
  // ===============================
  btnGuardarVacante.addEventListener('click', async (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const area = inputArea.value.trim();
    const requisitor = inputRequisitor.value.trim();
    const tipoProceso = inputTipoProceso.value;
    const tipo = inputTipo.value;
    const prioridad = inputPrioridad.value;
    const fecha = inputFecha.value;
    const comentarios = inputComentarios.value.trim();
    const estatus = vacanteEditando ? vacanteEditando.estatus : 'Cargar Descripción de Puesto';


    if (!nombre || !area || !requisitor) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, llena los campos obligatorios.'
      });
      return;
    }

    const vacanteData = { nombre, area, requisitor, tipoProceso, tipo, prioridad, fecha, comentarios, estatus };

    try {
      if (vacanteEditando) {
        // ✏️ EDITAR
        const res = await fetch(`https://gesti-n-de-competencias-backend.onrender.com/api/vacantes/${vacanteEditando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vacanteData)
        });

        if (!res.ok) throw new Error('Error al editar vacante');
        Object.assign(vacanteEditando, vacanteData);

        Swal.fire({
          icon: 'success',
          title: '¡Vacante actualizada!',
          text: 'Los cambios se guardaron correctamente.',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.stopTimer(),
          willClose: () => {
            if (!Swal.isVisible()) {
              Swal.fire({
                icon: 'success',
                title: '¡Vacante actualizada!',
                text: 'Los cambios se guardaron correctamente.',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false
              });
            }
          }
        });
      } else {
        // 🆕 CREAR
        const res = await fetch('https://gesti-n-de-competencias-backend.onrender.com/api/vacantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vacanteData)
        });

        if (!res.ok) throw new Error('Error al crear vacante');
        const data = await res.json();
        vacanteData.id = data.id;
        vacantes.push(vacanteData);

        Swal.fire({
          icon: 'success',
          title: '¡Vacante creada!',
          text: 'La vacante se registró exitosamente.',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.stopTimer(),
          willClose: () => {
            if (!Swal.isVisible()) {
              Swal.fire({
                icon: 'success',
                title: '¡Vacante creada!',
                text: 'La vacante se registró exitosamente.',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false
              });
            }
          }
        });
      }

      renderTabla();
      cerrarModal();
    } catch (err) {
      console.error('❌ Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar la vacante.'
      });
    }
  });

  // ===============================
  // 📊 RENDERIZAR TABLA
  // ===============================
  function renderTabla() {
    listaVacantes.innerHTML = '';

    const filtroNombre = filtroVacante.value.toLowerCase();
    const filtroReq = filtroRequisitor.value.toLowerCase();
    const filtroStatus = filtroEstatus.value;
    const filtroTextGeneral = filtroGeneral.value.toLowerCase();
    const filtroTipoProc = filtroTipoProceso.value;

    vacantes
      .filter(v =>
        v.nombre.toLowerCase().includes(filtroNombre) &&
        v.requisitor.toLowerCase().includes(filtroReq) &&
        (filtroStatus === '' || v.estatus === filtroStatus) &&
        (filtroTipoProc === '' || v.tipoProceso === filtroTipoProc) &&
        (filtroTextGeneral === '' || Object.values(v).some(val =>
          val.toString().toLowerCase().includes(filtroTextGeneral)))
      )
      .forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${v.nombre}</td>
          <td>${v.area}</td>
          <td>${v.requisitor}</td>
          <td>${v.tipoProceso}</td>
          <td>${v.tipo}</td>
          <td>${v.prioridad}</td>
          <td>${v.fecha || '-'}</td>
          <td><span class="badge ${estatusColor(v.estatus)}">${v.estatus}</span></td>
          <td>${v.comentarios || '-'}</td>
          <td>
            ${renderBoton(v)}
            <button class="btn-tabla editar" data-id="${v.id}">✏️ Editar</button>
            <button class="btn-tabla eliminar" data-id="${v.id}">🗑️ Eliminar</button>
          </td>
        `;
        listaVacantes.appendChild(tr);
      });
  }

  function estatusColor(estatus) {
  switch (estatus) {
    case 'Cargar Descripción de Puesto': return 'badge-yellow';
    case 'Registrar Terna': return 'badge-orange';
    case 'Realizar Detección de necesidades': return 'badge-blue';
    case 'En Onboarding': return 'badge-green';
    case 'Plan de desarrollo': return 'badge-brown';
    case 'Terminado': return 'badge-gray';
    default: return '';
  }
}

  function renderBoton(v) {
  let botonEstatus = '';
  switch (v.estatus) {
    case 'Cargar Descripción de Puesto':
      botonEstatus = `<button class="btn-tabla ir" data-id="${v.id}" data-modulo="dp">Cargar Descripción de Puesto</button>`;
      break;
    case 'Registrar Terna':
      botonEstatus = `<button class="btn-tabla ir" data-id="${v.id}" data-modulo="terna">Registrar Terna</button>`;
      break;
    case 'Realizar Detección de necesidades':
      botonEstatus = `<button class="btn-tabla ir" data-id="${v.id}" data-modulo="dnc">Realizar Detección de necesidades</button>`;
      break;
    case 'En Onboarding':
      botonEstatus = `<button class="btn-tabla ir" data-id="${v.id}" data-modulo="onboarding">En Onboarding</button>`;
      break;
    case 'Plan de desarrollo':
      botonEstatus = `<button class="btn-tabla ir" data-id="${v.id}" data-modulo="plan">Plan de desarrollo</button>`;
      break;
    case 'Terminado':
      botonEstatus = `<button class="btn-tabla ir disabled" data-id="${v.id}">✔ Terminado</button>`;
      break;
  }
  return botonEstatus;
}



  // ===============================
  // 🔍 FILTROS EN TIEMPO REAL
  // ===============================
  [filtroVacante, filtroRequisitor, filtroEstatus, filtroGeneral, filtroTipoProceso]
    .forEach(el => el.addEventListener('input', renderTabla));

  // ===============================
  // 📌 REDIRECCIONES Y BOTONES
  // ===============================
  listaVacantes.addEventListener('click', (e) => {
    if (e.target.classList.contains('ir')) {
      const id = parseInt(e.target.dataset.id);
      const modulo = e.target.dataset.modulo;
      redirigir(id, modulo);
    }

    if (e.target.classList.contains('editar')) {
      const id = parseInt(e.target.dataset.id);
      editarVacante(id);
    }

    if (e.target.classList.contains('eliminar')) {
      const id = parseInt(e.target.dataset.id);
      eliminarVacante(id);
    }
  });

  function redirigir(id, modulo) {
  const v = vacantes.find(v => v.id === id);
  if (!v) return;

  localStorage.setItem('vacanteSeleccionada', JSON.stringify(v));

  switch (modulo) {
    case 'dp':
      window.location.href = 'dp.html';
      break;
    case 'terna':
      window.location.href = 'dp.html'; // Ver en readonly
      break;
    case 'dnc':
      window.location.href = 'dnc.html';
      break;
    case 'onboarding':
      window.location.href = 'pd.html';
      break;
    case 'plan':
      window.location.href = 'pd.html';
      break;
  }
}


  // ===============================
  // 📥 CARGAR VACANTES INICIALES
  // ===============================
  async function cargarVacantes() {
    try {
      const res = await fetch('https://gesti-n-de-competencias-backend.onrender.com/api/vacantes');
      const data = await res.json();
      vacantes = data;
      renderTabla();
    } catch (err) {
      console.error('❌ Error al cargar vacantes:', err);
    }
  }

  cargarVacantes();

  // ===============================
  // ✏️ EDITAR VACANTE (ABRIR MODAL CON DATOS)
  // ===============================
  window.editarVacante = (id) => {
    const vacante = vacantes.find(v => v.id === id);
    if (!vacante) return;

    vacanteEditando = vacante;
    inputNombre.value = vacante.nombre;
    inputArea.value = vacante.area;
    inputRequisitor.value = vacante.requisitor;
    inputTipoProceso.value = vacante.tipoProceso;
    inputTipo.value = vacante.tipo;
    inputPrioridad.value = vacante.prioridad;
    inputFecha.value = vacante.fecha || '';
    inputComentarios.value = vacante.comentarios;

    modalVacante.classList.add('active');
    inputNombre.focus();
  };
});

// ===============================
// 🗑️ ELIMINAR VACANTE CON SWEETALERT
// ===============================
async function eliminarVacante(id) {
  const confirmacion = await Swal.fire({
    title: '¿Eliminar esta vacante?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    allowEscapeKey: false
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const res = await fetch(`https://gesti-n-de-competencias-backend.onrender.com/api/vacantes/${id}`, { method: 'DELETE' });
    await res.json();

    vacantes = vacantes.filter(v => v.id !== id);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await Swal.fire({
      icon: 'success',
      title: '¡Eliminada!',
      text: 'La vacante fue eliminada correctamente.',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.stopTimer(),
      willClose: () => {
        if (!Swal.isVisible()) {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminada!',
            text: 'La vacante fue eliminada correctamente.',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      }
    });
  } catch (err) {
    console.error('❌ Error al eliminar:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la vacante.'
    });
  }
}
