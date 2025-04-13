const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ruta para manejar los datos del formulario y guardarlos en Excel
app.post('/api/guardarFormulario', (req, res) => {
    const { firstName, lastName, email, phone, terminos, contacto } = req.body;

    // Crear un objeto con los datos del formulario
    const respuesta = { firstName, lastName, email, phone, terminos, contacto };

    // Ruta del archivo Excel (ubicación en el servidor)
    const filePath = path.join(__dirname, 'formulario_respuestas.xlsx');

    // Comprobar si el archivo Excel ya existe
    let wb;
    if (fs.existsSync(filePath)) {
        // Si el archivo existe, leemos el archivo existente
        wb = XLSX.readFile(filePath);
    } else {
        // Si el archivo no existe, creamos un nuevo libro de trabajo
        wb = XLSX.utils.book_new();
    }

    // Convertir el objeto a hoja de Excel
    const ws = XLSX.utils.json_to_sheet([respuesta]);

    // Verificar si la hoja de respuestas ya existe
    let sheetName = 'Respuestas del Formulario';
    if (!wb.Sheets[sheetName]) {
        // Si no existe, agregamos la hoja con los encabezados
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    } else {
        // Si la hoja ya existe, agregamos las respuestas a la hoja existente
        const existingSheet = wb.Sheets[sheetName];
        const existingData = XLSX.utils.sheet_to_json(existingSheet);
        const updatedData = [...existingData, respuesta];  // Agregar nueva respuesta

        // Reemplazar la hoja con los datos actualizados
        const updatedSheet = XLSX.utils.json_to_sheet(updatedData);
        wb.Sheets[sheetName] = updatedSheet;
    }

    // Guardar el archivo Excel actualizado
    XLSX.writeFile(wb, filePath);

    res.status(200).send({ message: 'Formulario guardado correctamente y Excel actualizado.' });
});

// 🚨 CAMBIO IMPORTANTE PARA RENDER:
// Usar el puerto asignado por Render (process.env.PORT) o 3000 en local
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
