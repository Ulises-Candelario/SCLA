document.addEventListener('DOMContentLoaded', function () {
    const cambiosSalonTableBody = document.querySelector('#cambiosSalonTable tbody');
  
    // Cargar cambios de salón del docente desde el servidor
    fetch('/api/mis_reservas/docente')
      .then(response => response.json())  // Verificar que la respuesta es JSON
      .then(data => {
        data.forEach(cambio => {
          const row = document.createElement('tr');
  
          // Columna de Número de Cambio
          const numCambioCell = document.createElement('td');
          numCambioCell.textContent = cambio.id_cambio;
          row.appendChild(numCambioCell);

          // Columna de Aula/Laboratorio Nuevo (única ahora)
          const aulaNuevaCell = document.createElement('td');
          aulaNuevaCell.textContent = cambio.aula_nueva;
          row.appendChild(aulaNuevaCell);
  
          // Columna de Hora de Inicio
          const horaInicioCell = document.createElement('td');
          horaInicioCell.textContent = cambio.hora_inicio;
          row.appendChild(horaInicioCell);
  
          // Columna de Hora de Fin
          const horaFinCell = document.createElement('td');
          horaFinCell.textContent = cambio.hora_fin;
          row.appendChild(horaFinCell);
  
          // Columna de Fecha
          const fechaCell = document.createElement('td');
          fechaCell.textContent = cambio.fecha_cambio;
          row.appendChild(fechaCell);
  
          // Columna de Estado
          const estadoCell = document.createElement('td');
          const currentDate = new Date();
          const cambioDate = new Date(cambio.fecha_cambio + ' ' + cambio.hora_inicio);
  
          if (cambio.cancelada === 1) {
            estadoCell.textContent = 'Cancelado';
          } else if (cambioDate > currentDate) {
            estadoCell.textContent = 'Próximamente';
          } else {
            estadoCell.textContent = 'Ya pasó';
          }
          row.appendChild(estadoCell);
  
          // Columna de Acción
          const accionCell = document.createElement('td');
          if (cambio.cancelada !== 1 && cambioDate > currentDate) {
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar Cambio';
            cancelButton.addEventListener('click', function () {
              cancelarCambio(cambio.id_cambio);
            });
            accionCell.appendChild(cancelButton);
          }
          row.appendChild(accionCell);
  
          cambiosSalonTableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error al cargar los cambios de salón:', error);
        alert('Error al cargar los cambios de salón');
      });
  
    // Función para cancelar un cambio de salón
    function cancelarCambio(idCambio) {
      fetch(`/cancelar_reserva/${idCambio}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          alert('Cambio cancelado con éxito');
          location.reload(); // Recargar la página para actualizar la lista de cambios
        } else {
          alert('Error al cancelar el cambio');
        }
      })
      .catch(error => {
        console.error('Error al cancelar el cambio:', error);
        alert('Error al cancelar el cambio');
      });
    }
  });
