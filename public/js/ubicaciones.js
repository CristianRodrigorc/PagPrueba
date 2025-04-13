fetch('js/arbol.json')
  .then(response => response.json())
  .then(data => {
    const comunidadSelect = document.getElementById('comuauto');
    const provinciaSelect = document.getElementById('provincia');
    const municipioSelect = document.getElementById('municipio');

    // Cargar las Comunidades Autónomas
    data.forEach(comunidad => {
      const option = document.createElement('option');
      option.value = comunidad.code;
      option.textContent = comunidad.label;
      comunidadSelect.appendChild(option);
    });

    // Cambiar Comunidad Autónoma → Provincias
    comunidadSelect.addEventListener('change', () => {
      provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
      municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
      const comunidad = data.find(c => c.code === comunidadSelect.value);
      if (comunidad) {
        comunidad.provinces.forEach(provincia => {
          const option = document.createElement('option');
          option.value = provincia.code;
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
          provincia.towns.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.code;
            option.textContent = municipio.label;
            municipioSelect.appendChild(option);
          });
        }
      }
    });
  })
  .catch(error => console.error('Error al cargar arbol.json:', error));