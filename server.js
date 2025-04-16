// Requiere paquetes necesarios
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

// Servir archivos estáticos desde carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Autenticación con Google usando una cuenta de servicio
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT), // Esta es tu clave JSON como variable de entorno
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Ruta para guardar en archivo Excel local
app.post('/api/guardarFormulario', (req, res) => {
  const { firstName, lastName, email, phone, terminos, contacto } = req.body;

  const respuesta = { firstName, lastName, email, phone, terminos, contacto };

  const filePath = path.join(__dirname, 'formulario_respuestas.xlsx');

  let wb;
  if (fs.existsSync(filePath)) {
    // Si el archivo existe, lo abrimos
    wb = XLSX.readFile(filePath);
  } else {
    // Si no existe, creamos un nuevo archivo
    wb = XLSX.utils.book_new();
  }

  const ws = XLSX.utils.json_to_sheet([respuesta]);

  const sheetName = 'Respuestas del Formulario';

  if (!wb.Sheets[sheetName]) {
    // Si no existe la hoja, la agregamos
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  } else {
    // Si existe, agregamos la nueva respuesta
    const existingSheet = wb.Sheets[sheetName];
    const existingData = XLSX.utils.sheet_to_json(existingSheet);
    const updatedData = [...existingData, respuesta];
    const updatedSheet = XLSX.utils.json_to_sheet(updatedData);
    wb.Sheets[sheetName] = updatedSheet;
  }

  // Guardamos el archivo Excel
  XLSX.writeFile(wb, filePath);

  res.status(200).send({ message: 'Formulario guardado localmente en Excel.' });
});

// Ruta para enviar los datos a Google Sheets
app.post('/api/enviarAGoogleSheet', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, terminos, contacto } = req.body;

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = 'TU_ID_DE_HOJA_GOOGLE'; // 👈 Reemplaza esto con tu ID de Google Sheets
    const range = 'Respuestas!A2:F'; // 👈 Asegurate de tener una hoja llamada "Respuestas"

    const values = [[firstName, lastName, email, phone, terminos, contacto]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    res.status(200).json({ message: 'Datos enviados a Google Sheets correctamente.' });
  } catch (error) {
    console.error('Error al enviar a Google Sheets:', error);
    res.status(500).json({ error: 'Error al guardar en Google Sheets' });
  }
});

// Puerto de escucha (Render usa process.env.PORT)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});