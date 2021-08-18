import React, { useEffect } from "react";
import "../static/css/notes.css";
import { Link } from "react-router-dom";
import Header from "./Header";

const Notes = () => {
  useEffect(() => {
    document.title = "< notes >";
  }, []);

  return (
    <>
      <Header />
      <table className="main-table">
        <tbody>
          <tr>
            <td>
              <p>Performance</p>
            </td>
            <td>
              <p>
                Your setup must support WebGL2 in order to play this game. The game still runs on a setup with WebGL1, but some textures will look extremely low-quality. You can check this directly by going to{" "}
                <a href={"https://get.webgl.org/webgl2/"} className="notes-a">
                  this website
                </a>.
                If it's not supported, this is most likely due to your browser. Try another one, the game performs best on chromium-based browsers - Chromium, Chrome, Edge, Brave, Opera, Iridium, etc. It's highly recommended that you use one of those for an optimal experience. This is especially true if you're using a bad setup, Linux or Firefox.
                <br />
                <br />
                If it's your first time playing the game, loading it might take a while. If you're seeing a black screen for a bit, just wait it out. Subsequent website visits will be much faster once the browser caches all the assets. Be aware that gameplay already starts at the "Authorize User/Load data" screen, it's not a loading screen.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Sounds</p>
            </td>
            <td>
              <p>
                Browsers require user permission to autoplay audio. If you're not hearing any sound effects, just click somewhere around the page.
                <br /> <br />
                We've also had an issue where the player left the game idle for 30~ mins, and the browser's autoplay permissions reset. Again, if this happens to you, just click around the page and it'll get fixed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Browser Settings</p>
            </td>
            <td>
              <span className="text-center">Firefox specific settings</span>
              <p className="browser-notes">
                privacy.resistFingerprinting should be set to false (normally is by default). Otherwise, it limits the maximum WebGL texture size to 2048, resulting in poor sprite quality.
                <br />
                <br />
                Picture-In-Picture functionality should not be used (you most likely have it disabled already). Just having it enabled won't break anything, but actually using it might lead to some funny visual bugs with media files.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Keybinds</p>
            </td>
            <td>
              <table className="control-table">
                <tbody>
                  <tr>
                    <td>ArrowDown</td>
                    <td>&darr;</td>
                    <td>Go down</td>
                  </tr>
                  <tr>
                    <td>ArrowLeft</td>
                    <td>&larr;</td>
                    <td>Go left</td>
                  </tr>
                  <tr>
                    <td>ArrowUp</td>
                    <td>&uarr;</td>
                    <td>Go up</td>
                  </tr>
                  <tr>
                    <td>ArrowRight</td>
                    <td>&rarr;</td>
                    <td>Go right</td>
                  </tr>
                  <tr>
                    <td>x</td>
                    <td>◯</td>
                    <td>Confirm</td>
                  </tr>
                  <tr>
                    <td>z</td>
                    <td>✖</td>
                    <td>Back</td>
                  </tr>
                  <tr>
                    <td>s</td>
                    <td>◼</td>
                    <td>Display node information</td>
                  </tr>
                  <tr>
                    <td>d</td>
                    <td>▲</td>
                    <td>Menu</td>
                  </tr>
                  <tr>
                    <td>r</td>
                    <td>R1</td>
                    <td>Rotate right</td>
                  </tr>
                  <tr>
                    <td>t</td>
                    <td>R2</td>
                    <td>Look Up/Down</td>
                  </tr>
                  <tr>
                    <td>w</td>
                    <td>L1</td>
                    <td>Rotate left</td>
                  </tr>
                  <tr>
                    <td>e</td>
                    <td>L2</td>
                    <td>Fast jump to level</td>
                  </tr>
                  <tr>
                    <td>v</td>
                    <td>START</td>
                    <td>Start/Proceed</td>
                  </tr>
                  <tr>
                    <td>c</td>
                    <td>SELECT</td>
                    <td>Menu</td>
                  </tr>
                  <tr>
                    <td>k</td>
                    <td></td>
                    <td>Upscale game window</td>
                  </tr>
                  <tr>
                    <td>j</td>
                    <td></td>
                    <td>Downscale game window</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <p>Options</p>
            </td>
            <td>
              <p>
                You can change the language of the subtitles, rebind the keys, and export/import the save file over at the <Link to={"/options"} className="notes-a">options</Link> page.
                <br/><br/>
                There is no auto-save feature just like the original game, so progress must be saved manually. This can be done by navigating to "Save" inside the pause menu in-game, which can be accessed by pressing ▲ (d key on keyboard).
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <Link to="/game">start</Link>
      <br />
    </>
  );
};

export default Notes;
