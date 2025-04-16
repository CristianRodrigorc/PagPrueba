// Detectar si estamos en local o producción
const baseUrl = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://pagprueba.onrender.com";

// Función que valida y envía el formulario
function validarFormulario(event) {
  event.preventDefault(); // Evita que se recargue la página

  const email = document.getElementById("email").value;
  const telefono = document.getElementById("phone").value;
  const terminos = document.getElementById("terminos").checked;
  const contacto = document.getElementById("contacto").checked;

  // Expresiones regulares para validar email y teléfono
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexTelefono = /^[0-9]{9}$/;

  // Validaciones simples
  if (!regexEmail.test(email)) {
    alert("Por favor ingresa un correo electrónico válido.");
    return;
  }

  if (!regexTelefono.test(telefono)) {
    alert("Por favor ingresa un número de teléfono válido (9 dígitos).");
    return;
  }

  if (!terminos || !contacto) {
    alert("Debes aceptar los términos y la política de contacto.");
    return;
  }

  // Recolectar datos del formulario
  const datosFormulario = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: email,
    phone: telefono,
    terminos: terminos,
    contacto: contacto,
  };

  // Enviar datos al backend para guardarlos en Excel local
  fetch(`${baseUrl}/api/guardarFormulario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosFormulario),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Guardado local:", data.message);

      // Luego, enviarlos también a Google Sheets (opcional)
      return fetch(`${baseUrl}/api/enviarAGoogleSheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormulario),
      });
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Guardado en Google Sheets:", data.message);
      alert("¡Datos enviados correctamente!");
    })
    .catch((error) => {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos. Intenta nuevamente.");
    });
}

// Asociar la función al evento del formulario
document
  .querySelector(".contact-form")
  .addEventListener("submit", validarFormulario);
