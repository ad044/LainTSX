import { execSync } from "child_process";
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
const disc1_index = join(argv.tempdir, "disc1.idx");
const disc2_index = join(argv.tempdir, "disc2.idx");

// generate disc indexes
if (!argv.no_index) {
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
}

if (!argv.no_video) {
  extract_video(
    argv.tempdir,
    jpsxdec_jar,
    disc1_index,
    disc2_index,
    argv.no_delete
  );
}

if (!argv.no_audio) {
  extract_audio(
    argv.tempdir,
    jpsxdec_jar,
    disc1_index,
    disc2_index,
    argv.no_delete
  );
}

if (!argv.no_voice) {
  extract_voice(argv.tempdir, jpsxdec_jar, disc1_index);
}

if (!argv.no_delete) {
  rmSync(argv.tempdir, { recursive: true });
}
