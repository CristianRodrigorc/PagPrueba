fetch('js/arbol.json')
  .then(response => response.json())
  .then(data => {
    const comunidadSelect = document.getElementById('comuauto');
    const provinciaSelect = document.getElementById('provincia');
    const municipioSelect = document.getElementById('municipio');

    // Cargar Comunidades Autónomas
    data.forEach(comunidad => {
      const option = document.createElement('option');
      option.value = comunidad.label; // ⬅️ Usamos el NOMBRE como valor
      option.textContent = comunidad.label;
      comunidadSelect.appendChild(option);
    });

    // Cambiar Comunidad → Provincias
    comunidadSelect.addEventListener('change', () => {
      provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
      municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';

      const comunidad = data.find(c => c.label === comunidadSelect.value); // ⬅️ Buscamos por label
      if (comunidad) {
        comunidad.provinces.forEach(provincia => {
          const option = document.createElement('option');
          option.value = provincia.label; // ⬅️ Nombre como value
          option.textContent = provincia.label;
          provinciaSelect.appendChild(option);
        });
      }
    });

    // Cambiar Provincia → Municipios
    provinciaSelect.addEventListener('change', () => {
      municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';

      const comunidad = data.find(c => c.label === comunidadSelect.value);
      if (comunidad) {
        const provincia = comunidad.provinces.find(p => p.label === provinciaSelect.value); // ⬅️ por label
        if (provincia) {
          provincia.towns.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.label; // ⬅️ Nombre como value
            option.textContent = municipio.label;
            municipioSelect.appendChild(option);
          });
        }
      }
    });

    // EJEMPLO: Envío de los valores al hacer clic
    document.getElementById('submit-button').addEventListener('click', () => {
      const comunidad = comunidadSelect.value;
      const provincia = provinciaSelect.value;
      const municipio = municipioSelect.value;

      // Estos son los NOMBRES ya
      console.log('Enviando:');
      console.log('Comunidad:', comunidad);
      console.log('Provincia:', provincia);
      console.log('Municipio:', municipio);

      // Aquí puedes hacer fetch o enviar con FormData
    });
  })
  .catch(error => console.error('Error al cargar arbol.json:', error));