document.addEventListener('DOMContentLoaded', () => {
  // Validación del primer formulario
  const formulario1 = document.querySelector('.contact-form.form-validate'); // Primer formulario
  if (formulario1) {
      formulario1.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // Obtener campos del primer formulario
          const firstName = document.getElementById('firstName');
          const lastName = document.getElementById('lastName');
          const email = document.getElementById('email');
          const phone = document.getElementById('phone');
          const terminos = document.getElementById('terminos');
          const contacto = document.getElementById('contacto');

          // Validación básica para cada campo
          if (!firstName.value.trim()) {
              isValid = false;
              alert("El nombre es obligatorio.");
          }

          if (!lastName.value.trim()) {
              isValid = false;
              alert("El apellido es obligatorio.");
          }

          if (!email.value.trim() || !email.value.includes('@')) {
              isValid = false;
              alert("El correo es obligatorio y debe ser válido.");
          }

          if (!phone.value.trim()) {
              isValid = false;
              alert("El teléfono es obligatorio.");
          }

          if (!terminos.checked) {
              isValid = false;
              alert("Debe aceptar los términos y condiciones.");
          }

          if (!contacto.checked) {
              isValid = false;
              alert("Debe aceptar recibir información.");
          }

          if (isValid) {
              formulario1.submit();  // Si todo es válido, enviar formulario
          }
      });
  }

  // Validación del segundo formulario
  const formulario2 = document.querySelector('.contact-form.form-validate2'); // Segundo formulario
  if (formulario2) {
      formulario2.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // Obtener campos del segundo formulario
          const firstName2 = document.getElementById('firstName');
          const lastName2 = document.getElementById('lastName');
          const email2 = document.getElementById('email');
          const phone2 = document.getElementById('phone');
          const empresa = document.getElementById('empresa');
          const comuauto = document.getElementById('comuauto');
          const provincia = document.getElementById('provincia');
          const municipio = document.getElementById('municipio');
          const codPostal = document.getElementById('cod-postal');
          const direccion = document.getElementById('direccion');
          const terminos2 = document.getElementById('terminos');
          const contacto2 = document.getElementById('contacto');

          // Validación básica del segundo formulario
          if (!firstName2.value.trim()) {
              isValid = false;
              alert("El nombre es obligatorio.");
          }

          if (!lastName2.value.trim()) {
              isValid = false;
              alert("El apellido es obligatorio.");
          }

          if (!email2.value.trim() || !email2.value.includes('@')) {
              isValid = false;
              alert("El correo es obligatorio y debe ser válido.");
          }

          if (!phone2.value.trim()) {
              isValid = false;
              alert("El teléfono es obligatorio.");
          }

          if (!empresa.value.trim()) {
              isValid = false;
              alert("La empresa es obligatoria.");
          }

          if (!comuauto.value.trim()) {
              isValid = false;
              alert("La comunidad autónoma es obligatoria.");
          }

          if (!provincia.value.trim()) {
              isValid = false;
              alert("La provincia es obligatoria.");
          }

          if (!municipio.value.trim()) {
              isValid = false;
              alert("El municipio es obligatorio.");
          }

          if (!codPostal.value.trim()) {
              isValid = false;
              alert("El código postal es obligatorio.");
          }

          if (!direccion.value.trim()) {
              isValid = false;
              alert("La dirección es obligatoria.");
          }

          if (!terminos2.checked) {
              isValid = false;
              alert("Debe aceptar los términos y condiciones.");
          }

          if (!contacto2.checked) {
              isValid = false;
              alert("Debe aceptar recibir información.");
          }

          if (isValid) {
              formulario2.submit();  // Si todo es válido, enviar formulario
          }
      });
  }
});
