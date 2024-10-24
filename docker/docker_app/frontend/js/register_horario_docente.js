document.getElementById('registerHorarioDocenteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const dia_semana = document.getElementById('dia_semana').value;
    const hora_inicio = document.getElementById('hora_inicio').value;
    const hora_fin = document.getElementById('hora_fin').value;
    const aula = document.getElementById('aula').value;

    const response = await fetch('/register_horario_docente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, dia_semana, hora_inicio, hora_fin, aula })
    });

    if (response.ok) {
        alert('Horario registrado con éxito');
    } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
    }
});
