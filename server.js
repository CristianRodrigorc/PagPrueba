// Ruta para enviar los datos a Google Sheets
app.post('/api/enviarAGoogleSheet', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, terminos, contacto, formType } = req.body;

    // Obtener el cliente de autenticación para Google
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // ID de la hoja de Google Sheets (Reemplaza con el ID de tu hoja real)
    const spreadsheetId = '1m59KZA3I9bWt7htDmWQMI9iLc4qWyrxRpPFeh8lazaQ'; // Aquí debe ir el ID de tu Google Sheets
    let range;

    // Si es el formulario 1, se envía a la hoja "Colaboradores"
    if (formType === 'form1') {
      range = 'Colaboradores!A2:F'; // Asegúrate de tener una hoja llamada "Colaboradores"
    } 
    // Si es el formulario 2, se envía a la hoja "Lits"
    else if (formType === 'form2') {
      range = 'Lits!A2:F'; // Asegúrate de tener una hoja llamada "Lits"
    } else {
      return res.status(400).json({ error: 'Formulario no reconocido' });
    }

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
