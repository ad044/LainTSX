const KaitaiStream = require('kaitai-struct/KaitaiStream');

// based on https://github.com/magical/nlzss/blob/master/lzss3.py and https://github.com/m35/jpsxdec/blob/readme/laintools/src/laintools/Lain_Pk.java
class LainCompress {
  decode (io) {
    const bits = (byte) => { return [(byte >> 7) & 1, (byte >> 6) & 1,(byte >> 5) & 1,(byte >> 4) & 1,(byte >> 3) & 1,(byte >> 2) & 1, (byte >> 1) & 1, (byte) & 1] };

    let compressed = new KaitaiStream(io);
    let decompressed_size = compressed.readU4le();
    let decompressed = Buffer.alloc(decompressed_size);
    let decompressed_pos = 0;

    while (decompressed_pos < decompressed_size) {
      let flags = bits(compressed.readU1());

      for (let flag of flags) {
        if (flag === 0) {
          decompressed[decompressed_pos] = compressed.readBytes(1);
          decompressed_pos++;
        }

        else if (flag === 1) {
          let offset = compressed.readU1() + 1;
          let size = compressed.readU1() + 3;
          for (let i = 0; i < size; i++) {
            decompressed[decompressed_pos] = decompressed[decompressed_pos - offset];
            decompressed_pos++;
          }
        }

        if (decompressed_size <= decompressed_pos) break;
      }
    }

    if (decompressed.length !== decompressed_size)
      throw new Error("Decompressed size does not match the expected size!");
    return decompressed;
  }
}
module.exports = LainCompress;
