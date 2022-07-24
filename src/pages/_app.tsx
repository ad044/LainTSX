import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { handleEvent } from "@/core";
import { setKeybindings, setLanguage } from "@/core/events";
import { upgradeLegacySave } from "@/utils/save";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const keybindingSettings = localStorage.getItem("lainKeybindings");
    if (keybindingSettings) {
      handleEvent(setKeybindings(JSON.parse(keybindingSettings)));
    }

    const language = localStorage.getItem("lainLanguage");
    if (language) {
      handleEvent(setLanguage(JSON.parse(language)));
    }

    const saveState = localStorage.getItem("lainSaveStateV2");
    if (!saveState) {
      // if we find an old version, upgrade it
      const oldSaveState = localStorage.getItem("lainSaveState");
      if (oldSaveState) {
        localStorage.setItem(
          "lainSaveStateV2",
          JSON.stringify(upgradeLegacySave(JSON.parse(oldSaveState)))
        );
      }
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

