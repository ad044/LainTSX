import { FileWriter } from "wav";
import { execSync } from "child_process";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export function extract_voice(tempdir, jpsxdec_jar, disc1_index) {
  execSync(
    `java -jar ${jpsxdec_jar} -x "${disc1_index}" -i VOICE.BIN -dir "${tempdir}"`,
    { stdio: "inherit" }
  );
  const voice_files = JSON.parse(readFileSync('voice.json'))

  let voice_data = readFileSync(join(tempdir, "VOICE.BIN"));
  let output_folder = join("..", "..", "src", "static", "voice");
  if(!existsSync(output_folder)) {
    mkdirSync(output_folder);
  }

  for (let voice_file of voice_files) {
    let path = join(output_folder, voice_file.translated_name);
    let wav_file = new FileWriter(path, {sampleRate: 22050, channels:1, bitDepth: 16});
    wav_file.write(voice_data.slice(voice_file.offset, voice_file.offset + voice_file.size));
    wav_file.end();
  }
}
