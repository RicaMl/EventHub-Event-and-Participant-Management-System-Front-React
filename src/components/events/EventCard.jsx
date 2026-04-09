import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "../../css/EventCard.css";

const STATUS_MAP = {
  upcoming: { label_fr: "À venir", label_en: "Upcoming", class: "badge-accent" },
  ongoing:  { label_fr: "En cours", label_en: "Ongoing",  class: "badge-success" },
  past:     { label_fr: "Passé",    label_en: "Past",     class: "badge-muted" },
  completed: { label_fr: "Terminé",  label_en: "Completed", class: "badge-muted" },
  cancelled: { label_fr: "Annulé",   label_en: "Cancelled", class: "badge-danger" },
};

export default function EventCard({ event }) {
  const { t, lang } = useApp();
  const navigate = useNavigate();

  const status = STATUS_MAP[event.status] || STATUS_MAP.upcoming;
  const isFull = event.registered_count >= event.max_participants;
  const spotsLeft = event.max_participants - (event.registered_count || 0);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <article className="event-card animate-fade" onClick={() => navigate(`/events/${event.id}`)}>
      {/* Image */}
      <div className="ec-image">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} loading="lazy" />
        ) : (
          <div className="ec-image-placeholder">
            <span>{event.title?.[0] || "E"}</span>
          </div>
        )}
        <div className="ec-badges">
          <span className={`badge ${status.class}`}>
            {lang === "fr" ? status.label_fr : status.label_en}
          </span>
          {event.price === 0 || event.price === null ? (
            <span className="badge badge-success">{t("events.free")}</span>
          ) : (
            <span className="badge badge-muted">{event.price}€</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="ec-body">
        <h3 className="ec-title">{event.title}</h3>
        <p className="ec-description">{event.description}</p>

        <div className="ec-meta">
          <div className="ec-meta-item">
            <span className="meta-icon">📅</span>
            <span>{formatDate(event.start_date)}</span>
          </div>
          <div className="ec-meta-item">
            <span className="meta-icon">📍</span>
            <span>{event.city || event.country || event.address || "—"}</span>
          </div>
          <div className="ec-meta-item">
            <span className="meta-icon">👥</span>
            <span>
              {event.registered_count || 0}/{event.max_participants || "∞"}{" "}
              {!isFull && spotsLeft > 0 && (
                <span style={{ color: "var(--success)", fontSize: 12 }}>
                  ({spotsLeft} {t("events.spotsLeft")})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Spots bar */}
        {event.max_participants && (
          <div className="spots-bar">
            <div
              className="spots-fill"
              style={{
                width: `${Math.min(100, ((event.registered_count || 0) / event.max_participants) * 100)}%`,
                background: isFull ? "var(--danger)" : "var(--gradient-accent)",
              }}
            />
          </div>
        )}

        {/* Actions - seulement le bouton Voir détails */}
        <div className="ec-actions">
          <button
            className="btn btn-primary"
            style={{ flex: 1, fontSize: 13 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
          >
            {t("events.seeDetails")}
          </button>
        </div>
      </div>
    </article>
  );
}