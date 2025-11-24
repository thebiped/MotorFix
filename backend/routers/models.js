// backend/routers/models.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../database");

const router = express.Router();

// Misma configuración de multer (asegurate carpeta uploads/images existe)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads", "images")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// GET /api/models?brandId=#
router.get("/", (req, res) => {
  const brandId = req.query.brandId;
  if (!brandId) return res.status(400).json({ message: "brandId es requerido" });

  db.all(
    `SELECT id_model, brand_id, name, image_path, top_speed, acceleration, handling
     FROM car_models WHERE brand_id = ? ORDER BY name`,
    [brandId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error al obtener modelos", err });
      const host = req.get("host");
      const proto = req.protocol;
      const result = rows.map((r) => ({
        ...r,
        image_url: r.image_path ? `${proto}://${host}/uploads/images/${path.basename(r.image_path)}` : null,
      }));
      res.json(result);
    }
  );
});

// POST /api/models  (form-data: brand_id, name, top_speed, acceleration, handling, image file)
router.post("/", upload.single("image"), (req, res) => {
  const { brand_id, name, top_speed, acceleration, handling } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!brand_id || !name) return res.status(400).json({ message: "Faltan datos obligatorios (brand_id, name)" });

  db.run(
    `INSERT INTO car_models (brand_id, name, image_path, top_speed, acceleration, handling)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [brand_id, name, imagePath, top_speed || null, acceleration || null, handling || null],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al guardar modelo" });
      }
      res.json({ success: true, id_model: this.lastID });
    }
  );
});

module.exports = router;
