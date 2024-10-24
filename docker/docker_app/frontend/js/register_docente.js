document.getElementById('registerDocenteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register_docente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, apellido, email, password })
    });

    if (response.ok) {
        alert('Docente registrado con éxito');
    } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
    }
});
