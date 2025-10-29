// ============================
// 📌 PLAN DE DESARROLLO - JS (con popup de confirmación)
// ============================

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('planGrid');
  const btnAgregar = document.getElementById('agregarHabilidadBtn');

  // Cambiar texto del botón
  btnAgregar.textContent = 'Agregar habilidad a desarrollar';

  // 📌 Renumerar la columna iTeam
  function renumerar() {
    const celdasIteam = grid.querySelectorAll('.celda-iteam .item-num');
    celdasIteam.forEach((span, idx) => {
      span.textContent = String(idx + 1);
    });
  }

  // 📌 Agregar nueva fila
  btnAgregar.addEventListener('click', () => {
    const numero = grid.querySelectorAll('.celda-iteam').length + 1;

    const filaHTML = `
      <!-- Col 1: iTeam + eliminar -->
      <div class="celda celda-iteam">
        <div class="celda-flex">
          <span class="item-num">${numero}</span>
          <button class="btn-eliminar" title="Eliminar esta fila">
            <span class="material-icons-outlined">delete</span>
          </button>
        </div>
      </div>

      <!-- Col 2: Habilidad -->
      <div class="celda"><input type="text" placeholder="Nueva habilidad"></div>

      <!-- Col 3: Método -->
      <div class="celda">
        <select>
          <option value="">Seleccione...</option>
          <option>Shadow</option>
          <option>Coaching</option>
          <option>Mentoring</option>
          <option>Buddy</option>
          <option>Project</option>
          <option>Read</option>
          <option>Course</option>
        </select>
      </div>

      <!-- Col 4: Frecuencia -->
      <div class="celda">
        <select>
          <option value="">Seleccione...</option>
          ${Array.from({ length: 10 }, (_, i) => `<option>${i + 1} vez${i ? 'es' : ''}</option>`).join('')}
        </select>
      </div>

      <!-- Col 5: Periodicidad -->
      <div class="celda">
        <select>
          <option value="">Seleccione...</option>
          <option>Diario</option>
          <option>Semanal</option>
          <option>Quincenal</option>
          <option>Mensual</option>
          <option>Bimestral</option>
          <option>Trimestral</option>
        </select>
      </div>

      <!-- Col 6: Fecha inicio -->
      <div class="celda"><input type="date"></div>

      <!-- Col 7: Fecha fin -->
      <div class="celda"><input type="date"></div>

      <!-- Col 8: Cumplimiento -->
      <div class="celda">
        <select>
          <option value="">Seleccione...</option>
          <option>Sí</option>
          <option>No</option>
        </select>
      </div>
    `;

    grid.insertAdjacentHTML('beforeend', filaHTML);
  });

  // 📌 Delegar evento para botón eliminar
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-eliminar');
    if (!btn) return;

    // Mostrar popup
    mostrarPopupConfirmacion(() => {
      const celdaIteam = btn.closest('.celda-iteam');
      const children = Array.from(grid.children);
      const startIndex = children.indexOf(celdaIteam);

      // Eliminar las 8 celdas correspondientes a la fila
      for (let i = 0; i < 8; i++) {
        grid.removeChild(grid.children[startIndex]);
      }

      // Renumerar
      renumerar();
    });
  });

  // 📌 Popup de confirmación
  function mostrarPopupConfirmacion(onConfirm) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    // Contenido del popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <p>¿Estás seguro de que deseas eliminar esta actividad?</p>
      <div class="popup-actions">
        <button class="btn-confirmar">✅ Confirmar</button>
        <button class="btn-cancelar">❌ Cancelar</button>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Acciones
    popup.querySelector('.btn-confirmar').addEventListener('click', () => {
      onConfirm();
      overlay.remove();
    });

    popup.querySelector('.btn-cancelar').addEventListener('click', () => {
      overlay.remove();
    });
  }
});

document.getElementById('btnTerminarPD').addEventListener('click', () => {
  const vacante = JSON.parse(localStorage.getItem('vacanteSeleccionada'));
  vacante.estatus = 'Terminado';
  localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacante));
  fetch(`http://localhost:3000/api/vacantes/${vacante.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vacante)
  }).then(() => window.location.href = 'index.html');
});
