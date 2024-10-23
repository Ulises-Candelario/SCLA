document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reservaEstudianteForm');
    const aulaSelect = document.getElementById('aula_nueva');

    if (!aulaSelect) {
        console.error('No se pudo encontrar el elemento de selección de aulas.');
        return;
    }

    // Cargar aulas/laboratorios disponibles
    fetch('/aulas_laboratorios')
        .then(response => response.json())
        .then(aulas => {
            if (aulas.length === 0) {
                console.error('No se encontraron aulas/laboratorios disponibles.');
                return;
            }
            aulas.forEach(aula => {
                const option = document.createElement('option');
                option.value = aula.id_lugar;
                option.textContent = aula.nombre_numero + ' - ' + aula.ubicacion;
                aulaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar las aulas/laboratorios:', error);
        });
});
