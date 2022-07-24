import React, { useCallback, useEffect } from "react";
import { useStore } from "@/store";
import { handleEvent } from "@/core";
import { setKeybindings } from "@/core/events";
import { Key } from "@/types";

const formatKey = (key: Key): string => {
  switch (key) {
    case Key.Down:
      return "↓";
    case Key.Left:
      return "←";
    case Key.Up:
      return "↑";
    case Key.Right:
      return "→";
    case Key.Circle:
      return "◯";
    case Key.Cross:
      return "✖";
    case Key.Square:
      return "◼";
    case Key.Triangle:
      return "▲";
    case Key.R1:
      return "R1";
    case Key.R2:
      return "R2";
    case Key.L1:
      return "L1";
    case Key.L2:
      return "L2";
    case Key.Select:
      return "Select";
    case Key.Start:
      return "start";
  }
};

const Keybinding = () => {
  const keybindings = useStore((state) => state.keybindings);

  const handleRemap = useCallback(
    (keyToRemap: Key, to: string) => {
      if (to.length === 1) {
        to = to.toLowerCase();
      }

      const newBindings = {
        ...Object.fromEntries(
          Object.entries(keybindings).filter(([_, v]) => v !== keyToRemap)
        ),
        [to]: keyToRemap,
      };

      handleEvent(setKeybindings(newBindings));
      localStorage.setItem("lainKeybindings", JSON.stringify(newBindings));
    },
    [keybindings]
  );

  const startKeybindListener = useCallback(
    (keyToRemap: Key) => {
      window.addEventListener(
        "keydown",
        (event) => handleRemap(keyToRemap, event.key),
        { once: true }
      );
    },
    [handleRemap]
  );

  const resetToDefault = () => {
    handleEvent(
      setKeybindings({
        ArrowDown: Key.Down,
        ArrowLeft: Key.Left,
        ArrowUp: Key.Up,
        ArrowRight: Key.Right,
        x: Key.Circle,
        z: Key.Cross,
        d: Key.Triangle,
        s: Key.Square,
        t: Key.R2,
        e: Key.L2,
        w: Key.L1,
        r: Key.R1,
        v: Key.Start,
        c: Key.Select,
      })
    );
    localStorage.removeItem("lainKeybindings");
  };

  const getBoundKey = useCallback(
    (k: Key) => Object.keys(keybindings).find((key) => keybindings[key] === k),
    [keybindings]
  );

  return (
    <>
      <p className="keybinding-note">
        To change a keybinding, just click on it and press the button you wish
        to bind it to after.
        <br />
        In order for this to take effect, you must refresh the game page.
      </p>
      <br />
      <div className="keybinding">
        <table className="control-table">
          <tbody>
            {[
              Key.Left,
              Key.Right,
              Key.Up,
              Key.Down,
              Key.L1,
              Key.L2,
              Key.R1,
              Key.R2,
              Key.Circle,
              Key.Triangle,
              Key.Cross,
              Key.Square,
              Key.Select,
              Key.Start,
            ].map((key) => (
              <tr onClick={() => startKeybindListener(key)} key={key}>
                <td>{formatKey(key)}</td>
                <td>{getBoundKey(key)}</td>
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
