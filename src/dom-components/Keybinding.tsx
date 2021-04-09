import React, { useCallback, useEffect } from "react";
import { formatKey } from "../helpers/keybinding-helpers";
import "../static/css/keybinding.css";
import { useStore } from "../store";

const Keybinding = () => {
  const setKeybindings = useStore((state) => state.setKeybindings);
  const bindings = useStore((state) => state.keybindings);

  useEffect(() => {
    document.title = "< keybinding >";
  }, []);

  const handleRemap = useCallback(
    (keyToRemap: string, to: string) => {
      if (to.length === 1) to = to.toLowerCase();

      const exists = Object.values(bindings).includes(to);

      if (!exists) {
        const newBindings = { ...bindings, [keyToRemap]: to };
        setKeybindings(newBindings);
        localStorage.setItem("lainKeybindings", JSON.stringify(newBindings));
      } else {
        const takenKeybind = Object.keys(bindings).find(
          (k) => bindings[k] === to
        );

        if (takenKeybind) {
          const newBindings = {
            ...bindings,
            [takenKeybind]: "",
            [keyToRemap]: to,
          };
          setKeybindings(newBindings);
          localStorage.setItem("lainKeybindings", JSON.stringify(newBindings));
        }
      }
    },
    [bindings, setKeybindings]
  );

  const startKeybindListener = useCallback(
    (keyToRemap: string) => {
      window.addEventListener(
        "keydown",
        (event) => handleRemap(keyToRemap, event.key),
        { once: true }
      );
    },
    [handleRemap]
  );

  const resetToDefault = useCallback(() => {
    setKeybindings({
      DOWN: "ArrowDown",
      LEFT: "ArrowLeft",
      UP: "ArrowUp",
      RIGHT: "ArrowRight",
      CIRCLE: "x",
      CROSS: "z",
      TRIANGLE: "d",
      SQUARE: "s",
      R2: "t",
      L2: "e",
      L1: "w",
      R1: "r",
      START: "v",
      SELECT: "c",
    });
    localStorage.removeItem("lainKeybindings");
  }, [setKeybindings]);
  return (
    <>
      <p className="keybinding-note">
        This is the keybindings page. To change a keybinding, just click on it
        and press the button you wish to bind it to after. In order for this to
        take effect, you must refresh the game page.
      </p>
      <br />
      <div className="keybinding">
        <table className="control-table">
          <tbody>
            {Object.entries(bindings).map((pair, idx) => (
              <tr onClick={() => startKeybindListener(pair[0])} key={idx}>
                <td>{formatKey(pair[0])}</td>
                <td>{pair[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <button className="reset-to-default-button" onClick={resetToDefault}>
        Reset to default bindings
      </button>
    </>
  );
};

export default Keybinding;
