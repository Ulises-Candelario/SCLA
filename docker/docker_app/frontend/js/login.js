document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los datos del formulario
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Enviar los datos al servidor
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Convertir los datos a JSON
    });

    // Manejar la respuesta del servidor
    if (response.ok) {
        const data = await response.text(); // Recibir el mensaje del servidor
        alert(data); // Mostrar el mensaje en una alerta
        // Aquí puedes redirigir al usuario o manejar el éxito del login
    } else {
        const errorText = await response.text(); // Obtener el texto del error
        alert(`Error: ${errorText}`); // Mostrar el error en una alerta
    }
});
