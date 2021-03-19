import { spawnSync } from "child_process";
import { tmpdir } from "os";
import { mkdtempSync, rmSync, mkdirSync } from "fs";
import { join } from "path";
import { extract_video, extract_audio } from "./extract_media.mjs";
import { extract_voice } from "./extract_voice.mjs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("tempdir", {
    type: "string",
    description: "Path to a temporary directory",
    default: mkdtempSync(join(tmpdir(), "extractor-")),
  })
  .option("no_index", {
    type: "boolean",
    description:
      "Don't generate an index file for each disc, the index files MUST exist already",
  })
  .option("no_video", {
    type: "boolean",
    description: "Don't extract video",
  })
  .option("no_audio", {
    type: "boolean",
    description: "Don't extract audio",
  })
  .option("no_voice", {
    type: "boolean",
    description: "Don't extract voice.bin",
  })
  .option("no_delete", {
    type: "boolean",
    description:
      "Don't delete any temporary files or directories, useful when using --tempdir (WARNING: uses 6+ GB of space)",
  })
  .option("no_audio", {
    type: "boolean",
    description: "Don't extract audio",
  }).argv;

mkdirSync(argv.tempdir, { recursive: true });

const jpsxdec_jar = join("jpsxdec", "jpsxdec.jar");

// generate disc indexes
if (!argv.no_index) {
  for (const disc of ["disc1", "disc2"]) {
    spawnSync(
      "java",
      [
        "-jar",
        jpsxdec_jar,
        "-f",
        join("discs", disc + ".bin"),
        "-x",
        join(argv.tempdir, disc + ".idx"),
      ],
      { stdio: "inherit" }
    );
  }
}

if (!argv.no_video) {
  extract_video(argv.tempdir, jpsxdec_jar, argv.no_delete);
}

if (!argv.no_audio) {
  extract_audio(argv.tempdir, jpsxdec_jar, argv.no_delete);
}

if (!argv.no_voice) {
  extract_voice(argv.tempdir, jpsxdec_jar);
}

if (!argv.no_delete) {
  rmSync(argv.tempdir, { recursive: true });
}
