document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reservaEstudianteForm');
    const aulaSelect = document.getElementById('aula_id');
    const horarioDisponible = document.getElementById('horario_disponible');
  
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
  
      const aula_id = document.getElementById('aula_id').value;
      const fecha_reserva = document.getElementById('fecha_reserva').value;
      const hora_inicio = document.getElementById('hora_inicio').value;
      const hora_fin = document.getElementById('hora_fin').value;
  
      const response = await fetch('/reserva/estudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aula_id, fecha_reserva, hora_inicio, hora_fin })
      });
  
      if (response.ok) {
        alert('Reserva realizada con éxito');
        window.location.href = '/mis_reservas'; // Redirigir a la página de reservas del usuario
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    });
  
    // Comprobar disponibilidad del aula/laboratorio
    form.addEventListener('change', async function () {
      const aula_id = document.getElementById('aula_id').value;
      const fecha_reserva = document.getElementById('fecha_reserva').value;
      const hora_inicio = document.getElementById('hora_inicio').value;
      const hora_fin = document.getElementById('hora_fin').value;
  
      const response = await fetch(`/disponibilidad/${aula_id}/${fecha_reserva}/${hora_inicio}/${hora_fin}`);
      const data = await response.json();
  
      if (data.disponible) {
        horarioDisponible.textContent = 'Horario disponible';
        horarioDisponible.style.color = 'green';
      } else {
        horarioDisponible.textContent = 'Horario no disponible';
        horarioDisponible.style.color = 'red';
      }
    });
  });
  