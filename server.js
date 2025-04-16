const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const port = 3000;

// Middleware para parsear cuerpos de solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para servir archivos estáticos (como imágenes, hojas de estilo, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para cargar la página HTML (si tienes un archivo index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar los formularios
app.post('/api/guardarFormulario', (req, res) => {
  const formData = req.body;

  let respuesta = {};

  // Verificar qué formulario fue enviado
  if (formData.formType === 'form1') {
    // Datos del primer formulario
    respuesta = {
      formType: formData.formType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      terminos: formData.terminos ? 'Aceptado' : 'No Aceptado',
      contacto: formData.contacto ? 'Aceptado' : 'No Aceptado',
    };
  } else if (formData.formType === 'form2') {
    // Datos del segundo formulario
    respuesta = {
      formType: formData.formType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      empresa: formData.empresa,
      comuauto: formData.comuauto,
      provincia: formData.provincia,
      municipio: formData.municipio,
      codPostal: formData.codPostal,
      direccion: formData.direccion,
      terminos: formData.terminos ? 'Aceptado' : 'No Aceptado',
      contacto: formData.contacto ? 'Aceptado' : 'No Aceptado',
    };
  } else {
    return res.status(400).json({ message: 'Formulario no reconocido.' });
  }

  // Ruta del archivo Excel
  const filePath = path.join(__dirname, 'formulario_respuestas.xlsx');

  let wb;
  if (fs.existsSync(filePath)) {
    // Si el archivo ya existe, leerlo
    wb = XLSX.readFile(filePath);
  } else {
    // Si el archivo no existe, crear uno nuevo
    wb = XLSX.utils.book_new();
  }

  const sheetName = 'Respuestas del Formulario';
  let existingSheet = wb.Sheets[sheetName];

  if (!existingSheet) {
    // Si no hay hoja de respuestas, crear una nueva
    const ws = XLSX.utils.json_to_sheet([respuesta]);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  } else {
    // Si existe la hoja, actualizar los datos
    const existingData = XLSX.utils.sheet_to_json(existingSheet);
    const updatedData = [...existingData, respuesta];
    const updatedSheet = XLSX.utils.json_to_sheet(updatedData);
    wb.Sheets[sheetName] = updatedSheet;
  }

  // Guardar el archivo Excel actualizado
  XLSX.writeFile(wb, filePath);

  // Responder con éxito
  res.status(200).json({ message: 'Formulario guardado correctamente.' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});