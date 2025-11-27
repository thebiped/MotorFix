const express = require("express");
const router = express.Router();
const db = require("../database"); // tu conexión SQLite

// ------------------------
// GET /api/reparaciones?estado=pending&mecanico_id=...
// ------------------------
router.get("/", (req, res) => {
  const { estado = "pending", mecanico_id } = req.query;

  console.log("===== GET /api/reparaciones =====");
  console.log("Query params:", req.query);

  let sql = `
    SELECT r.id AS reparacion_id, r.estado, r.user_name, r.prioridad, r.mecanico_id,
           r.created_at, r.updated_at,
           t.id_turno AS turno_id, t.descripcion AS turno_descripcion, t.fecha, t.hora, t.id_usuario AS user_id,
           v.id_vehiculo AS car_id, v.marca AS car_brand, v.modelo AS car_model
    FROM reparaciones r
    JOIN turnos t ON r.turno_id = t.id_turno
    JOIN vehiculos v ON t.id_vehiculo = v.id_vehiculo
    WHERE r.estado = ?
  `;

  const params = [estado];

  // Filtrar por mecanico_id solo si se pasó
  if (mecanico_id) {
    sql += " AND r.mecanico_id = ?";
    params.push(mecanico_id);
  }

  console.log("SQL Query:", sql);
  console.log("Params:", params);

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("ERROR en query:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("Filas obtenidas:", rows.length);
    console.log(rows);

    const result = rows.map((r) => ({
      id: r.reparacion_id,
      estado: r.estado,
      prioridad: r.prioridad,
      user: { id: r.user_id, name: r.user_name },
      car: {
        id: r.car_id,
        brand: r.car_brand,
        model: r.car_model,
      },
      turno: {
        id: r.turno_id,
        descripcion: r.turno_descripcion,
        fecha: r.fecha,
        hora: r.hora,
      },
      created_at: r.created_at,
      updated_at: r.updated_at,
      mecanico_id: r.mecanico_id,
    }));

    res.json(result);
  });
});

// ------------------------
// PATCH /api/reparaciones/:id
// ------------------------
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { estado, prioridad } = req.body;

  const sql = `
    UPDATE reparaciones
    SET estado = COALESCE(?, estado),
        prioridad = COALESCE(?, prioridad),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.run(sql, [estado, prioridad, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// ------------------------
// POST /api/reparaciones
// ------------------------
router.post("/", (req, res) => {
  const { turno_id, user_name, mecanico_id } = req.body;

  const sql = `
    INSERT INTO reparaciones (turno_id, user_name, mecanico_id)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [turno_id, user_name, mecanico_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

module.exports = router;
