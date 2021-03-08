import React from "react";
import "../static/css/notes.css";

const Notes = () => {
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
                The game performs best on chromium-based browsers. Chromium,
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
          <tr>
            <td>
              <p>Sound</p>
            </td>
            <td>
              <p>
                The game assumes that your browser volume is set to 100% (via
                the sound mixer on your operating system). It uses the Web Audio
                API to display the audio visualizer and animate Lain's mouth
                movements inside some media files. Both of those things depend
                on the browser's output volume, therefore, if you want to lower
                the game's volume, it is recommended you do so by lowering the
                system volume itself, as opposed to muting the browser
                tab/lowering the browser volume directly. Otherwise, the two
                functionalities mentioned above won't work properly.
                <br />
                If this becomes a huge problem later on, I'll try to implement
                an alternative for it.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <a href="/game">start</a>
      <br />
    </>
  );
};

export default Notes;
