const express = require("express");
const router = express.Router();
const db = require("../database");

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


module.exports = router;
