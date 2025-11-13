import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import GestionesAdmin from "./pages/Admin/GestionesAdmin/GestionesAdmin";
import ReparacionesAdmin from "./pages/Admin/ReparacionesAdmin/ReparacionesAdmin";
import VehiculosAdmin from "./pages/Admin/VehiculosAdmin/VehiculosAdmin";
import PerfilAdmin from "./pages/Admin/PerfilAdmin/PerfilAdmin";
import Login from "./components/Authentication/Login/Login";
import Register from "./components/Authentication/Register/Register";
import VehicleSelection from "./components/Authentication/VehicleSelection/VehicleSelection";
import MecanicoLayout from "./pages/Mecanico/MecanicoLayout";
import DashboardMecanico from "./pages/Mecanico/Dashboard/DashboardMecanico";
import HorarioMecanico from "./pages/Mecanico/Horario/HorarioMecanico";
import HistorialMecanico from "./pages/Mecanico/Historial/HistorialMecanico";
import PerfilMecanico from "./pages/Mecanico/Perfil/PerfilMecanico";
import ReparacionesMecanico from "./pages/Mecanico/Reparaciones/ReparacionesMecanico";
import ClienteLayout from "./pages/Cliente/ClienteLayout";
import DashboardCliente from "./pages/Cliente/Dashboard/DashboardCliente";
import HistorialCliente from "./pages/Cliente/Historial/HistorialCliente";
import TurnosCliente from "./pages/Cliente/Turnos/TurnosCliente";
import PerfilCliente from "./pages/Cliente/Perfil/PerfilCliente";
import VehiculoCliente from "./pages/Cliente/Vehiculo/VehiculoCliente";
// import SetupCar from "./components/modelo_3d/SetupCar";

// Importaciones de Mecanico (componentes organizados en subcarpetas)

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicle-selection" element={<VehicleSelection />} />
        {/* <Route path="/setup" element={<SetupCar />} /> */}

        {/* Rutas admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="gestiones" element={<GestionesAdmin />} />
          <Route path="reparaciones" element={<ReparacionesAdmin />} />
          <Route path="vehiculos" element={<VehiculosAdmin />} />
          <Route path="perfil" element={<PerfilAdmin />} />
        </Route>

        {/* Rutas mecanico */}
        <Route path="/mecanico" element={<MecanicoLayout />}>
          <Route index element={<DashboardMecanico />} />
          <Route path="dashboard" element={<DashboardMecanico />} />
          <Route path="reparaciones" element={<ReparacionesMecanico />} />
          <Route path="horario" element={<HorarioMecanico />} />
          <Route path="historial" element={<HistorialMecanico />} />
          <Route path="perfil" element={<PerfilMecanico />} />
        </Route>

        {/* Rutas cliente */}
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<DashboardCliente />} />
          <Route path="dashboard" element={<DashboardCliente />} />
          <Route path="turnos" element={<TurnosCliente />} />
          <Route path="perfil" element={<PerfilCliente />} />
          <Route path="historial" element={<HistorialCliente />} />
          <Route path="vehiculo" element={<VehiculoCliente />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
