// backend/routes/vehiculos.js
const express = require("express");
const db = require("../database");
const router = express.Router();

// GET todos los vehículos por user_id
router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT v.id_vehiculo,
           v.patente,
           v.mileage,
           v.user_id,
           b.name AS marca,
           m.name AS modelo
    FROM vehiculos v
    LEFT JOIN brands b ON v.id_brand = b.id_brand
    LEFT JOIN car_models m ON v.id_model = m.id_model
    WHERE v.user_id = ?
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error("SQL ERROR vehiculos/user:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json(rows);
  });
});

// POST guardar vehículo (espera que envíes id_brand e id_model)
router.post("/guardar", express.json(), (req, res) => {
  const { user_id, id_brand, id_model, patente, mileage } = req.body;

  if (!user_id || !id_brand || !id_model || !patente || mileage == null) {
    return res.status(400).json({ success: false, error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO vehiculos (user_id, id_brand, id_model, patente, mileage)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [user_id, id_brand, id_model, patente, mileage], function (err) {
    if (err) {
      console.error("SQL ERROR vehiculos/guardar:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, new_id: this.lastID });
  });
});

module.exports = router;
