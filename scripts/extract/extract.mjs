import { execSync } from "child_process";
import { tmpdir } from "os";
import { mkdtempSync, rmdirSync } from "fs";
import { join } from "path";
import { extract_media } from "./extract_media.mjs";
import { extract_voice } from "./extract_voice.mjs";

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

extract_media(tempdir, jpsxdec_jar, disc1_index, disc2_index);
extract_voice(tempdir, jpsxdec_jar, disc1_index);

rmdirSync(tempdir, { recursive: true });
