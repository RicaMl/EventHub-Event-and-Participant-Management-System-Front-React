// src/components/profile/ChangePasswordModal.jsx
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { participantService } from "../../services/api";
import toast from "react-hot-toast";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { t, user, login } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.new_password || !form.confirm_password) {
      toast.error(t("password.fillAllFields"));
      return;
    }
    
    if (form.new_password !== form.confirm_password) {
      toast.error(t("password.passwordMismatch"));
      return;
    }
    
    if (form.new_password.length < 8) {
      toast.error(t("password.passwordTooShort"));
      return;
    }
    
    setLoading(true);
    try {
      // Mettre à jour le mot de passe via participantService
      const updatedUser = await participantService.update(user.id, {
        password: form.new_password
      });
      console.log(updatedUser.password);
      console.log(form.new_password)
      // Mettre à jour le contexte avec les nouvelles données
      const token = localStorage.getItem("eh-token");
      login(updatedUser, token);
      
      toast.success(t("password.changeSuccess"));
      setForm({ new_password: "", confirm_password: "" });
      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(err.response?.data?.detail || t("password.changeError"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔒 {t("password.title")}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label className="form-label">{t("password.newPassword")} *</label>
            <input
              type={showPw ? "text" : "password"}
              name="new_password"
              className="form-input"
              value={form.new_password}
              onChange={handleChange}
              placeholder={t("password.newPasswordPlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t("password.confirmPassword")} *</label>
            <input
              type={showPw ? "text" : "password"}
              name="confirm_password"
              className="form-input"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder={t("password.confirmPasswordPlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPw}
                onChange={() => setShowPw(!showPw)}
              />
              {t("password.showPasswords")}
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {t("general.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> {t("password.changing")}</> : t("password.changeButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}