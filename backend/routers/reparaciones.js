const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/crear", (req, res) => {
  // 1. Desestructuración de datos enviados desde el frontend
  const { id_turno, id_mecanico, id_vehiculo, descripcion_reparacion } =
    req.body;

  // 2. Consulta SQL para la inserción
  const sql = `
        INSERT INTO reparaciones (
            turno_id, 
            mecanico_id, 
            vehiculo_id, 
            fecha_reparacion, 
            descripcion
        ) VALUES (?, ?, ?, DATETIME('now'), ?)
    `;

  // 3. Ejecución de la consulta
  db.run(
    sql,
    [id_turno, id_mecanico, id_vehiculo, descripcion_reparacion],
    function (err) {
      // Usamos function para acceder a this.lastID
      if (err) {
        console.error("Error al registrar reparación:", err.message);
        return res.status(500).json({ error: err.message });
      }
      // 4. Respuesta exitosa
      res.json({
        message: "Reparación registrada exitosamente",
        id: this.lastID,
      });
    }
  );
});

router.put("/finalizar/:id", (req, res) => {
  const id_turno = req.params.id;
  const { descripcion_reparacion } = req.body;

  if (!descripcion_reparacion) {
    return res
      .status(400)
      .json({ error: "Falta la descripción final de la reparación." });
  }

  // Actualiza la descripción del registro de reparación asociado a este turno.
  const sql = `
        UPDATE reparaciones
        SET 
            descripcion = ?,
            fecha_reparacion = DATETIME('now') -- Opcional: registrar la fecha de finalización
        WHERE turno_id = ?
    `;

  db.run(sql, [descripcion_reparacion, id_turno], function (err) {
    if (err) {
      console.error("Error al finalizar la reparación (UPDATE):", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      // Esto sucede si el registro inicial no fue creado previamente
      return res
        .status(404)
        .json({
          message: "No se encontró un registro de reparación para este turno.",
        });
    }

    res.json({
      message: "Reparación finalizada y descripción actualizada.",
      changes: this.changes,
    });
  });
});

module.exports = router;
