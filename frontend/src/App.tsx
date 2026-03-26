import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import InsurancePage from "./pages/InsurancePage";
import TreatmentsPage from "./pages/TreatmentsPage";
import CompliancePage from "./pages/CompliancePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="insurance" element={<InsurancePage />} />
        <Route path="treatments" element={<TreatmentsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
      </Route>
    </Routes>
  );
}
