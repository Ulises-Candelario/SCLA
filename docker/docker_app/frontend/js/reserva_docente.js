document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('reservaDocenteForm');
  const horarioSelect = document.getElementById('horario_clase');
  const aulaSelect = document.getElementById('aula_nueva');

  // Cargar el horario del docente basado en su sesión
  fetch('/horario_docente')
    .then(response => response.json())
    .then(data => {
      data.forEach(clase => {
        const option = document.createElement('option');
        option.value = clase.id_horario;
        option.textContent = `Clase: ${clase.dia_semana} de ${clase.hora_inicio} a ${clase.hora_fin}`;
        horarioSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar los horarios:', error);
      alert('Error al cargar los horarios');
    });

  // Cargar aulas/laboratorios disponibles
  fetch('/aulas_laboratorios')
    .then(response => response.json())
    .then(data => {
      data.forEach(aula => {
        const option = document.createElement('option');
        option.value = aula.id_lugar;
        option.textContent = `${aula.tipo}: ${aula.nombre_numero} (${aula.ubicacion})`;
        aulaSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar las aulas/laboratorios:', error);
      alert('Error al cargar las aulas/laboratorios');
    });

  // Manejar el evento de envío del formulario
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const horario_clase = document.getElementById('horario_clase').value;
    const aula_nueva = document.getElementById('aula_nueva').value;
  
    const response = await fetch('/reserva/docente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horario_clase, aula_nueva })
    });
  
    if (response.ok) {
      alert('Cambio de aula/laboratorio realizado con éxito');
      window.location.href = '/mis_reservas_docente';
    } else {
      alert('Error al realizar el cambio');
    }
  });  
});
