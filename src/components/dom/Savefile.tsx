import React, { useEffect, useState } from "react";

const Savefile = () => {
  const [textAreaValue, setTextAreaValue] = useState("");

  useEffect(() => {
    setTextAreaValue(localStorage.getItem("lainSaveStateV2") || "");
  }, []);

  const loadState = () => {
    if (textAreaValue) {
      localStorage.setItem("lainSaveStateV2", textAreaValue);
    } else {
      localStorage.setItem("lainSaveStateV2", "");
    }
  };

  const handleTextValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
  };

  return (
    <>
      <div className="savefile-wrapper">
        <p className="savefile-note">
          If you&#39;ve saved the game during the playthrough, the text provided
          in the box below is your &#34;save file&#34;. To export it for future
          use, just copy everything inside it and paste it inside a file
          somewhere locally. To re-import it later, take the contents of the
          file, paste them here, and press &#34;Load state&#34;. After that,
          reload the website.
          <br />
          <br />
          If you&#39;re here simply to reset your progress, just delete
          everything inside the textbox below and press &#34;Load state&#34;.
          <br />
          <br />
          Keep in mind, manually modifying the contents without being
          careful/setting it to something random will result in a crash while
          trying to load the state in-game.
        </p>
        <textarea value={textAreaValue} onChange={handleTextValueChange} />
        <br />
        <button onClick={loadState}>Load State</button>
      </div>
    </>
  );
};

export default Savefile;
