const sqlite3 = require("sqlite3");
const path = require("path");

// Ruta absoluta al archivo DB
const dbPath = path.resolve(__dirname, "motorfix.db");

// Abrir la DB y crearla si no existe
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error("❌ No se pudo acceder a la base de datos:", err);
  else console.log("✅ Base de datos SQLite conectada o creada");
});

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
});

// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS car_models (
//       id_model INTEGER PRIMARY KEY AUTOINCREMENT,
//       brand TEXT NOT NULL,
//       model TEXT NOT NULL,
//       file_path TEXT NOT NULL,
//       colors TEXT NOT NULL
//     )
//   `, (err) => {
//     if (err) return console.error("❌ Error creando tabla car_models:", err);

//     const defaultCarModels = [
//       { brand: "BMW", model: "M3", file_path: "/models/bmw_m3.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#0000FF"]) },
//       { brand: "Nissan", model: "Silvia S14", file_path: "/models/nissan_silvia_s14.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#FFFF00"]) },
//       { brand: "Lamborghini", model: "Aventador", file_path: "/models/lamborghini_aventador.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#00FF00"]) },
//       { brand: "Ford", model: "Mustang GT500", file_path: "/models/ford_mustang_gt500.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#0000FF"]) },
//       { brand: "Chevrolet", model: "Camaro SS", file_path: "/models/chevrolet_camaro_ss.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#FFFF00"]) },
//       { brand: "Ferrari", model: "Testarossa", file_path: "/models/ferrari_testarossa.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#00FF00"]) },
//       { brand: "Dodge", model: "Charger 1968", file_path: "/models/dodge_charger_1968.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#0000FF"]) },
//       { brand: "Mitsubishi", model: "Lancer Evolution X", file_path: "/models/mitsubishi_lancer_evolution_x.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#FFFF00"]) },
//       { brand: "Mercedes-Benz", model: "C63 AMG", file_path: "/models/mercedes_benz_c63_amg.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#00FF00"]) },
//       { brand: "Audi", model: "A3", file_path: "/models/audi_a3.glb", colors: JSON.stringify(["#FF0000", "#000000", "#FFFFFF", "#808080", "#0000FF"]) }
//     ];

//     defaultCarModels.forEach(car => {
//       db.run(
//         "INSERT OR IGNORE INTO car_models (brand, model, file_path, colors) VALUES (?, ?, ?, ?)",
//         [car.brand, car.model, car.file_path, car.colors],
//         (err) => {
//           if (err) console.error("❌ Error insertando modelo:", err);
//           else console.log(`✅ Modelo ${car.brand} ${car.model} insertado`);
//         }
//       );
//     });
//   });
// });



module.exports = db;
