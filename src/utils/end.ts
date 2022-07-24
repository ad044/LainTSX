import voiceJson from "@/json/voice.json";

export const getVoiceFilenames = (name: String) => {
  const { translation_table, vowels, voice_file_list } = voiceJson;
  // convert name from katakana to romaji
  Object.keys(translation_table).forEach((translated) => {
    name = name.replaceAll(
      translation_table[translated as keyof typeof translation_table],
      translated
    );
  });

  let currentVowel = "";
  let filesToPlay = [];
  let currentSyllable = "";

  for (let i = 0; i < name.length; ) {
    let filename = "";
    // current character is a vowel
    if (vowels.includes(name[i])) {
      // long vowel
      if (name[i] === "-") {
        filename = `${currentVowel}_${currentVowel}`;
      }
      // two vowels in a row
      else if (currentVowel !== "") {
        filename = `${currentVowel}_${name[i]}`;
        // if double vowel sound does not exist fall back to single vowel
        if (!voice_file_list.includes(filename)) filename = `${name[i]}`;
      }
      // single vowel
      else filename = `${name[i]}`;
      currentVowel = name[i];
      i += 1;
    } else {
      // 2 character long syllable by default
      currentSyllable = name.slice(i, i + 2);

      if (currentSyllable[1] === "Y" || currentSyllable[1] === "H") {
        // 3 character long syllable
        currentSyllable = name.slice(i, i + 3);
        i += 1;
      }

      i += 2;

      if (currentVowel === "") filename = `${currentSyllable}`;
      else {
        filename = `${currentVowel}_${currentSyllable}`;

        if (!voice_file_list.includes(filename))
          filename = `${currentSyllable}`;
      }

      if (currentSyllable[1] === "Y" || currentSyllable[1] === "H")
        currentVowel = currentSyllable[2];
      else currentVowel = currentSyllable[1];
    }

    // convert filename to katakana
    filesToPlay.push(
      filename
        .split("_")
        .map((c) => translation_table[c as keyof typeof translation_table])
        .join("_")
    );
  }
  return filesToPlay;
};
