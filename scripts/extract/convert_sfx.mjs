import { readdirSync } from "fs";
import { spawnSync } from "child_process";
import { join } from "path";
import * as mm from "music-metadata";

// stub implementation of upping the pitch of the sfx, still wip
export async function convert_sfx() {
  let i = 0;
  const dir = join("..", "..", "src", "static", "sfx");
  for (let file of readdirSync(dir)) {
    if (file.includes("snd")) {
      console.log(file);
      const metaData = await mm.parseFile(`${join(dir, file)}`);

      const sampleRate = metaData.format.sampleRate;

      spawnSync(
        "ffmpeg",
        [
          "-i",
          join(dir, file),
          "-filter_complex",
          `asetrate=${sampleRate}*2^(6/12),atempo=1/2^(6/12)`,
          "-n",
          join(dir, "..", "t", file),
        ],
        { stdio: "inherit" }
      );
    }
  }
}

convert_sfx();
