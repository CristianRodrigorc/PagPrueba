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

// ✅ Servir archivos estáticos del frontend desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar los datos del formulario y guardarlos en Excel
app.post('/api/guardarFormulario', (req, res) => {
    const { firstName, lastName, email, phone, terminos, contacto } = req.body;

    const respuesta = { firstName, lastName, email, phone, terminos, contacto };
    const filePath = path.join(__dirname, 'formulario_respuestas.xlsx');

    let wb;
    if (fs.existsSync(filePath)) {
        wb = XLSX.readFile(filePath);
    } else {
        wb = XLSX.utils.book_new();
    }

    const ws = XLSX.utils.json_to_sheet([respuesta]);
    let sheetName = 'Respuestas del Formulario';

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
    res.status(200).send({ message: 'Formulario guardado correctamente y Excel actualizado.' });
});

// 🚨 Importante para Render: usar el puerto que te da el sistema
const port = process.env.PORT || 3000;
