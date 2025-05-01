document.addEventListener('DOMContentLoaded', () => {

    // Función genérica para enviar cualquier formulario
    const enviarFormulario = async (datos, formType, formulario) => {
      const boton = formulario.querySelector('button[type="submit"]');
      boton.classList.add('loading');
      boton.disabled = true;
      boton.textContent = 'Enviando…';
    
      try {
        const response = await fetch('/api/enviarAGoogleSheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formType, ...datos })
        });
    
        const resultado = await response.json();
    
        if (response.ok) {
          alert('Formulario enviado correctamente.');
          formulario.reset();
        } else {
          alert('Error al enviar el formulario: ' + (resultado?.error || 'Error desconocido.'));
        }
      } catch (err) {
        console.error('Error en fetch:', err);
        alert('Error al enviar los datos.');
      } finally {
        boton.classList.remove('loading');
        boton.disabled = false;
        boton.textContent = 'Enviar';
      }
    };
  
    // ========== FORMULARIO 1 ==========
    const form1 = document.querySelector('.form-validate');
    if (form1) {
      form1.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const datos = {
          firstName: document.getElementById('firstName1').value.trim(),
          lastName: document.getElementById('lastName1').value.trim(),
          email: document.getElementById('email1').value.trim(),
          phone: document.getElementById('phone1').value.trim(),
          terminos: document.getElementById('terminos1').checked,
          contacto: document.getElementById('contacto1').checked
        };
  
        if (!datos.firstName || !datos.lastName || !datos.email.includes('@') || !datos.phone) {
          alert('Por favor completa todos los campos requeridos.');
          return;
        }
  
        if (!datos.terminos || !datos.contacto) {
          alert('Debes aceptar los términos y condiciones e información.');
          return;
        }
  
        enviarFormulario(datos, 'form1', form1);
      });
    }
  
    // ========== FORMULARIO 2 ==========
    const form2 = document.querySelector('.form-validate2');
    if (form2) {
      form2.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const datos = {
          firstName: document.getElementById('firstName2').value.trim(),
          lastName: document.getElementById('lastName2').value.trim(),
          email: document.getElementById('email2').value.trim(),
          phone: document.getElementById('phone2').value.trim(),
          empresa: document.getElementById('empresa').value.trim(),
          comuauto: document.getElementById('comuauto').value,
          provincia: document.getElementById('provincia').value,
          municipio: document.getElementById('municipio').value,
          codPostal: document.getElementById('cod-postal').value.trim(),
          direccion: document.getElementById('direccion').value.trim(),
          terminos: document.getElementById('terminos2').checked,
          contacto: document.getElementById('contacto2').checked
        };
  
        if (!datos.firstName || !datos.lastName || !datos.email.includes('@') || !datos.phone) {
          alert('Por favor completa todos los campos requeridos.');
          return;
        }
  
        if (!datos.terminos || !datos.contacto) {
          alert('Debes aceptar los términos y condiciones e información.');
          return;
        }
  
        enviarFormulario(datos, 'form2', form2);
      });
    }
  });  