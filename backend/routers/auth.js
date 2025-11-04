const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const db = require("../database");

const router = express.Router();
const SECRET = "TU_SECRETO_AQUI";

const upload = multer();

router.post("/register", upload.none(), (req, res) => {
  const { username, password, email, rol } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ message: "Faltan datos" });

  db.get(
    "SELECT * FROM usuarios WHERE username = ? OR email = ?",
    [username, email],
    (err, user) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (user) return res.status(400).json({ message: "Usuario o email ya existe" });

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: "Error al encriptar contraseña" });

        db.run(
          "INSERT INTO usuarios (username, password, rol, email) VALUES (?, ?, ?, ?)",
          [username, hash, rol || "cliente", email],
          function (err) {
            if (err) return res.status(500).json({ message: "Error al registrar usuario" });

            const token = jwt.sign({ id: this.lastID, username, rol: rol || "cliente" }, SECRET, { expiresIn: "7d" });

            res.json({
              success: true,
              message: "Usuario registrado",
              token,
              user: { id: this.lastID, username, rol: rol || "cliente" },
            });
          }
        );
      });
    }
  );
});

router.post("/login", upload.none(), (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Faltan datos" });

  db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });
    if (!user) return res.status(401).json({ message: "Usuario/contraseña incorrectos" });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ message: "Error al verificar contraseña" });
      if (!match) return res.status(401).json({ message: "Usuario/contraseña incorrectos" });

      const token = jwt.sign({ id: user.id_usuario, username: user.username, rol: user.rol }, SECRET, { expiresIn: "7d" });

      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        token,
        user: { id: user.id_usuario, username: user.username, rol: user.rol },
      });
    });
  });
});

// router.post("/user/setup-car", (req, res) => {
//   const db = req.db;
//   const { id_usuario, marca, modelo, patente, color } = req.body;

//   if (!id_usuario || !marca || !modelo || !patente || !color)
//     return res.status(400).json({ message: "Faltan datos" });

//   db.run(
//     "INSERT INTO vehiculos (id_usuario, marca, modelo, patente, color) VALUES (?, ?, ?, ?, ?)",
//     [id_usuario, marca, modelo, patente, color],
//     function(err) {
//       if (err) return res.status(500).json({ message: "Error al guardar auto" });
//       res.json({ success: true, message: "Auto registrado" });
//     }
//   );
// });


module.exports = router;
