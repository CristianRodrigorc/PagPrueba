fetch('js/arbol.json')
  .then(response => response.json())
  .then(data => {
    const comunidadSelect = document.getElementById('comuauto');
    const provinciaSelect = document.getElementById('provincia');
    const municipioSelect = document.getElementById('municipio');

    let selectedComunidad = '';
    let selectedProvincia = '';
    let selectedMunicipio = '';

    // Cargar las Comunidades Autónomas
    data.forEach(comunidad => {
      const option = document.createElement('option');
      option.value = comunidad.code; // Usamos el código, pero el nombre es lo que mostramos
      option.textContent = comunidad.label;
      comunidadSelect.appendChild(option);
    });

    // Cambiar Comunidad Autónoma → Provincias
    comunidadSelect.addEventListener('change', () => {
      provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
      municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      if (comunidad) {
        selectedComunidad = comunidad.label;  // Guardamos el nombre de la comunidad
        comunidad.provinces.forEach(provincia => {
          const option = document.createElement('option');
          option.value = provincia.code;  // Usamos el código, pero el nombre es lo que mostramos
          option.textContent = provincia.label;
          provinciaSelect.appendChild(option);
        });
      }
    });

    // Cambiar Provincia → Municipios
    provinciaSelect.addEventListener('change', () => {
      municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      if (comunidad) {
        const provincia = comunidad.provinces.find(p => p.code === provinciaSelect.value);
        if (provincia) {
          selectedProvincia = provincia.label;  // Guardamos el nombre de la provincia
          provincia.towns.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.code;  // Usamos el código, pero el nombre es lo que mostramos
            option.textContent = municipio.label;
            municipioSelect.appendChild(option);
          });
        }
      }
    });

    // Cambiar Municipio seleccionado
    municipioSelect.addEventListener('change', () => {
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      if (comunidad) {
        const provincia = comunidad.provinces.find(p => p.code === provinciaSelect.value);
        if (provincia) {
          const municipio = provincia.towns.find(t => t.code === municipioSelect.value);
          if (municipio) {
            selectedMunicipio = municipio.label;  // Guardamos el nombre del municipio
          }
        }
      }
    });

    // Función para obtener el nombre de la Comunidad Autónoma seleccionada
    function getSelectedComunidadName() {
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      return comunidad ? comunidad.label : '';
    }

    // Función para obtener el nombre de la Provincia seleccionada
    function getSelectedProvinciaName() {
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      if (comunidad) {
        const provincia = comunidad.provinces.find(p => p.code === provinciaSelect.value);
        return provincia ? provincia.label : '';
      }
      return '';
    }

    // Función para obtener el nombre del Municipio seleccionado
    function getSelectedMunicipioName() {
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      if (comunidad) {
        const provincia = comunidad.provinces.find(p => p.code === provinciaSelect.value);
        if (provincia) {
          const municipio = provincia.towns.find(t => t.code === municipioSelect.value);
          return municipio ? municipio.label : '';
        }
      }
      return '';
    }

    // Puedes usar estas funciones para obtener los nombres seleccionados y enviarlos al backend.
    // Ejemplo de uso:
    document.getElementById('submit-button').addEventListener('click', () => {
      const comunidadName = getSelectedComunidadName();
      const provinciaName = getSelectedProvinciaName();
      const municipioName = getSelectedMunicipioName();
      
      // Aquí puedes enviar los nombres al backend:
      console.log(`Comunidad: ${comunidadName}, Provincia: ${provinciaName}, Municipio: ${municipioName}`);

      // Ejemplo de envío (si tienes un formulario):
      // const formData = new FormData();
      // formData.append('comunidad', comunidadName);
      // formData.append('provincia', provinciaName);
      // formData.append('municipio', municipioName);
      // fetch('/backend-url', { method: 'POST', body: formData });
    });

  })
  .catch(error => console.error('Error al cargar arbol.json:', error));
