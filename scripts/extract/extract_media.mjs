import { execSync, exec } from "child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { join } from "path";

export function extract_media(tempdir, jpsxdec_jar, disc1_index, disc2_index) {
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

  // create destination folders

  if (!existsSync(output_movie_folder)) {
    mkdirSync(output_movie_folder);
  }

  if (!existsSync(output_audio_folder)) {
    mkdirSync(output_audio_folder);
  }

  // convert all movies to webm
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

  // convert all audio to ogg
  for (let file of readdirSync(`${join(tempdir, "XA")}`)) {
    exec(
      `ffmpeg -i "${join(tempdir, "XA", file)}" -n ${join(
        output_audio_folder,
        file.replace("wav", "ogg")
      )}`
    ).stderr.on("data", (data) => console.log(data));
  }

  // cleanup source folders
  rmSync(join(tempdir, 'MOVIE'), {recursive: true});
  rmSync(join(tempdir, 'MOVIE2'), {recursive: true});
  rmSync(join(tempdir, 'XA'), {recursive: true});
}
