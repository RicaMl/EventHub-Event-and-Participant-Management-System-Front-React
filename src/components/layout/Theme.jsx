import { useApp } from "../../context/AppContext";
import "../../css/Navbar.css";


export default function Theme() {
  const { t, theme, toggleTheme } = useApp();

  return (
    <button className="icon-btn" onClick={toggleTheme} title={theme === "dark" ? t("general.lightMode") : t("general.darkMode")}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

// export default function Theme() {
//   const { toggleTheme, theme} = useApp();

//   return (
//      <button className="icon-btn" onClick={toggleTheme} title={theme === "dark" ? t("general.lightMode") : t("general.darkMode")}>
//             {theme === "dark" ? "☀️" : "🌙"}
//      </button>
//   );
// }
