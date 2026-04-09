import { useApp } from "../../context/AppContext";
import "../../css/Navbar.css";


export default function Language() {
  const { t, lang, toggleLang } = useApp();
  return (
    <button className="icon-btn" onClick={toggleLang} title={t("general.toggleLanguage")}>
      <span className="lang-flag">{lang === "fr" ? "🇫🇷" : "🇬🇧"}</span>
    </button>
  );
}


// const {,  lang, toggleLang, } = useApp();

//   return (
//         <button className="icon-btn" onClick={toggleLang} title="Toggle language">
//             <span className="lang-flag">{lang === "fr" ? "🇫🇷" : "🇬🇧"}</span>
//         </button>
//   );