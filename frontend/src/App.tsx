import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import Navbar from "./components/Navbar";
import { useAuth } from "./auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewComplaint from "./pages/NewComplaint";
import MyComplaints from "./pages/MyComplaints";
import Notices from "./pages/Notices";
import AdminDashboard from "./pages/AdminDashboard";

function RequireAuth({ children, admin = false }: { children: ReactElement; admin?: boolean }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<RequireAuth><NewComplaint /></RequireAuth>} />
          <Route path="/my-complaints" element={<RequireAuth><MyComplaints /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><AdminDashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">CivicConnect is a demo municipal portal. Seed data is for testing only.</footer>
    </>
  );
}
