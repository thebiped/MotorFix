const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const db = require("../database");

const router = express.Router();
const SECRET = "TU_SECRETO_AQUI";

const upload = multer();

router.post("/register", upload.none(), (req, res) => {
  const { username, password, email, rol, brand_id, model_id, color, plate } =
    req.body;

  if (!username || !password || !email)
    return res.status(400).json({ message: "Faltan datos" });

  db.get(
    "SELECT * FROM usuarios WHERE username = ? OR email = ?",
    [username, email],
    (err, user) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (user)
        return res.status(400).json({ message: "Usuario o email ya existe" });

      bcrypt.hash(password, 10, (err, hash) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error al encriptar contraseña" });

        db.run(
          "INSERT INTO usuarios (username, password, rol, email) VALUES (?, ?, ?, ?)",
          [username, hash, rol || "cliente", email],
          function (err) {
            if (err)
              return res
                .status(500)
                .json({ message: "Error al registrar usuario" });

            const userId = this.lastID;

            // Ahora insertamos el vehículo
            if (brand_id && model_id && color && plate) {
              db.run(
                "INSERT INTO vehiculos (id_usuario, marca, modelo, color, patente) VALUES (?, ?, ?, ?, ?)",
                [userId, brand_id, model_id, color, plate],
                (err) => {
                  if (err) console.error("Error guardando vehículo:", err);
                }
              );
            }

            const token = jwt.sign(
              { id: userId, username, rol: rol || "cliente" },
              SECRET,
              { expiresIn: "7d" }
            );

            res.json({
              success: true,
              message: "Usuario registrado",
              token,
              user: { id: userId, username, rol: rol || "cliente" },
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

  db.get(
    "SELECT * FROM usuarios WHERE username = ?",
    [username],
    (err, user) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (!user)
        return res
          .status(401)
          .json({ message: "Usuario/contraseña incorrectos" });

      bcrypt.compare(password, user.password, (err, match) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error al verificar contraseña" });
        if (!match)
          return res
            .status(401)
            .json({ message: "Usuario/contraseña incorrectos" });

        const token = jwt.sign(
          { id: user.id_usuario, username: user.username, rol: user.rol },
          SECRET,
          { expiresIn: "7d" }
        );

        res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          token,
          user: { id: user.id_usuario, username: user.username, rol: user.rol },
        });
      });
    }
  );
});

router.post("/forgot-password", upload.none(), (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email requerido" });

  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, user) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "No se encontró un usuario con este email",
      });

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000);

    // Guardar en DB
    db.run(
      "UPDATE usuarios SET reset_code = ?, reset_expire = ? WHERE id_usuario = ?",
      [code, Date.now() + 10 * 60 * 1000, user.id_usuario],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Error guardando código" });

        // Enviar email
        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        transporter.sendMail(
          {
            from: "Soporte MotorFix <no-reply@motorfix.com>",
            to: email,
            subject: "Código de recuperación",
            html: `
              <h2>Tu código de recuperación</h2>
              <p>Utiliza este código para continuar:</p>
              <h1>${code}</h1>
              <p>Expira en 10 minutos.</p>
            `,
          },
          (err) => {
            if (err) {
              console.log("Error email:", err);
              return res.status(500).json({
                success: false,
                message: "No se pudo enviar el email",
              });
            }

            res.json({
              success: true,
              message: "Código enviado al email",
            });
          }
        );
      }
    );
  });
});

// 2️⃣ Verificar código
router.post("/verify-code", upload.none(), (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ success: false, message: "Faltan datos" });

  db.get(
    "SELECT * FROM usuarios WHERE email = ? AND reset_code = ?",
    [email, code],
    (err, user) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error en el servidor" });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Código incorrecto" });

      if (Date.now() > user.reset_expire)
        return res
          .status(400)
          .json({ success: false, message: "El código expiró" });

      res.json({ success: true, message: "Código válido" });
    }
  );
});

// 3️⃣ Resetear contraseña
router.post("/reset-password", upload.none(), (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ success: false, message: "Faltan datos" });

  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error al procesar contraseña" });

    db.run(
      "UPDATE usuarios SET password = ?, reset_code = NULL, reset_expire = NULL WHERE email = ?",
      [hash, email],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Error actualizando contraseña" });

        res.json({ success: true, message: "Contraseña actualizada" });
      }
    );
  });
});

module.exports = router;
