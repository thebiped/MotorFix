const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/user/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      t.id_turno AS id,
      t.problema,
      t.tipo_reparacion,
      t.estado,
      t.fecha_creado,

      v.id_vehiculo,
      v.patente,

      b.name AS marca,
      m.name AS modelo

    FROM turnos t
    LEFT JOIN vehiculos v ON t.vehicle_id = v.id_vehiculo
    LEFT JOIN brands b ON v.id_brand = b.id_brand
    LEFT JOIN car_models m ON v.id_model = m.id_model
    WHERE t.user_id = ?
    ORDER BY t.fecha_creado DESC
  `;

  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error("SQL ERROR turnos/user:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json(rows);
  });
});


// GET — Obtener todos los turnos (admin)
router.get("/all", (req, res) => {
  const sql = `
    SELECT 
      t.id_turno,
      t.user_id,
      u.username,
      
      t.vehicle_id,
      v.patente,
      
      b.name AS marca,
      m.name AS modelo,

      t.problema,
      t.tipo_reparacion,
      t.estado,
      t.fecha_creado,
      
      t.mecanico_id,
      mec.username AS mecanico_nombre,
      t.habilitado

    FROM turnos t
    LEFT JOIN usuarios u ON u.id_usuario = t.user_id
    LEFT JOIN usuarios mec ON mec.id_usuario = t.mecanico_id
    LEFT JOIN vehiculos v ON v.id_vehiculo = t.vehicle_id
    LEFT JOIN brands b ON b.id_brand = v.id_brand
    LEFT JOIN car_models m ON m.id_model = v.id_model

    ORDER BY t.fecha_creado DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("SQL ERROR turnos/all:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// POST crear nuevo turno
router.post("/create", express.json(), (req, res) => {
  const { user_id, vehicle_id, problema, tipo_reparacion } = req.body;

  if (!user_id || !vehicle_id || !problema || !tipo_reparacion) {
    return res.status(400).json({ success: false, error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO turnos (user_id, vehicle_id, problema, tipo_reparacion, estado, fecha_creado)
    VALUES (?, ?, ?, ?, 'Pendiente', datetime('now'))
  `;

  db.run(sql, [user_id, vehicle_id, problema, tipo_reparacion], function (err) {
    if (err) {
      console.error("SQL ERROR:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({
      success: true,
      turno: {
        id_turno: this.lastID,
        user_id,
        vehicle_id,
        problema,
        tipo_reparacion,
        estado: "Pendiente",
        fecha_creado: new Date().toISOString().slice(0, 10),
      },
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { problema, tipo_reparacion } = req.body;

  if (!problema || !tipo_reparacion) {
    return res.status(400).json({ error: "Faltan campos para actualizar" });
  }

  const sql = `
    UPDATE turnos
    SET problema = ?, tipo_reparacion = ?
    WHERE id_turno = ?
  `;

  db.run(sql, [problema, tipo_reparacion, id], function (err) {
    if (err) {
      console.log("Error editando turno:", err);
      return res.status(500).json({ error: "Error al editar turno" });
    }

    res.json({ success: true, message: "Turno actualizado" });
  });
});

/* DELETE — Eliminar turno */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM turnos WHERE id_turno = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.log("Error eliminando turno:", err);
      return res.status(500).json({ error: "Error al eliminar" });
    }

    res.json({ success: true, message: "Turno eliminado" });
  });
});

// PUT cambiar estado
router.put("/estado/:id", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) return res.status(400).json({ error: "Falta estado" });

  const sql = `UPDATE turnos SET estado = ? WHERE id_turno = ?`;

  db.run(sql, [estado, id], function (err) {
    if (err) {
      console.log("Error actualizando estado:", err);
      return res.status(500).json({ error: "Error al actualizar estado" });
    }
    res.json({ success: true });
  });
});

// PUT deshabilitar / habilitar turno
router.put("/habilitado/:id", (req, res) => {
  const { id } = req.params;
  const { habilitado } = req.body;

  db.run(
    "UPDATE turnos SET habilitado = ? WHERE id_turno = ?",
    [habilitado, id],
    (err) => {
      if (err) {
        console.error("Error al actualizar habilitado:", err);
        return res.status(500).json({ success: false, error: "Error DB" });
      }

      res.json({ success: true });
    }
  );
});

// PUT — asignar mecanico a un turno existente
router.put("/asignar/:id", express.json(), (req, res) => {
  const { id } = req.params;
  const { mecanico_id } = req.body;

  if (!mecanico_id) {
    return res.status(400).json({ success: false, error: "Falta mecanico_id" });
  }

  const sql = `UPDATE turnos SET mecanico_id = ? WHERE id_turno = ?`;

  db.run(sql, [mecanico_id, id], function (err) {
    if (err) {
      console.error("SQL Error asignar mecanico:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.json({ success: true, updated: this.changes });
  });
});

// POST — crear turno con mecanico asignado (opcional)
router.post("/create-with-mecanico", express.json(), (req, res) => {
  const { user_id, vehicle_id, problema, tipo_reparacion, mecanico_id } = req.body;

  if (!user_id || !vehicle_id || !problema || !tipo_reparacion) {
    return res.status(400).json({ success: false, error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO turnos (user_id, vehicle_id, problema, tipo_reparacion, estado, fecha_creado, mecanico_id)
    VALUES (?, ?, ?, ?, 'Pendiente', datetime('now'), ?)
  `;

  db.run(sql, [user_id, vehicle_id, problema, tipo_reparacion, mecanico_id || null], function (err) {
    if (err) {
      console.error("SQL Error create-with-mecanico:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({
      success: true,
      turno: { id_turno: this.lastID, user_id, vehicle_id, problema, tipo_reparacion, mecanico_id: mecanico_id || null }
    });
  });
});


router.put("/update", express.json(), (req, res) => {
  const {
    id_turno,
    tipo_reparacion,
    problema,
    estado,
    mecanico_id
  } = req.body;

  const sql = `
    UPDATE turnos
    SET tipo_reparacion = ?,
        problema = ?,
        estado = ?,
        mecanico_id = ?
    WHERE id_turno = ?
  `;

  db.run(
    sql,
    [tipo_reparacion, problema, estado, mecanico_id, id_turno],
    function (err) {
      if (err) {
        console.error("UPDATE ERROR:", err.message);
        return res.json({ success: false, error: err.message });
      }

      return res.json({ success: true });
    }
  );
});


module.exports = router;
