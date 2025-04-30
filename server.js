const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');

const app = express();

// Middleware básico para que la API pueda recibir JSON y solicitudes desde otros orígenes (CORS)
app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de autenticación con Google usando una cuenta de servicio
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT), // Esto debe estar definido en variables de entorno
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Ruta para enviar datos de formularios a Google Sheets
app.post('/api/enviarAGoogleSheet', async (req, res) => {
  try {
    const {
      formType,
      firstName, lastName, email, phone,
      empresa, comuauto, provincia, municipio, codPostal, direccion
    } = req.body;

    let values = [];
    let range = '';

    // Dependiendo del tipo de formulario, armamos los datos y la hoja destino
    if (formType === 'form1') {
      values = [[firstName, lastName, email, phone]];
      range = 'Colaboradores!A2:D';
    } else if (formType === 'form2') {
      values = [[
        firstName, lastName, email, phone,
        empresa, comuauto, provincia, municipio, codPostal, direccion,
        'NO ASIGNADO', 'POR CONTACTAR'
      ]];
      range = 'Leads!A2:M';
    } else {
      return res.status(400).json({ message: 'Tipo de formulario no válido.' });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1m59KZA3I9bWt7htDmWQMI9iLc4qWyrxRpPFeh8lazaQ'; // ID de tu documento de Google Sheets

    // Insertamos los datos en la hoja correspondiente
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    res.status(200).json({ message: 'Datos enviados correctamente a Google Sheets.' });
  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    res.status(500).json({ error: 'Hubo un problema al guardar los datos.' });
  }
});

// Ruta para obtener las opciones del chatbot según la sección actual de la página
app.get('/api/OpcionesChatbot', async (req, res) => {
  try {
    // Lista de hojas permitidas para evitar solicitudes no válidas
    const hojasPermitidas = [
      'OpcionesChatbot_Home',
      'OpcionesChatbot_Telefonia',
      'OpcionesChatbot_Electrica',
      'OpcionesChatbot_Seguridad'
    ];

    // Tomamos el nombre de la hoja desde el parámetro "hoja" en la URL
    const hoja = req.query.hoja || 'OpcionesChatbot_Home'; // Por defecto carga 'OpcionesChatbot_Home'

    // Verificamos si la hoja solicitada es válida
    if (!hojasPermitidas.includes(hoja)) {
      return res.status(400).json({ message: 'Hoja no válida.' });
    }

    // El rango de la hoja donde buscar las opciones
    const range = `${hoja}!A2:C`; // Asegura que las columnas sean: id, texto, respuesta

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1m59KZA3I9bWt7htDmWQMI9iLc4qWyrxRpPFeh8lazaQ'; // ID de tu documento de Google Sheets

    // Leemos los datos desde la hoja correspondiente
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    // Si no hay datos en la hoja, devolvemos error
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: `La hoja "${hoja}" no contiene opciones.` });
    }

    // Formateamos las filas en objetos
    const opciones = rows.map(([id, texto, respuesta]) => ({
      id,
      texto,
      respuesta
    }));

    // Devolvemos las opciones al cliente
    res.json(opciones);
  } catch (error) {
    console.error('Error al obtener las opciones del chatbot:', error);
    res.status(500).json({ error: 'No se pudieron recuperar las opciones del chatbot.' });
  }
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});