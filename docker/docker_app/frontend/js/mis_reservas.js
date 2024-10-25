document.addEventListener('DOMContentLoaded', function () {
  const reservasTableBody = document.querySelector('#reservasTable tbody');

  // Cargar reservas del usuario desde el servidor
  fetch('/mis_reservas/datos')  // Llama a la ruta correcta que devuelve los datos JSON
    .then(response => response.json())  // Verificar que la respuesta es JSON
    .then(data => {
      data.forEach(reserva => {
        const row = document.createElement('tr');  

        // Columna de Número de Reserva
        const numReservaCell = document.createElement('td');
        numReservaCell.textContent = reserva.id_reserva || reserva.id_cambio;  // Para cambios de salón (docentes)
        row.appendChild(numReservaCell);

        // Columna de Aula/Laboratorio
        const aulaCell = document.createElement('td');
        aulaCell.textContent = `${reserva.tipo}: ${reserva.nombre_numero} (${reserva.ubicacion})`;
        row.appendChild(aulaCell);

        // Columna de Hora de Inicio
        const horaInicioCell = document.createElement('td');
        horaInicioCell.textContent = reserva.hora_inicio;
        row.appendChild(horaInicioCell);

        // Columna de Hora de Fin
        const horaFinCell = document.createElement('td');
        horaFinCell.textContent = reserva.hora_fin;
        row.appendChild(horaFinCell);

        // Columna de Estado
        const estadoCell = document.createElement('td');
        const currentDate = new Date();
        const reservaDate = new Date(reserva.fecha_reserva + ' ' + reserva.hora_inicio);

        if (reserva.estado === 1) {
          estadoCell.textContent = 'Cancelado';
        } else if (reservaDate > currentDate) {
          estadoCell.textContent = 'Próximamente';
        } else {
          estadoCell.textContent = 'Ya pasó';
        }
        
        row.appendChild(estadoCell);

        // Columna de Acción
        const accionCell = document.createElement('td');
        if (reserva.estado !== 'cancelado' && reservaDate > currentDate) {
          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancelar Reserva';
          cancelButton.addEventListener('click', function () {
            cancelarReserva(reserva.id_reserva || reserva.id_cambio);  // Para cancelar tanto reserva como cambio de salón
          });
          accionCell.appendChild(cancelButton);
        }
        row.appendChild(accionCell);

        reservasTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al cargar las reservas:', error);
      alert('Error al cargar las reservas');
    });

  // Función para cancelar reserva
  function cancelarReserva(idReserva) {
    fetch(`/cancelar_reserva/${idReserva}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        alert('Reserva cancelada con éxito');
        location.reload(); // Recargar la página para actualizar la lista de reservas
      } else {
        alert('Error al cancelar la reserva');
      }
    })
    .catch(error => {
      console.error('Error al cancelar la reserva:', error);
      alert('Error al cancelar la reserva');
    });
  }
});
