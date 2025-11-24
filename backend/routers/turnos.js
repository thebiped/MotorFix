const express = require("express");
const router = express.Router();
const db = require("../database");

// Crear un turno nuevo
router.post("/create", (req, res) => {
  const { user_id, vehicle_id, problema, tipo_reparacion } = req.body;

  if (!user_id || !vehicle_id || !problema || !tipo_reparacion) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO turnos (user_id, vehicle_id, problema, tipo_reparacion)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [user_id, vehicle_id, problema, tipo_reparacion], function (err) {
    if (err) return res.status(500).json({ error: "Error al crear turno" });

    res.json({
      message: "Turno creado con éxito",
      turno_id: this.lastID
    });
  });
});

// Obtener turnos de un usuario específico
router.get("/user/:id", (req, res) => {
  const sql = "SELECT * FROM turnos WHERE user_id = ?";

  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener turnos" });

    res.json(rows);
  });
});

// Obtener todos los turnos (modo admin)
router.get("/all", (req, res) => {
  const sql = `
    SELECT t.*, u.username, m.brand, m.model
    FROM turnos t
    LEFT JOIN users u ON u.id = t.user_id
    LEFT JOIN models m ON m.id = t.vehicle_id
    ORDER BY t.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener turnos" });

    res.json(rows);
  });
});

module.exports = router;
