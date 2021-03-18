import React, { useEffect } from "react";
import "../static/css/notes.css";
import { Link } from "react-router-dom";

const Notes = () => {
  useEffect(() => {
    document.title = "< notes >";
  }, []);

  return (
    <>
      <table className="main-table">
        <tbody>
          <tr>
            <td>
              <p>Performance</p>
            </td>
            <td>
              <p>
                The game performs best on chromium-based browsers - Chromium,
                Chrome, Edge, Brave, Opera, Iridium, Vivaldi, etc. It's highly
                recommended that you use one of those for an optimal experience.
                This is especially true if you're using a bad setup, and even
                more true if you're using Linux on a bad setup, since Firefox's
                WebGL implementation on it has had issues for a while now.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>WebGL2</p>
            </td>
            <td>
              <p>
                Your setup must support WebGL2 in order to play this game. You
                can check this directly by going to{" "}
                <a
                  href={"https://get.webgl.org/webgl2/"}
                  className="webgl-anchor"
                >
                  this website
                </a>
                . If it's not supported, this is most likely due to your
                browser. Try another one, preferably chromium/firefox-based,
                keeping in mind the notes written inside Performance. This could
                also be caused by your drivers being outdated.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Browser Settings</p>
            </td>
            <td>
              <p>
                <span className="text-center">Firefox</span>
                <div className="browser-notes">
                  privacy.resistFingerprinting should be set to false (it should
                  be by default). Otherwise, it limits the maximum WebGL texture
                  size to 2048, resulting in poor sprite quality.
                  <br />
                  <br />
                  Picture-In-Picture functionality should not be used (you most
                  likely have it disabled already). Just having it enabled won't
                  break anything, but actually using it might lead to some funny
                  visual bugs with media files.
                </div>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Keyboard Controls</p>
            </td>
            <td>
              <table className="control-table">
                <tbody>
                  <tr>
                    <td>ArrowDown</td>
                    <td>↓</td>
                  </tr>
                  <tr>
                    <td>ArrowLeft</td>
                    <td>←</td>
                  </tr>
                  <tr>
                    <td>ArrowUp</td>
                    <td>↑</td>
                  </tr>
                  <tr>
                    <td>ArrowRight</td>
                    <td>→</td>
                  </tr>
                  <tr>
                    <td>x</td>
                    <td>◯</td>
                  </tr>
                  <tr>
                    <td>z</td>
                    <td>✖</td>
                  </tr>
                  <tr>
                    <td>d</td>
                    <td>▲</td>
                  </tr>
                  <tr>
                    <td>e</td>
                    <td>L2</td>
                  </tr>
                  <tr>
                    <td>v</td>
                    <td>START</td>
                  </tr>
                  <tr>
                    <td>k</td>
                    <td>Upscale Game Window</td>
                  </tr>
                  <tr>
                    <td>j</td>
                    <td>Downscale Game Window</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <p>Mobile/Tablet Controls</p>
            </td>
            <td>
              <table className="control-table">
                <tbody>
                  <tr>
                    <td>Swipe Down</td>
                    <td>↓</td>
                  </tr>
                  <tr>
                    <td>Swipe Left</td>
                    <td>←</td>
                  </tr>
                  <tr>
                    <td>Swipe Up</td>
                    <td>↑</td>
                  </tr>
                  <tr>
                    <td>Swipe Right</td>
                    <td>→</td>
                  </tr>
                </tbody>
              </table>
              <p>
                The rest of the buttons are layed out on the game screen itself.
                <br />
                Also, please rotate the phone horizontally when playing, I don't
                want feature creep because of psychopaths.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Saving Progress</p>
            </td>
            <td>
              <p>
                There is no auto-save feature just like the original game, so
                progress must be saved manually. This can be done by navigating
                to "Save" inside the pause menu in-game, which can be accessed
                by pressing ▲ (d key on keyboard).
                <br />
                The state is stored in a minimized JSON format as a string
                inside localStorage with the key "lainSaveState".
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
