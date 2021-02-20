import { execSync, exec } from "child_process";
import { tmpdir } from "os";
import { mkdtempSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { join } from "path";

const tempdir = mkdtempSync(join(tmpdir(), "extractor-"));
console.log(tempdir);

const jpsxdec_jar = join("jpsxdec", "jpsxdec.jar");
const disc1_index = join(tempdir, "disc1.idx");
const disc2_index = join(tempdir, "disc2.idx");

// generate disc indexes
execSync(
  `java -jar ${jpsxdec_jar} -f ${join(
    "discs",
    "disc1.bin"
  )} -x "${disc1_index}"`,
  { stdio: "inherit" }
);

execSync(
  `java -jar ${jpsxdec_jar} -f ${join(
    "discs",
    "disc2.bin"
  )} -x "${disc2_index}"`,
  { stdio: "inherit" }
);

// extract all video and audio
execSync(
  `java -jar ${jpsxdec_jar} -x "${disc1_index}" -a video -dir "${tempdir}" -quality high -vf avi:rgb -up Lanczos3`,
  { stdio: "inherit" }
);

execSync(
  `java -jar ${jpsxdec_jar} -x "${disc1_index}" -a audio -dir "${tempdir}"`,
  { stdio: "inherit" }
);

execSync(
  `java -jar ${jpsxdec_jar} -x "${disc2_index}" -a video -dir "${tempdir}" -quality high -vf avi:rgb -up Lanczos3`,
  { stdio: "inherit" }
);

execSync(
  `java -jar ${jpsxdec_jar} -x "${disc2_index}" -a audio -dir "${tempdir}"`,
  { stdio: "inherit" }
);

const output_movie_folder = join("..", "..", "src", "static", "movie");
const output_audio_folder = join("..", "..", "src", "static", "audio");

if (!existsSync(output_movie_folder)) {
  mkdirSync(output_movie_folder);
}

if (!existsSync(output_audio_folder)) {
  mkdirSync(output_audio_folder);
}

for (let file of readdirSync(`${join(tempdir, "MOVIE")}`)) {
  if (file.endsWith(".wav")) continue;
  exec(
    `ffmpeg -i "${join(tempdir, "MOVIE", file)}" -n ${join(
      output_movie_folder,
      file.replace("avi", "webm")
    )}`
  ).stderr.on("data", (data) => console.log(data));
}

for (let file of readdirSync(`${join(tempdir, "MOVIE2")}`)) {
  if (file.endsWith(".wav")) continue;
  exec(
    `ffmpeg -i "${join(tempdir, "MOVIE", file)}" -n ${join(
      output_movie_folder,
      file.replace("avi", "webm")
    )}`
  ).stderr.on("data", (data) => console.log(data));
}

for (let file of readdirSync(`${join(tempdir, "XA")}`)) {
  exec(
    `ffmpeg -i "${join(tempdir, "XA", file)}" -n ${join(
      output_audio_folder,
      file.replace("wav", "ogg")
    )}`
  ).stderr.on("data", (data) => console.log(data));
}

rmSync(tempdir, { recursive: true });
