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
                The game performs best on chromium-based browsers - Chromium,
                Chrome, Edge, Brave, Opera, Iridium, Vivaldi, etc. It's highly
                recommended that you use one of those for an optimal experience.
                This is especially true if you're using a bad setup, and even
                more true if you're using Linux on a bad setup, since Firefox's
                WebGL implementation on it has had issues for a while now.
                <br />
                <br />
                If it's your first time playing the game, the first time loading
                it might take a while depending on the factors mentioned above.
                If you're seeing a black screen for a bit, just wait it out.
                Subsequent website visits will be much faster once the browser
                caches all the assets.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Sounds</p>
            </td>
            <td>
              <p>
                Browsers require user permission to autoplay audio. If you're
                not hearing any sound effects, just click somewhere around the
                page.
                <br /> <br />
                We've also had an issue where the player left the game idle for
                30~ mins, and the browser's autoplay permissions reset. Again,
                if this happens to you, just click around the page and it'll get
                fixed.
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
                <a href={"https://get.webgl.org/webgl2/"} className="notes-a">
                  this website
                </a>
                . If it's not supported, this is most likely due to your
                browser. Try another one, preferably chromium/firefox-based,
                keeping in mind the notes written inside Performance. This could
                also be caused by your drivers being outdated. <br />
                <br />
                The game still runs on a setup with WebGL1, but some textures
                will look extremely low-quality. This is because WebGL1 can't
                generate mipmaps with non-POT (power of two) textures, so it has
                to downscale each texture to be POT.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Browser Settings</p>
            </td>
            <td>
              <span className="text-center">Firefox</span>
              <p className="browser-notes">
                privacy.resistFingerprinting should be set to false (it should
                be by default). Otherwise, it limits the maximum WebGL texture
                size to 2048, resulting in poor sprite quality.
                <br />
                <br />
                Picture-In-Picture functionality should not be used (you most
                likely have it disabled already). Just having it enabled won't
                break anything, but actually using it might lead to some funny
                visual bugs with media files.
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
                    <td>s</td>
                    <td>◼</td>
                  </tr>
                  <tr>
                    <td>d</td>
                    <td>▲</td>
                  </tr>
                  <tr>
                    <td>r</td>
                    <td>R1</td>
                  </tr>
                  <tr>
                    <td>t</td>
                    <td>R2</td>
                  </tr>
                  <tr>
                    <td>w</td>
                    <td>L1</td>
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
                    <td>c</td>
                    <td>SELECT</td>
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
              <br />
              <span className="text-center">
                If you'd like to change the keybindings, go{" "}
                <Link to={"/keybinding"} className="notes-a">
                  here
                </Link>
                .
              </span>
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
