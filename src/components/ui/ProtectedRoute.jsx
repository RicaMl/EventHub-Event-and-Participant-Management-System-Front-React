import { useApp } from "../../context/AppContext";
import { Navigate, useLocation } from "react-router-dom"; 

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useApp();
  const location = useLocation();

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    // Rediriger vers login avec l'URL de retour
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si la route est réservée aux admins et que l'utilisateur n'est pas admin
  if (adminOnly && user.role !== "admin") {
    // Rediriger vers la page d'accueil
    return <Navigate to="/" replace />;
  }

  // Sinon, afficher le composant enfant
  return children;


  // if (!user) return <Navigate to="/login" replace />;
  // if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  // return children;
}
