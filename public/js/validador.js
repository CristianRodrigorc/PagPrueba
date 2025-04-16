document.addEventListener('DOMContentLoaded', () => {
  // Función de validación para los formularios
  const validateForm = (form, fields) => {
    let isValid = true;
    let errorMessages = [];

    fields.forEach(field => {
      const element = document.getElementById(field.id);
      const errorMessage = field.validate(element);
      if (errorMessage) {
        isValid = false;
        errorMessages.push(errorMessage);
      }
    });

    // Mostrar errores si existen
    if (!isValid) {
      alert(errorMessages.join("\n"));
    }

    return isValid;
  };

  // Formulario 1 - Trabaja con nosotros
  const formulario1 = document.querySelector('.contact-form.form-validate');
  if (formulario1) {
    formulario1.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = [
        { id: 'firstName', validate: (input) => input.value.trim() ? null : "El nombre es obligatorio." },
        { id: 'lastName', validate: (input) => input.value.trim() ? null : "El apellido es obligatorio." },
        { id: 'email', validate: (input) => !input.value.trim() ? "El correo es obligatorio." : (!input.value.includes('@') ? "El correo debe ser válido." : null) },
        { id: 'phone', validate: (input) => input.value.trim() ? null : "El teléfono es obligatorio." },
        { id: 'terminos', validate: (input) => !input.checked ? "Debe aceptar los términos y condiciones." : null },
        { id: 'contacto', validate: (input) => !input.checked ? "Debe aceptar recibir información." : null }
      ];

      if (validateForm(formulario1, fields)) {
        formulario1.submit();
      }
    });
  }

  // Formulario 2 - Mejoremos tu Factura
  const formulario2 = document.querySelector('.contact-form.form-validate2');
  if (formulario2) {
    formulario2.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = [
        { id: 'firstName', validate: (input) => input.value.trim() ? null : "El nombre es obligatorio." },
        { id: 'lastName', validate: (input) => input.value.trim() ? null : "El apellido es obligatorio." },
        { id: 'email', validate: (input) => !input.value.trim() ? "El correo es obligatorio." : (!input.value.includes('@') ? "El correo debe ser válido." : null) },
        { id: 'phone', validate: (input) => input.value.trim() ? null : "El teléfono es obligatorio." },
        { id: 'empresa', validate: (input) => input.value.trim() ? null : "La empresa es obligatoria." },
        { id: 'comuauto', validate: (input) => input.value.trim() ? null : "La comunidad autónoma es obligatoria." },
        { id: 'provincia', validate: (input) => input.value.trim() ? null : "La provincia es obligatoria." },
        { id: 'municipio', validate: (input) => input.value.trim() ? null : "El municipio es obligatorio." },
        { id: 'cod-postal', validate: (input) => input.value.trim() ? null : "El código postal es obligatorio." },
        { id: 'direccion', validate: (input) => input.value.trim() ? null : "La dirección es obligatoria." },
        { id: 'terminos', validate: (input) => !input.checked ? "Debe aceptar los términos y condiciones." : null },
        { id: 'contacto', validate: (input) => !input.checked ? "Debe aceptar recibir información." : null }
      ];

      if (validateForm(formulario2, fields)) {
        formulario2.submit();
      }
    });
  }
});
