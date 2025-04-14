document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const btnEnviar = document.getElementById("btnEnviar");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Desactivar botón y cambiar texto
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";

        // Obtener valores
        const formData = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            empresa: form.empresa?.value.trim() || "",
            comunidad: form.comuauto?.value || "",
            provincia: form.provincia?.value || "",
            municipio: form.municipio?.value || "",
            codPostal: form["cod-postal"]?.value.trim() || "",
            direccion: form.direccion?.value.trim() || "",
            terminos: form.terminos.checked,
            contacto: form.contacto.checked
        };

        // Validaciones
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefono = /^[0-9]{9}$/;

        if (!regexEmail.test(formData.email)) {
            alert("Por favor ingresa un correo electrónico válido.");
            activarBoton(); return;
        }

        if (!regexTelefono.test(formData.phone)) {
            alert("Por favor ingresa un número de teléfono válido (9 dígitos).");
            activarBoton(); return;
        }

        if (!formData.terminos) {
            alert("Debes aceptar los términos y condiciones.");
            activarBoton(); return;
        }

        if (!formData.contacto) {
            alert("Debes aceptar recibir información para continuar.");
            activarBoton(); return;
        }

        // Enviar datos
        fetch('http://localhost:3000/api/guardarFormulario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            alert(data.message || "Formulario enviado con éxito.");
            form.reset();
            btnEnviar.textContent = "Enviado ✅";
        })
        .catch(err => {
            console.error("Error al enviar los datos:", err);
            alert("Ocurrió un error al enviar los datos. Intenta más tarde.");
            activarBoton();
        });

        // Función para reactivar el botón
        function activarBoton() {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar";
        }
    });
});
