const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../database");

const router = express.Router();

// Multer config
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


// GET /api/brands
router.get("/", (req, res) => {
  db.all(
    "SELECT id_brand, name, logo_path, example_car_url, description FROM brands ORDER BY name",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error al obtener marcas", err });

      const host = req.get("host");
      const proto = req.protocol;

      const result = rows.map((r) => ({
        ...r,
        logo_url: r.logo_path
          ? `${proto}://${host}/uploads/images/${path.basename(r.logo_path)}`
          : null,
        example_car_url: r.example_car_url
          ? `${proto}://${host}/uploads/images/${path.basename(r.example_car_url)}`
          : null,
      }));

      res.json(result);
    }
  );
});


// POST /api/brands
router.post(
  "/",
  upload.fields([{ name: "logo" }, { name: "logo_car" }]),
  (req, res) => {
    const { name, description } = req.body;

    const logoPath = req.files["logo"] ? req.files["logo"][0].path : null;
    const exampleCarPath = req.files["logo_car"] ? req.files["logo_car"][0].path : null;

    db.run(
      "INSERT INTO brands (name, logo_path, example_car_url, description) VALUES (?, ?, ?, ?)",
      [name, logoPath, exampleCarPath, description || ""],
      function (err) {
        if (err) return res.status(500).json({ message: "Error al crear marca", err });

        res.json({ success: true, id_brand: this.lastID });
      }
    );
  }
);

module.exports = router;
