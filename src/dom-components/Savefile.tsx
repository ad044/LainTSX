import React, { useCallback, useEffect, useState } from "react";
import "../static/css/savefile.css";

const Savefile = () => {
  const [textAreaValue, setTextAreaValue] = useState("");

  useEffect(() => {
    setTextAreaValue(localStorage.getItem("lainSaveState") || "");
  }, []);

  const saveState = useCallback(() => {
    if (textAreaValue) localStorage.setItem("lainSaveState", textAreaValue);
    else localStorage.setItem("lainSaveState", "");
  }, [textAreaValue]);

  const handleTextValueChange = useCallback((e) => {
    setTextAreaValue(e.target.value);
  }, []);

  return (
    <>
      <div className="savefile-wrapper">
        <p className="savefile-note">
          If you've saved the game during the playthrough, the text provided in
          the box below is your "save file". To export it for future use, just
          copy everything inside it and paste it inside a file somewhere
          locally. To re-import it later, take the contents of the file, paste
          them here, and press "Save state". After that, reload the website.
          <br />
          <br />
          If you're here simply to reset your progress, just delete everything
          inside the textbox below and press "Save state".
          <br />
          <br />
          Keep in mind, manually modifying the contents without being
          careful/setting it to something random will result in a crash while
          trying to load the state in-game.
        </p>
        <textarea value={textAreaValue} onChange={handleTextValueChange} />
        <br />
        <button onClick={saveState}>Save state</button>
      </div>
    </>
  );
};

export default Savefile;
