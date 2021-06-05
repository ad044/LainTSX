import { spawnSync } from "child_process";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import KaitaiStream from "kaitai-struct/KaitaiStream.js";
import Lapk from "./Lapk.js";

export function extract_lapks(tempdir, jpsxdec_jar) {
  spawnSync(
    "java",
    [
      "-jar",
      jpsxdec_jar,
      "-x",
      join(tempdir, "disc1.idx"),
      "-i",
      "LAPKS.BIN",
      "-dir",
      tempdir,
    ],
    { stdio: "inherit" }
  );
  const lapk_info = JSON.parse(readFileSync("lapks.json"));

  let lapk_data = readFileSync(join(tempdir, "LAPKS.BIN"));
  let output_folder = join("..", "..", "src", "static", "sprites", "lain");

  mkdirSync(output_folder, { recursive: true });

  for (let [index, lapk_entry] of lapk_info.entries()) {
    let data = lapk_data.slice(
      lapk_entry.offset,
      lapk_entry.offset + lapk_entry.size
    );
    let parsed_lapk = new Lapk(new KaitaiStream(data));
    let images = [];
    if (index != 37) continue;

    for (let [frame_number, cell_data] of parsed_lapk.data.cellData.entries()) {
      const cell_header = parsed_lapk.data.cellHeaders[frame_number];
      // create bitstream header (from https://github.com/m35/jpsxdec/blob/1de0518583236844b93f5fcc8a4d330a01c222b3/laintools/src/laintools/Lain_LAPKS.java#L319)
      let bitstream_header = Buffer.alloc(8);
      bitstream_header.writeInt8(cell_data.chrominanceQuantisationScale);
      bitstream_header.writeInt8(cell_data.luminanceQuantisationScale, 1);
      bitstream_header.writeInt16LE(0x3800, 2);
      bitstream_header.writeInt16LE(cell_data.runLengthCodeCount, 4);
      bitstream_header.writeInt16LE(0x0000, 6);
      let output_bitstream = Buffer.concat(
        [bitstream_header, cell_data.imageData],
        cell_data.imageDataSize + 8
      );
      let bitstream_file = join(tempdir, `${index}_${frame_number}.bs`);
      let out_frame = join(tempdir, `${index}_${frame_number}.png`);
      let out_mask = join(tempdir, `${index}_${frame_number}_mask.gray`);
      let out_alpha = join(tempdir, `${index}_${frame_number}_alpha.png`);
      writeFileSync(bitstream_file, output_bitstream);
      writeFileSync(out_mask, Buffer.from(cell_data.bitMask));
      spawnSync(
        "java",
        [
          "-jar",
          jpsxdec_jar,
          "-f",
          resolve(bitstream_file),
          "-static",
          "bs",
          "-dim",
          `${cell_data.width}x${cell_data.height}`,
          "-up",
          "Lanczos3",
        ],
        { stdio: "inherit", cwd: tempdir }
      );
      spawnSync(
        "convert",
        [
          "-background",
          "none",
          "(",
          "-extent",
          "352x367",
          "xc:none",
          ")",
          "(",
          out_frame,
          "(",
          "-depth",
          "2",
          "-size",
          `${cell_data.width}x${cell_data.height}`,
          out_mask,
          "-alpha",
          "off",
          ")",
          "-compose",
          "copy-opacity",
          "-composite",
          ")",
          "-geometry",
          `+${320 / 2 + 4 - cell_header.negativeXPosition}+${
            352 - 1 - cell_header.negativeYPosition
          }`,
          "-compose",
          "over",
          "-composite",
          out_alpha,
        ],
        { stdio: "inherit" }
      );
      images.push(out_alpha);
    }

    if (lapk_entry.tile != "") {
      spawnSync(
        "montage",
        [
          "-background",
          "none",
          "-tile",
          lapk_entry.tile,
          "-geometry",
          "+0+0",
          ...images,
          join(output_folder, lapk_entry.output_name)
        ],
        { stdio: "inherit" }
      );

    }
  }
}
