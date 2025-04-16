const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Autenticación con Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Guardar localmente en Excel
app.post('/api/guardarFormulario', (req, res) => {
  const {
    formType,
    firstName, lastName, email, phone,
    terminos, contacto,
    empresa, comuauto, provincia, municipio, codPostal, direccion
  } = req.body;

  let respuesta = {};

  if (formType === 'form1') {
    respuesta = { firstName, lastName, email, phone, terminos, contacto };
  } else if (formType === 'form2') {
    respuesta = {
      firstName, lastName, email, phone,
      empresa, comuauto, provincia, municipio, codPostal, direccion,
      terminos, contacto
    };
  } else {
    return res.status(400).json({ message: 'Formulario no reconocido.' });
  }

  const filePath = path.join(__dirname, 'formulario_respuestas.xlsx');

  let wb;
  if (fs.existsSync(filePath)) {
    wb = XLSX.readFile(filePath);
  } else {
    wb = XLSX.utils.book_new();
  }

  const ws = XLSX.utils.json_to_sheet([respuesta]);
  const sheetName = formType === 'form1' ? 'Colaboradores' : 'Lits';

  if (!wb.Sheets[sheetName]) {
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  } else {
    const existingSheet = wb.Sheets[sheetName];
    const existingData = XLSX.utils.sheet_to_json(existingSheet);
    const updatedData = [...existingData, respuesta];
    const updatedSheet = XLSX.utils.json_to_sheet(updatedData);
    wb.Sheets[sheetName] = updatedSheet;
  }

  XLSX.writeFile(wb, filePath);
  res.status(200).send({ message: 'Formulario guardado localmente en Excel.' });
});

// Enviar a Google Sheets
app.post('/api/enviarAGoogleSheet', async (req, res) => {
  try {
    const {
      formType,
      firstName, lastName, email, phone,
      terminos, contacto,
      empresa, comuauto, provincia, municipio, codPostal, direccion
    } = req.body;

    let values, range;

    if (formType === 'form1') {
      values = [[firstName, lastName, email, phone, terminos, contacto]];
      range = 'Colaboradores!A2:F';
    } else if (formType === 'form2') {
      values = [[firstName, lastName, email, phone, empresa, comuauto, provincia, municipio, codPostal, direccion, terminos, contacto]];
      range = 'Lits!A2:L';
    } else {
      return res.status(400).json({ message: 'Formulario no reconocido.' });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1m59KZA3I9bWt7htDmWQMI9iLc4qWyrxRpPFeh8lazaQ'; // ID de tu hoja de cálculo

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

// Puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});