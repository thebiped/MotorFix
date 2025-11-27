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
    if (err) return res.status(500).json({ success: false, error: "Error en la DB" });
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
      if (err) return res.status(500).json({ success: false, message: "Error al actualizar usuario" });
      if (this.changes === 0)
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      res.json({ success: true, message: "Usuario actualizado correctamente" });
    }
  );
});

// DELETE /api/users/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM usuarios WHERE id_usuario = ?", [id], function (err) {
    if (err) return res.status(500).json({ success: false, message: "Error al eliminar usuario" });
    if (this.changes === 0)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  });
});

module.exports = router;
