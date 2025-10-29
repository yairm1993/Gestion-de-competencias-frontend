// ============================
// 📄 Visor de CV (ya lo tenías)
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const pdfModal = document.getElementById('pdfModal');
  const pdfViewer = document.getElementById('pdfViewer');
  const cerrarPdfBtn = document.getElementById('cerrarPdfBtn');

  function activarVerCV(input) {
    const btnVerCV = input.closest('div').parentNode.querySelector('.btn-vercv');
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        const fileURL = URL.createObjectURL(file);
        btnVerCV.disabled = false;
        btnVerCV.onclick = () => {
          pdfViewer.src = fileURL;
          pdfModal.classList.add('active');
        };
      } else {
        btnVerCV.disabled = true;
        btnVerCV.onclick = null;
      }
    });
  }

  cerrarPdfBtn.addEventListener('click', () => {
    pdfModal.classList.remove('active');
    pdfViewer.src = '';
  });

  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) {
      pdfModal.classList.remove('active');
      pdfViewer.src = '';
    }
  });

  document.querySelectorAll('.input-cv').forEach(input => activarVerCV(input));

  // ============================
  // 🟩 HABILIDADES DINÁMICAS
  // ============================

  // Función para agregar un campo nuevo
  function agregarHabilidad(bloque) {
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Escribe una habilidad...';
    textarea.classList.add('extra-habilidad');
    bloque.insertBefore(textarea, bloque.querySelector('.habilidad-actions'));
  }

  // Evento global para botones agregar / eliminar
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-habilidad.agregar')) {
      const bloque = e.target.closest('.habilidad-bloque');
      agregarHabilidad(bloque);
    }

    if (e.target.closest('.btn-habilidad.eliminar')) {
      const bloque = e.target.closest('.habilidad-bloque');
      const extras = bloque.querySelectorAll('.extra-habilidad');
      if (extras.length > 0) {
        extras[extras.length - 1].remove();
      } else {
        // Si no hay extra, limpiamos el textarea base
        const base = bloque.querySelector('textarea');
        base.value = '';
      }
    }
  });

  // ============================
  // 💾 GUARDAR HABILIDADES EN LOCALSTORAGE
  // ============================
  const btnGuardar = document.querySelector('.btn-guardar');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      const vacanteSeleccionada = JSON.parse(localStorage.getItem('vacanteSeleccionada'));
      if (!vacanteSeleccionada) {
        alert('❌ No hay una vacante seleccionada.');
        return;
      }

      const habilidades = {
        basicas: [],
        especificas: [],
        blandas: []
      };

      // Obtener habilidades básicas
      const basicasBloque = document.querySelectorAll('.habilidad-bloque')[0];
      basicasBloque.querySelectorAll('textarea').forEach(t => {
        const val = t.value.trim();
        if (val) habilidades.basicas.push(val);
      });

      // Obtener habilidades específicas
      const especificasBloque = document.querySelectorAll('.habilidad-bloque')[1];
      especificasBloque.querySelectorAll('textarea').forEach(t => {
        const val = t.value.trim();
        if (val) habilidades.especificas.push(val);
      });

      // Obtener habilidades blandas
      const blandasBloque = document.querySelectorAll('.habilidad-bloque')[2];
      blandasBloque.querySelectorAll('textarea').forEach(t => {
        const val = t.value.trim();
        if (val) habilidades.blandas.push(val);
      });

      // Validar
      if (
        habilidades.basicas.length === 0 &&
        habilidades.especificas.length === 0 &&
        habilidades.blandas.length === 0
      ) {
        alert('⚠️ Debes ingresar al menos una habilidad.');
        return;
      }

      vacanteSeleccionada.habilidades = habilidades;
      localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacanteSeleccionada));

      alert('✅ Habilidades guardadas correctamente.');
      window.location.href = 'index.html';
    });
  }

  // ============================
  // 📥 RECUPERAR HABILIDADES GUARDADAS
  // ============================
  const vacanteSeleccionada = JSON.parse(localStorage.getItem('vacanteSeleccionada'));
  if (vacanteSeleccionada && vacanteSeleccionada.habilidades) {
    const habilidades = vacanteSeleccionada.habilidades;
    const bloques = document.querySelectorAll('.habilidad-bloque');

    function cargarHabilidades(lista, bloque) {
      if (lista.length > 0) {
        bloque.querySelector('textarea').value = lista[0];
        for (let i = 1; i < lista.length; i++) {
          agregarHabilidad(bloque);
          bloque.querySelectorAll('textarea')[i].value = lista[i];
        }
      }
    }

    cargarHabilidades(habilidades.basicas || [], bloques[0]);
    cargarHabilidades(habilidades.especificas || [], bloques[1]);
    cargarHabilidades(habilidades.blandas || [], bloques[2]);
  }

  // ============================
  // ➕ AGREGAR CANDIDATOS (terna)
  // ============================
  const btnAgregarCandidato = document.getElementById('agregarCandidatoBtn');
  if (btnAgregarCandidato) {
    btnAgregarCandidato.addEventListener('click', () => {
      const nuevaFila = document.createElement('div');
      nuevaFila.classList.add('terna-grid');
      nuevaFila.innerHTML = `
        <div>
          <label>Nombre del colaborador:</label>
          <input type="text" placeholder="Ej. Juan Pérez">
        </div>
        <div>
          <label>Tipo:</label>
          <select>
            <option value="">Seleccione...</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
        </div>
        <div>
          <label>Currículum (PDF):</label>
          <input type="file" accept=".pdf" class="input-cv">
        </div>
        <div class="terna-actions">
          <label>&nbsp;</label>
          <div class="botones-accion">
            <button class="btn-vercv" disabled>
              <span class="material-icons-outlined">description</span> Ver CV
            </button>
            <button class="btn-habilidad eliminar-candidato">
              <span class="material-icons-outlined">delete</span> Eliminar
            </button>
          </div>
        </div>
      `;
      btnAgregarCandidato.before(nuevaFila);
      activarVerCV(nuevaFila.querySelector('.input-cv'));
    });
  }

  // 🗑️ Eliminar candidato
  document.addEventListener('click', (e) => {
    if (e.target.closest('.eliminar-candidato')) {
      e.target.closest('.terna-grid').remove();
    }
  });

  // ===============================
  // 📌 CARGAR DATOS DE VACANTE
  // ===============================
  if (vacanteSeleccionada) {
    document.getElementById('nombreVacante').value = vacanteSeleccionada.nombre;
    document.getElementById('areaVacante').value = vacanteSeleccionada.area;
    document.getElementById('requisitorVacante').value = vacanteSeleccionada.requisitor;
    document.getElementById('tipoProcesoVacante').value = vacanteSeleccionada.tipoProceso;
    document.getElementById('tipoContratacionVacante').value = vacanteSeleccionada.tipo;
    document.getElementById('prioridadVacante').value = vacanteSeleccionada.prioridad;
    document.getElementById('fechaEstimadaVacante').value = vacanteSeleccionada.fecha || '';
    document.getElementById('comentariosVacante').value = vacanteSeleccionada.comentarios || '';
  }

  // ===============================
  // 📌 CAMBIAR ESTATUS
  // ===============================
  document.getElementById('btnGuardarDP').addEventListener('click', () => {
    const vacante = JSON.parse(localStorage.getItem('vacanteSeleccionada'));
    vacante.estatus = 'Registrar Terna';
    localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacante));
    fetch(`http://localhost:3000/api/vacantes/${vacante.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacante)
    }).then(() => window.location.href = 'index.html');
  });

  document.getElementById('btnTerminarDP').addEventListener('click', () => {
    const vacante = JSON.parse(localStorage.getItem('vacanteSeleccionada'));
    vacante.estatus = 'Realizar Detección de necesidades';
    localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacante));
    fetch(`http://localhost:3000/api/vacantes/${vacante.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacante)
    }).then(() => window.location.href = 'index.html');
  });
});
