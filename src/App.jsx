import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";
import DashboardEvents from "./pages/dashboard/DashboardEvents.jsx";
import DashboardParticipants from "./pages/dashboard/DashboardParticipants.jsx"
import Home from "./pages/home/Home.jsx";
import Error404 from "./pages/errors/Error404.jsx"
import Events from "./pages/events/Events.jsx";
import EventDetail from "./pages/events/EventDetail.jsx";
import { Login, Register } from "./pages/auth/Auth.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import './css/index.css'

// LayoutWithNavbar.jsx
import { Outlet } from "react-router-dom";

export function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}

function AppRoutes() {
  const { theme } = useApp();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            borderRadius: "12px",
          },
          success: { iconTheme: { primary: "var(--success)", secondary: "var(--bg-card)" } },
          error:   { iconTheme: { primary: "var(--danger)",  secondary: "var(--bg-card)" } },
        }}
      />

      <BrowserRouter>
        <Routes>
          {/* Dashboard → réservé aux admins uniquement */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            } 
          >
            <Route path="allevents" element={<DashboardEvents />} />
            <Route path="allparticipants" element={<DashboardParticipants />} />
          </Route>

          {/* Routes avec navbar – tout ce qui est dans ce layout aura la navbar */}
          <Route element={<LayoutWithNavbar />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            {/* Page événement détail → réservée aux utilisateurs connectés */}
            <Route 
              path="/events/:id" 
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 404 SANS navbar – route catch-all en dernier */}
          {/* <Route path="*" element={<Error404 />} /> */}
          <Route path="/404" element={<Error404 />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}