const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Puerto definido por Railway o 8080 por defecto
const PORT = process.env.PORT || 8080;

// Detectar automáticamente la carpeta de distribución
function findDistFolder() {
  const possiblePaths = [
    'dist/lector-qr-visita/browser', // Angular 17+ con SSR
    'dist/lector-qr-visita',         // Angular típico
    'dist/browser',                  // Otro caso con SSR
    'dist',                          // Caso básico
    'browser'                        // Otro caso posible
  ];

  for (const distPath of possiblePaths) {
    const fullPath = path.join(__dirname, distPath);
    if (fs.existsSync(fullPath) && fs.existsSync(path.join(fullPath, 'index.html'))) {
      console.log(`✅ Carpeta de distribución encontrada en: ${distPath}`);
      return distPath;
    }
  }

  console.log('⚠️ No se pudo encontrar una carpeta de distribución válida. Usando "dist" por defecto.');
  return 'dist';
}

const distFolder = findDistFolder();
console.log(`Sirviendo archivos desde: ${distFolder}`);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, distFolder)));

// Agregar encabezados para debugging
app.use((req, res, next) => {
  console.log(`📝 Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Todas las rutas no encontradas van a index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, distFolder, 'index.html');
  console.log(`🔍 Intentando servir: ${indexPath}`);

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`❌ Error: No se encontró index.html en ${indexPath}`);
    res.status(404).send(`Error: No se pudo encontrar index.html. Directorio de contenido: ${fs.readdirSync(path.join(__dirname, distFolder)).join(', ')}`);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);

  // Mostrar estructura de carpetas para debugging
  console.log('📁 Estructura de carpetas:');
  function listDir(dir, level = 0) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      console.log(`${'  '.repeat(level)}${stats.isDirectory() ? '📁' : '📄'} ${item}`);
      if (stats.isDirectory() && level < 2) { // Limitar a 2 niveles de profundidad
        listDir(itemPath, level + 1);
      }
    }
  }
  try {
    listDir(__dirname);
  } catch (e) {
    console.error('Error al listar directorios:', e);
  }
});
