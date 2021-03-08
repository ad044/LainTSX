import { execSync, exec } from "child_process";
import { mkdirSync, readdirSync, rmdirSync } from "fs";
import { join } from "path";

export function extract_video(
  tempdir,
  jpsxdec_jar,
  disc1_index,
  disc2_index,
  no_delete
) {
  // extract all video
  execSync(
    `java -jar ${jpsxdec_jar} -x "${disc1_index}" -a video -dir "${tempdir}" -quality high -vf avi:rgb -up Lanczos3`,
    { stdio: "inherit" }
  );

  execSync(
    `java -jar ${jpsxdec_jar} -x "${disc2_index}" -a video -dir "${tempdir}" -quality high -vf avi:rgb -up Lanczos3`,
    { stdio: "inherit" }
  );

  const output_movie_folder = join(
    "..",
    "..",
    "src",
    "static",
    "media",
    "movie"
  );

  // create destination folder
  mkdirSync(output_movie_folder, { recursive: true });

  // convert all movies to mp4
  for (const movieDir of ["MOVIE", "MOVIE2"]) {
    for (let file of readdirSync(`${join(tempdir, movieDir)}`)) {
      if (file.endsWith(".wav")) continue;
      exec(
        `ffmpeg -i "${join(
          tempdir,
          movieDir,
          file
        )}" -pix_fmt yuv420p -n ${join(
          output_movie_folder,
          file.replace("avi", "mp4")
        )}`
      ).stderr.on("data", (data) => console.log(data));
    }
  }

  if (!no_delete) {
    // cleanup source folders
    rmdirSync(join(tempdir, "MOVIE"));
    rmdirSync(join(tempdir, "MOVIE2"));
  }
}

export function extract_audio(
  tempdir,
  jpsxdec_jar,
  disc1_index,
  disc2_index,
  no_delete
) {
  // extract all audio
  execSync(
    `java -jar ${jpsxdec_jar} -x "${disc1_index}" -a audio -dir "${tempdir}"`,
    { stdio: "inherit" }
  );

  execSync(
    `java -jar ${jpsxdec_jar} -x "${disc2_index}" -a audio -dir "${tempdir}"`,
    { stdio: "inherit" }
  );

  const output_audio_folder = join(
    "..",
    "..",
    "src",
    "static",
    "media",
    "audio"
  );

  // create destination folder
  mkdirSync(output_audio_folder, { recursive: true });

  // convert all audio to mp4
  for (let file of readdirSync(`${join(tempdir, "XA")}`)) {
    exec(
      `ffmpeg -i "${join(tempdir, "XA", file)}" -n ${join(
        output_audio_folder,
        file.replace("wav", "mp4")
      )}`
    ).stderr.on("data", (data) => console.log(data));
  }

  if (!no_delete) {
    // cleanup source folder
    rmdirSync(join(tempdir, "XA"));
  }
}
