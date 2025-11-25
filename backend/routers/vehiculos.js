const express = require("express");
const db = require("../database");

const router = express.Router();

// GET todos los vehículos por user_id
router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.all(
    "SELECT * FROM vehiculos WHERE user_id = ?",
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Error DB" });
      res.json(rows);
    }
  );
});

// POST guardar vehículo
router.post("/guardar", (req, res) => {
  const { marca, modelo, color, patente, user_id } = req.body;

  db.run(
    "INSERT INTO vehiculos (marca, modelo, color, patente, user_id) VALUES (?, ?, ?, ?, ?)",
    [marca, modelo, color, patente, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: "Error guardando" });

      res.json({ success: true, new_id: this.lastID });
    }
  );
});

module.exports = router;
