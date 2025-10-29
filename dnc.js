const categorias = ["Conocimientos básicos", "Conocimientos específicos", "Soft skills"];
const habilidades = [];
const candidatos = [];

const encabezado = document.getElementById('encabezado');
const cuerpo = document.getElementById('cuerpoTabla');

// ===============================
// 📥 CARGAR DATOS DE VACANTE DESDE LOCALSTORAGE
// ===============================
// ===============================
// 📌 CARGAR VACANTE SELECCIONADA
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const vacanteSeleccionada = JSON.parse(localStorage.getItem('vacanteSeleccionada'));

  if (vacanteSeleccionada) {
    // Muestra la información de la vacante en los inputs correspondientes
    document.getElementById('nombreVacante').value = vacanteSeleccionada.nombre;
    document.getElementById('areaVacante').value = vacanteSeleccionada.area;
    document.getElementById('requisitorVacante').value = vacanteSeleccionada.requisitor;
    document.getElementById('tipoProcesoVacante').value = vacanteSeleccionada.tipoProceso;
    document.getElementById('tipoContratacionVacante').value = vacanteSeleccionada.tipo;
    document.getElementById('prioridadVacante').value = vacanteSeleccionada.prioridad;
    document.getElementById('fechaEstimadaVacante').value = vacanteSeleccionada.fecha || '';
    document.getElementById('comentariosVacante').value = vacanteSeleccionada.comentarios || '';
  }
});



// Agregar habilidad
document.getElementById('agregarHabilidad').addEventListener('click', () => {
  const habilidad = document.getElementById('habilidad').value.trim();
  const nivelRequerido = parseInt(document.getElementById('nivelRequerido').value);
  const categoria = document.getElementById('categoria').value;

  if (habilidad && !isNaN(nivelRequerido)) {
    habilidades.push({ habilidad, nivelRequerido, categoria });
    renderTabla();
    document.getElementById('habilidad').value = '';
    document.getElementById('nivelRequerido').value = '';
  }
});

// Agregar candidato
document.getElementById('agregarCandidato').addEventListener('click', () => {
  const nombre = document.getElementById('candidato').value.trim();
  if (nombre) {
    const niveles = habilidades.map(() => 0);
    candidatos.push({ nombre, niveles });
    renderTabla();
    document.getElementById('candidato').value = '';
  }
});

// Ordenar
document.getElementById('ordenar').addEventListener('click', () => {
  candidatos.sort((a, b) => calcularTotal(b) - calcularTotal(a));
  renderTabla();
});

// Render de tabla
function renderTabla() {
  // Render encabezado
  encabezado.innerHTML = `<th>Item</th><th>Candidato</th>`;
  habilidades.forEach((h, i) => {
    const th = document.createElement('th');
    th.classList.add('habilidad');
    th.innerHTML = `${h.habilidad}<br><small>Req ${h.nivelRequerido}</small>`;
    encabezado.appendChild(th);
  });
  const thTotal = document.createElement('th');
  thTotal.textContent = "Total";
  encabezado.appendChild(thTotal);

  // Render filas
  cuerpo.innerHTML = '';
  const mejorTotal = Math.max(...candidatos.map(calcularTotal), 0);

  candidatos.forEach((c, index) => {
    const tr = document.createElement('tr');
    if (calcularTotal(c) === mejorTotal) tr.classList.add('destacado');

    const tdItem = document.createElement('td');
    tdItem.textContent = index + 1;
    tr.appendChild(tdItem);

    const tdNombre = document.createElement('td');
    tdNombre.textContent = c.nombre;
    tr.appendChild(tdNombre);

    c.niveles.forEach((nivel, i) => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 4;
      input.value = nivel;
      input.addEventListener('input', () => {
        c.niveles[i] = parseInt(input.value) || 0;
        renderTabla();
      });

      const cumplimiento = calcularCumplimiento(input.value, habilidades[i].nivelRequerido);
      td.appendChild(input);
      td.insertAdjacentText('beforeend', ` (${cumplimiento.toFixed(0)}%)`);
      tr.appendChild(td);
    });

    const tdTotal = document.createElement('td');
    tdTotal.classList.add('total');
    tdTotal.textContent = `${calcularTotal(c).toFixed(0)}%`;
    tr.appendChild(tdTotal);

    cuerpo.appendChild(tr);
  });
}

// Cálculo de % por habilidad
function calcularCumplimiento(actual, requerido) {
  if (requerido === 0) return 100;
  return Math.min((actual / requerido) * 100, 100);
}

// Cálculo de total
function calcularTotal(candidato) {
  if (habilidades.length === 0) return 0;
  const total = candidato.niveles.reduce((acc, val, i) => {
    return acc + calcularCumplimiento(val, habilidades[i].nivelRequerido);
  }, 0);
  return total / habilidades.length;
}

document.getElementById('btnPlanDesarrollo').addEventListener('click', () => {
  const vacante = JSON.parse(localStorage.getItem('vacanteSeleccionada'));
  vacante.estatus = 'En Onboarding';
  localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacante));
  fetch(`http://localhost:3000/api/vacantes/${vacante.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vacante)
  }).then(() => window.location.href = 'index.html');
});

