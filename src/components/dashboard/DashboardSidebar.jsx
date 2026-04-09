import { useApp } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/Dashboard.css";

const NAV_ITEMS = [
  { key: "overview",      icon: "📊", path: "/dashboard" },
  { key: "events",        icon: "🗓️", path: "/dashboard/allevents" },
  { key: "participants",  icon: "👥", path: "/dashboard/allparticipants" },
];

export default function DashboardSidebar() {
  const { t, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = NAV_ITEMS.find((item) => item.path === location.pathname)?.key ?? "overview";

  return (
    <aside className="dash-sidebar">
      <div className="dash-logo">
        <span className="logo-icon">⬡</span>
        <span className="logo-text">Event<strong>Hub</strong></span>
      </div>
      <nav className="dash-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`dash-nav-item ${activeKey === item.key ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>
              {item.key === "overview"
                ? t("nav.dashboard")
                : item.key === "events"
                ? t("events.title")
                : t("participants.title")}
            </span>
          </button>
        ))}
      </nav>
      <div className="dash-sidebar-footer">
        <div className="dash-user">
          <div className="avatar">{user?.first_name?.[0] || "A"}</div>
          <div>
            <p className="du-name">{user?.first_name} {user?.last_name}</p>
            <p className="du-role">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}