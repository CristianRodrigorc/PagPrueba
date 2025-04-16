document.addEventListener('DOMContentLoaded', () => {
    // Función de validación para cualquier formulario
    const validateForm = (form, fields) => {
        let isValid = true;
        let errorMessages = [];

        // Validación de cada campo
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input) return; // Si no existe el campo, no hacer nada

            // Validación del campo
            let errorMessage = field.validate(input);
            if (errorMessage) {
                isValid = false;
                errorMessages.push(errorMessage);
            }
        });

        // Si no es válido, mostrar los errores
        if (!isValid) {
            alert(errorMessages.join("\n"));
        }

        return isValid;
    };

    // Función para manejar el envío del formulario
    const handleFormSubmit = (form, fields) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm(form, fields)) {
                form.requestSubmit();  // Enviar el formulario con el método requestSubmit()
            }
        });
    };

    // Validación para el primer formulario
    const formulario1 = document.querySelector('.contact-form.form-validate');
    if (formulario1) {
        const fields1 = [
            { id: 'firstName1', validate: (input) => input.value.trim() ? null : "El nombre es obligatorio." },
            { id: 'lastName1', validate: (input) => input.value.trim() ? null : "El apellido es obligatorio." },
            { id: 'email1', validate: (input) => !input.value.trim() ? "El correo es obligatorio." : (!input.value.includes('@') ? "El correo debe ser válido." : null) },
            { id: 'phone1', validate: (input) => input.value.trim() ? null : "El teléfono es obligatorio." },
            { id: 'terminos1', validate: (input) => !input.checked ? "Debe aceptar los términos y condiciones." : null },
            { id: 'contacto1', validate: (input) => !input.checked ? "Debe aceptar recibir información." : null }
        ];

        handleFormSubmit(formulario1, fields1);
    }

    // Validación para el segundo formulario
    const formulario2 = document.querySelector('.contact-form.form-validate2');
    if (formulario2) {
        const fields2 = [
            { id: 'firstName2', validate: (input) => input.value.trim() ? null : "El nombre es obligatorio." },
            { id: 'lastName2', validate: (input) => input.value.trim() ? null : "El apellido es obligatorio." },
            { id: 'email2', validate: (input) => !input.value.trim() ? "El correo es obligatorio." : (!input.value.includes('@') ? "El correo debe ser válido." : null) },
            { id: 'phone2', validate: (input) => input.value.trim() ? null : "El teléfono es obligatorio." },
            { id: 'empresa', validate: (input) => input.value.trim() ? null : "La empresa es obligatoria." },
            { id: 'comuauto', validate: (input) => input.value.trim() ? null : "La comunidad autónoma es obligatoria." },
            { id: 'provincia', validate: (input) => input.value.trim() ? null : "La provincia es obligatoria." },
            { id: 'municipio', validate: (input) => input.value.trim() ? null : "El municipio es obligatorio." },
            { id: 'cod-postal', validate: (input) => input.value.trim() ? null : "El código postal es obligatorio." },
            { id: 'direccion', validate: (input) => input.value.trim() ? null : "La dirección es obligatoria." },
            { id: 'terminos2', validate: (input) => !input.checked ? "Debe aceptar los términos y condiciones." : null },
            { id: 'contacto2', validate: (input) => !input.checked ? "Debe aceptar recibir información." : null }
        ];

        handleFormSubmit(formulario2, fields2);
    }
});
