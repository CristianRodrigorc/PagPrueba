// Función de validación del formulario y envío de datos al servidor
function validarFormulario(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const telefono = document.getElementById("phone").value;
    const terminos = document.getElementById("terminos").checked;
    const contacto = document.getElementById("contacto").checked;

    // Validación de email y teléfono
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexTelefono = /^[0-9]{9}$/;

    if (!regexEmail.test(email)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }

    if (!regexTelefono.test(telefono)) {
        alert("Por favor ingresa un número de teléfono válido.");
        return;
    }

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

    // Enviar datos al backend para guardar en el Excel
    fetch('http://localhost:3000/api/guardarFormulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosFormulario),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Mostrar mensaje de éxito
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al enviar los datos. Inténtalo de nuevo.');
    });
}

// Asociar la función de validación al evento de envío del formulario
document.querySelector(".contact-form").addEventListener("submit", validarFormulario);