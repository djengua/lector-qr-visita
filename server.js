const express = require('express');
const path = require('path');
const app = express();

// Puerto definido por Railway o 8080 por defecto
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist/lector-qr-visita')));

// Todas las rutas no encontradas van a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/lector-qr-visita/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
