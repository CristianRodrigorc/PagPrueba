// Función que valida el formulario y envía los datos al servidor
function validarFormulario(event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("phone").value;
    const terminos = document.getElementById("terminos").checked;
    const contacto = document.getElementById("contacto").checked;

    // Validar que el email tenga formato correcto
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }

    // Validar que el teléfono tenga 9 números
    const regexTelefono = /^[0-9]{9}$/;
    if (!regexTelefono.test(telefono)) {
        alert("Por favor ingresa un número de teléfono válido.");
        return;
    }

    // Validar que se acepten los términos y el contacto
    if (!terminos || !contacto) {
        alert("Debes aceptar tanto los términos y condiciones como la política de contacto.");
        return;
    }

    // Crear objeto con los datos del formulario
    const datosFormulario = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: email,
        phone: telefono,
        terminos: terminos,
        contacto: contacto
    };

    // Detectar si estamos en local o producción
    const apiBaseUrl = window.location.hostname.includes('localhost')
        ? 'http://localhost:3000' // Si es local, usamos el servidor local
        : 'https://pagprueba.onrender.com'; // Si es producción, usamos el servidor de Render

    // Enviar datos al backend (al endpoint /api/guardarFormulario)
    fetch(`${apiBaseUrl}/api/guardarFormulario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosFormulario),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Mostrar mensaje que viene del servidor (éxito)
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al enviar los datos. Inténtalo de nuevo.');
    });
}

// Asociar la función a la acción de enviar el formulario
document.querySelector(".contact-form").addEventListener("submit", validarFormulario);
