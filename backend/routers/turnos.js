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
    return res
      .status(400)
      .json({ success: false, error: "Faltan datos obligatorios" });
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
// backend/routes/turnos.js (Modificación)

// PUT — asignar/desasignar mecanico a un turno existente y cambiar estado
router.put("/asignar/:id", express.json(), (req, res) => {
  const { id } = req.params;
  // Recibir opcionalmente mecanico_id (puede ser null para desasignar) y estado
  const { mecanico_id, estado } = req.body;

  // Una validación más permisiva: debe existir el ID del turno y al menos uno de los campos a actualizar
  if (mecanico_id === undefined && estado === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "Faltan campos para asignar/desasignar" });
  }

  // Lógica para construir la consulta de forma dinámica (solo si deseas cambiar también el estado)
  let fields = [];
  let values = [];

  if (mecanico_id !== undefined) {
    fields.push("mecanico_id = ?");
    values.push(mecanico_id);
  }

  if (estado !== undefined) {
    fields.push("estado = ?");
    values.push(estado);
  }

  // Si no hay campos que actualizar, salimos
  if (fields.length === 0) {
    return res
      .status(200)
      .json({ success: true, message: "No hay cambios solicitados." });
  }

  const sql = `UPDATE turnos SET ${fields.join(", ")} WHERE id_turno = ?`;
  values.push(id); // Agregar el id del turno al final de los valores

  db.run(sql, values, function (err) {
    if (err) {
      console.error("SQL Error asignar/desasignar mecanico:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    // Asegurarse de que el update ocurrió
    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "Turno no encontrado o no hubo cambios.",
      });
    }
    return res.json({ success: true, updated: this.changes });
  });
});

// POST — crear turno con mecanico asignado (opcional)
router.post("/create-with-mecanico", express.json(), (req, res) => {
  const { user_id, vehicle_id, problema, tipo_reparacion, mecanico_id } =
    req.body;

  if (!user_id || !vehicle_id || !problema || !tipo_reparacion) {
    return res
      .status(400)
      .json({ success: false, error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO turnos (user_id, vehicle_id, problema, tipo_reparacion, estado, fecha_creado, mecanico_id)
    VALUES (?, ?, ?, ?, 'Pendiente', datetime('now'), ?)
  `;

  db.run(
    sql,
    [user_id, vehicle_id, problema, tipo_reparacion, mecanico_id || null],
    function (err) {
      if (err) {
        console.error("SQL Error create-with-mecanico:", err.message);
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
          mecanico_id: mecanico_id || null,
        },
      });
    }
  );
});

router.put("/update", express.json(), (req, res) => {
  const { id_turno, tipo_reparacion, problema, estado, mecanico_id } = req.body;

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

// backend/routes/turnos.js (Ruta /mecanico/:id)

router.get("/mecanico/:id", (req, res) => {
  const mecanicoId = req.params.id;

  const sql = `
  SELECT 
    t.id_turno AS id,
    t.problema,
    t.tipo_reparacion,
    t.estado,
    t.fecha_creado AS fecha,
    t.mecanico_id,
    t.user_id,

    v.id_vehiculo,
    v.patente,

    b.name AS car_brand,
    m.name AS car_model,
    
    -- ✨ ¡NUEVOS CAMPOS DE car_models!
    m.top_speed,
    m.acceleration,
    m.handling,
    m.image_path, -- Usamos image_path
    m.fuel_consumption,
    m.fuel_capacity,
    m.service_interval,
    m.mileage AS car_mileage, -- Alias para evitar conflicto con v.mileage (si existe)
    m.POWER,
    m.transmission,
    m.base_color,

    u.username AS user_name,
    mec.username AS mecanico_name,
    mec.rol AS mecanico_rol
  FROM turnos t
  LEFT JOIN vehiculos v ON t.vehicle_id = v.id_vehiculo
  LEFT JOIN brands b ON v.id_brand = b.id_brand
  LEFT JOIN car_models m ON v.id_model = m.id_model
  LEFT JOIN usuarios u ON t.user_id = u.id_usuario
  LEFT JOIN usuarios mec ON t.mecanico_id = mec.id_usuario
  WHERE t.mecanico_id = ? 
  ORDER BY t.fecha_creado DESC
  `;
  // ... (continúa el código con el mapeo)

  // backend/routes/turnos.js (Mapeo de rows.map)

  db.all(sql, [mecanicoId], (err, rows) => {
    if (err) {
      console.error("SQL Error en /mecanico/:id:", err.message); // Añadido para mejor debug
      return res.status(500).json({ error: err.message });
    }

    const result = rows.map((t) => ({
      id: t.id,
      estado: t.estado,
      prioridad: "normal",
      user: { id: t.user_id, name: t.user_name },
      car: {
        id: t.id_vehiculo,
        brand: t.car_brand,
        model: t.car_model,
        patente: t.patente, // ✨ ¡Mapeo de los nuevos campos de car_models!
        top_speed: t.top_speed,
        acceleration: t.acceleration,
        handling: t.handling,
        image_url: t.image_path, // Cambiado a image_path según tu BD
        fuel_consumption: t.fuel_consumption,
        fuel_capacity: t.fuel_capacity,
        service_interval: t.service_interval,
        mileage: t.car_mileage,
        power: t.POWER,
        transmission: t.transmission,
        base_color: t.base_color,
      },
      turno: {
        id: t.id,
        descripcion: t.problema,
        tipo_reparacion: t.tipo_reparacion,
        fecha: t.fecha,
      },
      mecanico: {
        id: t.mecanico_id,
        name: t.mecanico_name,
        rol: t.mecanico_rol,
      },
      created_at: t.fecha,
    }));

    res.json(result);
  });
});

module.exports = router;
