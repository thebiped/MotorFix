// backend/database.js
const sqlite3 = require("sqlite3");
const path = require("path");

// Ruta absoluta al archivo DB
const dbPath = path.resolve(__dirname, "motorfix.db");

// Abrir la DB y crearla si no existe
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error("❌ No se pudo acceder a la base de datos:", err);
    else console.log("✅ Base de datos SQLite conectada o creada");
  }
);

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      rol TEXT DEFAULT 'cliente'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vehiculos (
      id_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER,
      marca TEXT,
      modelo TEXT,
      patente TEXT,
      color TEXT,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS datos_personales (
      id_datos INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER,
      telefono TEXT,
      descripcion TEXT,
      imagen TEXT,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
  )`);

  // Tabla de marcas
  db.run(`CREATE TABLE IF NOT EXISTS brands (
      id_brand INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      logo_path TEXT,
      description TEXT
  )`);

  // Tabla de modelos (por marca)
  db.run(`CREATE TABLE IF NOT EXISTS car_models (
      id_model INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      image_path TEXT,
      top_speed INTEGER,       -- velocidad máxima (km/h)
      acceleration REAL,      -- 0-100 (segundos) o valor que uses
      handling INTEGER,       -- manejo/handling (puntaje 0-100)
      FOREIGN KEY (brand_id) REFERENCES brands(id_brand)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    problema TEXT NOT NULL,
    tipo_reparacion TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    fecha_creado TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
