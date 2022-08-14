import React from "react";
import { useStore } from "@/store";
import { handleEvent } from "@/core";
import { setLanguage } from "@/core/events";

const Language = () => {
  const currentLanguage = useStore((state) => state.language);
  const supportedLanguages = [
    { language: "English", code: "en" },
    { language: "French", code: "fr" },
    { language: "German", code: "de" },
    { language: "Korean", code: "ko" },
    { language: "Portuguese, Brazilian", code: "pt-BR" },
    { language: "Russian", code: "ru" }
  ];

  const updateLanguage = (langCode: string) => {
    handleEvent(setLanguage(langCode));
    localStorage.setItem("lainLanguage", JSON.stringify(langCode));
  };

  return (
    <>
      <p className="keybinding-note">
        From here you can select which language you want the game&#39;s
        subtitles to be in.
        <br />
        This list will be updated gradually as more translations get completed.
      </p>
      <br />
      {supportedLanguages.map((entry) => (
        <p
          className="language-entry"
          key={entry.code}
          style={currentLanguage === entry.code ? { color: "#ffa531" } : {}}
          onClick={() => updateLanguage(entry.code)}
        >
          {entry.language}
        </p>
      ))}
    </>
  );
};

export default Language;
