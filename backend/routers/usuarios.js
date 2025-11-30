const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcryptjs");

router.post("/", express.json(), (req, res) => {
  // Se asume que aquí tienes un middleware de autenticación/autorización de Admin
  const { username, password, email, rol } = req.body; 

  if (!username || !password || !email) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }
  // Opcional: Validar que el rol es válido
  const validRoles = ['cliente', 'admin', 'mecanico'];
  const userRol = rol && validRoles.includes(rol.toLowerCase()) ? rol.toLowerCase() : "cliente";

  // 1. Hashear la contraseña
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hasheando contraseña:", err);
      return res.status(500).json({ success: false, message: "Error al procesar la contraseña" });
    }

    // 2. Insertar el usuario
    db.run(
      "INSERT INTO usuarios (username, password, rol, email) VALUES (?, ?, ?, ?)",
      [username, hash, userRol, email],
      function (err) {
        if (err) {
          // Error 19: Violación de unicidad (email o username ya existen)
          if (err.errno === 19) { 
            return res.status(409).json({ success: false, message: "El email o usuario ya existe." });
          }
          console.error("Error al insertar usuario:", err);
          return res.status(500).json({ success: false, message: "Error desconocido al registrar el usuario en la DB" });
        }

        const newUserId = this.lastID;

        // 3. Respuesta exitosa (201 Created)
        res.status(201).json({ 
          success: true, 
          message: "Usuario creado exitosamente",
          // Devolvemos el objeto creado con el ID para mayor seguridad
          user: { id_usuario: newUserId, username, email, rol: userRol }
        });
      }
    );
  });
});

// GET todos los usuarios (solo para admin)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      id_usuario,
      username,
      email,
      rol
    FROM usuarios
    ORDER BY id_usuario ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: "Error en la DB" });
    res.json(rows);
  });
});

router.put("/:id", express.json(), (req, res) => {
  const { id } = req.params;
  const { username, email, rol } = req.body;
  db.run(
    "UPDATE usuarios SET username = ?, email = ?, rol = ? WHERE id_usuario = ?",
    [username, email, rol, id],
    function (err) {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error al actualizar usuario" });
      if (this.changes === 0)
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      res.json({ success: true, message: "Usuario actualizado correctamente" });
    }
  );
});

// DELETE /api/users/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM usuarios WHERE id_usuario = ?", [id], function (err) {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error al eliminar usuario" });
    if (this.changes === 0)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  });
});

// GET todos los usuarios con sus vehículos
router.get("/conVehiculos", (req, res) => {
  const sqlUsers = `SELECT id_usuario, username FROM usuarios`;

  db.all(sqlUsers, [], (err, users) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    const usersWithVehiclesPromises = users.map((user) => {
      return new Promise((resolve, reject) => {
        const sqlVehiculos = `
          SELECT v.id_vehiculo AS id, v.patente, v.mileage, v.color,
                 b.name AS brand,
                 m.name AS name,
                 v.image
          FROM vehiculos v
          LEFT JOIN brands b ON v.id_brand = b.id_brand
          LEFT JOIN car_models m ON v.id_model = m.id_model
          WHERE v.user_id = ?
        `;
        db.all(sqlVehiculos, [user.id_usuario], (err, vehiculos) => {
          if (err) reject(err);
          else
            resolve({
              id: user.id_usuario,
              name: user.username,
              vehiculos: vehiculos,
            });
        });
      });
    });

    Promise.all(usersWithVehiclesPromises)
      .then((results) => res.json(results))
      .catch((err) =>
        res.status(500).json({ success: false, error: err.message })
      );
  });
});

// GET usuario por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      id_usuario,
      username,
      email,
      rol
    FROM usuarios
    WHERE id_usuario = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err)
      return res.status(500).json({ success: false, error: "Error en la DB" });

    if (!row)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });

    res.json(row);
  });
});

module.exports = router;
