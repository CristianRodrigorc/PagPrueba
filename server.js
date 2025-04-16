// Requiere los paquetes necesarios
const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis'); // Para enviar datos a Google Sheets

const app = express();

// Middleware para procesar JSON y permitir CORS
app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta "public" (si tienes archivos estáticos como HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Autenticación con Google usando una cuenta de servicio
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT), // Esta es tu clave JSON como variable de entorno
  scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Permiso para editar hojas de cálculo
});

// Ruta para guardar los datos en un archivo Excel local
app.post('/api/guardarFormulario', (req, res) => {
  const { firstName, lastName, email, phone, terminos, contacto } = req.body;

  const respuesta = { firstName, lastName, email, phone, terminos, contacto };

  const filePath = path.join(__dirname, 'formulario_respuestas.xlsx');

  let wb;
  if (fs.existsSync(filePath)) {
    // Si el archivo Excel ya existe, lo abrimos
    wb = XLSX.readFile(filePath);
  } else {
    // Si no existe, creamos un nuevo archivo Excel
    wb = XLSX.utils.book_new();
  }

  const ws = XLSX.utils.json_to_sheet([respuesta]);

  const sheetName = 'Respuestas del Formulario';

  if (!wb.Sheets[sheetName]) {
    // Si no existe la hoja 'Respuestas del Formulario', la agregamos
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  } else {
    // Si la hoja existe, agregamos la nueva respuesta
    const existingSheet = wb.Sheets[sheetName];
    const existingData = XLSX.utils.sheet_to_json(existingSheet);
    const updatedData = [...existingData, respuesta];
    const updatedSheet = XLSX.utils.json_to_sheet(updatedData);
    wb.Sheets[sheetName] = updatedSheet;
  }

  // Guardamos el archivo Excel con las nuevas respuestas
  XLSX.writeFile(wb, filePath);

  // Responder al cliente indicando que los datos se guardaron localmente
  res.status(200).send({ message: 'Formulario guardado localmente en Excel.' });
});

// Ruta para enviar los datos a Google Sheets
app.post('/api/enviarAGoogleSheet', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, terminos, contacto } = req.body;

    // Obtener el cliente de autenticación para Google
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // ID de la hoja de Google Sheets (Reemplaza con el ID de tu hoja real)
    const spreadsheetId = '1m59KZA3I9bWt7htDmWQMI9iLc4qWyrxRpPFeh8lazaQ'; // Aquí debe ir el ID de tu Google Sheets
    const range = 'Colaboradores!A2:F'; // Asegúrate de tener una hoja llamada "Colaboradores"

    // Datos que se agregarán al Google Sheets
    const values = [[firstName, lastName, email, phone, terminos, contacto]];

    // Enviar los datos a Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW', // Usamos 'RAW' para insertar los datos tal cual como se envían
      requestBody: { values }, // Los datos a insertar
    });

    // Responder al cliente indicando que los datos se enviaron a Google Sheets
    res.status(200).json({ message: 'Datos enviados a Google Sheets correctamente.' });
  } catch (error) {
    console.error('Error al enviar a Google Sheets:', error);
    res.status(500).json({ error: 'Error al guardar en Google Sheets' });
  }
});

// Puerto de escucha (Render usa process.env.PORT, o 3000 si estás en local)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});