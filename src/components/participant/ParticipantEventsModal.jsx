import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { participantService } from "../../services/api";
import { capitalizeEachWord } from "../../utils/string";
import toast from "react-hot-toast";

export default function ParticipantEventsModal({ participant, isOpen, onClose }) {
  const { t, lang } = useApp();
  const [participantEvents, setParticipantEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && participant) {
      loadEvents();
    }
  }, [isOpen, participant]);

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const response = await participantService.getEvents(participant.id);
      setParticipantEvents(Array.isArray(response) ? response : response.results || []);
    } catch (err) {
      toast.error("Impossible de charger les événements");
      setParticipantEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const getDisplayName = () => {
    if (participant?.first_name || participant?.last_name) {
      return capitalizeEachWord(`${participant.first_name || ""} ${participant.last_name || ""}`).trim();
    }
    return participant?.username || "Utilisateur";
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric", month: "short", year: "numeric",
  }) : "—";

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal participant-events-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            📅 {t("events.of")} {getDisplayName()}
          </h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <h3 className="events-list-title">📋 {t("events.participatesIn")}</h3>
          
          {eventsLoading ? (
            <div className="table-loading"><span className="spinner" /></div>
          ) : participantEvents.length > 0 ? (
            <div className="participant-events-list">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>{t("events.table.event")}</th>
                    <th>{t("events.table.startDate")}</th>
                    <th>{t("events.table.endDate")}</th>
                    <th>{t("events.table.location")}</th>
                    <th>{t("events.table.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {participantEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <strong>{event.title}</strong>
                        {event.description && (
                          <small className="event-description">{event.description.substring(0, 80)}...</small>
                        )}
                      </td>
                      <td>{fmtDate(event.start_date)}</td>
                      <td>{fmtDate(event.end_date)}</td>
                      <td>{event.location || "—"}</td>
                      <td>
                        <span className={`badge ${event.status === "ongoing" ? "badge-success" : event.status === "cancelled" ? "badge-danger" : "badge-accent"}`}>
                          {lang === "fr" 
                            ? (event.status === "ongoing" ? "En cours" : event.status === "upcoming" ? "À venir" : event.status === "past" ? "Passé" : event.status)
                            : event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="participants-empty">
              {t("events.noEventsForParticipant")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}