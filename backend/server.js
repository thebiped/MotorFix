// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routers/auth");
const brandsRoutes = require("./routers/brands");
const modelsRoutes = require("./routers/models");
const vehiculosRoutes = require("./routers/vehiculos");
const turnosRoutes = require("./routers/turnos");
const usuariosRouter = require("./routers/usuarios");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/models", modelsRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/turnos", turnosRoutes); 
app.use("/api/users", usuariosRouter);


app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
