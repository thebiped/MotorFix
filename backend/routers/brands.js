// backend/routers/brands.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../database");

const router = express.Router();

// Multer - guardar imágenes en /backend/uploads/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "images"));
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage });

// GET /api/brands  -> lista marcas con logo_path (ruta pública)
router.get("/", (req, res) => {
  db.all("SELECT id_brand, name, logo_path, description FROM brands ORDER BY name", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error al obtener marcas", err });
    // Convertir logo_path a URL pública si existe
    const host = req.get("host");
    const proto = req.protocol;
    const result = rows.map((r) => ({
      ...r,
      logo_url: r.logo_path ? `${proto}://${host}/uploads/images/${path.basename(r.logo_path)}` : null,
    }));
    res.json(result);
  });
});

// POST /api/brands (form-data: name, description, logo file)
router.post("/", upload.single("logo"), (req, res) => {
  const { name, description } = req.body;
  const logoPath = req.file ? req.file.path : null;

  if (!name) return res.status(400).json({ message: "Falta el nombre de la marca" });

  db.run("INSERT INTO brands (name, logo_path, description) VALUES (?, ?, ?)", [name, logoPath, description || ""], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al crear marca" });
    }
    res.json({ success: true, id_brand: this.lastID });
  });
});

module.exports = router;
