import authorize_user_letters from "../resources/authorize_user_letters.json";
import { AuthorizeUserMatrixIndices } from "../types/types";

// huge thanks to oo for help with this!!
export const handleNameSelection = (
  currentString: string,
  newCharacter: string
) => {
  // characters that cannot be the first letter
  const cantBeFirst = [
    "ン",
    "ァ",
    "ィ",
    "ゥ",
    "ェ",
    "ォ",
    "ャ",
    "ュ",
    "ョ",
    "ッ",
    "゛",
    "゜",
    "ー",
  ];
  if (currentString.length === 0 && cantBeFirst.includes(newCharacter)) return;

  const lastChar = currentString.slice(-1);

  //「ー」 cannot be added to 「ッ」 and 「ン」
  if (newCharacter === "ー") {
    if (lastChar === "ッ" || lastChar === "ン" || lastChar === "ー") return;
    else return currentString.concat(newCharacter);
  }

  // characters that can be followed by the lowercase characters
  const fstLowerCharSet = ["ャ", "ュ", "ョ"];
  const fstSetAppendable = [
    "キ",
    "シ",
    "チ",
    "ニ",
    "ヒ",
    "ミ",
    "リ",

    // dakuten
    "ギ",
    "ジ",
    "ヂ",
    "ビ",

    //handakuten
    "ピ",
  ];

  const sndLowerCharSet = ["ァ", "ィ", "ｩ", "ェ", "ォ"];
  const sndSetAppendable = ["フ"];

  if (fstLowerCharSet.includes(newCharacter)) {
    if (fstSetAppendable.includes(lastChar))
      return currentString.concat(newCharacter);
    else return;
  } else if (sndLowerCharSet.includes(newCharacter)) {
    if (sndSetAppendable.includes(lastChar))
      return currentString.concat(newCharacter);
    else return;
  }

  // for 「ッ」, it can added to any character except itself
  if (newCharacter === "ッ") {
    if (lastChar !== "ッ") return currentString.concat(newCharacter);
    else return;
  }

  // characters that can be modified with dakuten
  if (newCharacter === "゛") {
    const modifiableByDakuten = {
      カ: "ガ",
      キ: "ギ",
      ク: "グ",
      ケ: "ゲ",
      コ: "ゴ",
      サ: "ザ",
      シ: "ジ",
      ス: "ズ",
      セ: "ゼ",
      ソ: "ゾ",
      タ: "ダ",
      チ: "ヂ",
      ツ: "ヅ",
      テ: "デ",
      ト: "ド",
      ハ: "バ",
      ヒ: "ビ",
      フ: "ブ",
      ヘ: "ベ",
      ホ: "ボ",
    };
    const modified =
      modifiableByDakuten[lastChar as keyof typeof modifiableByDakuten];

    if (modified) return currentString.slice(0, -1) + modified;
    else return;
  }
  // will look into this
  //*Although 「ヂ、ヅ」 are included in the character table that  Ad posted, I couldn't select them.

  // characters that can be modified with handakuten
  if (newCharacter === "゜") {
    const modifiableByHandakuten = {
      ハ: "パ",
      ヒ: "ピ",
      フ: "プ",
      ヘ: "ペ",
      ホ: "ポ",
    };

    const modified =
      modifiableByHandakuten[lastChar as keyof typeof modifiableByHandakuten];

    if (modified) return currentString.slice(0, -1) + modified;
    else return;
  }

  return currentString.concat(newCharacter);
};

export const handleUserAuthorizationMove = (
  matrixIndices: AuthorizeUserMatrixIndices,
  direction: string
): AuthorizeUserMatrixIndices | undefined => {
  const funcs = {
    up: (matIndices: AuthorizeUserMatrixIndices) => ({
      ...matIndices,
      rowIdx: matIndices.rowIdx - 1,
    }),
    down: (matIndices: AuthorizeUserMatrixIndices) => ({
      ...matIndices,
      rowIdx: matIndices.rowIdx + 1,
    }),
    left: (matIndices: AuthorizeUserMatrixIndices) => ({
      ...matIndices,
      colIdx: matIndices.colIdx - 1,
    }),
    right: (matIndices: AuthorizeUserMatrixIndices) => ({
      ...matIndices,
      colIdx: matIndices.colIdx + 1,
    }),
  };

  const boundaries = {
    up: (matIndices: AuthorizeUserMatrixIndices) => matIndices.rowIdx === 0,
    down: (matIndices: AuthorizeUserMatrixIndices) => matIndices.rowIdx === 4,
    left: (matIndices: AuthorizeUserMatrixIndices) => matIndices.colIdx === 0,
    right: (matIndices: AuthorizeUserMatrixIndices) => matIndices.colIdx === 12,
  };

  const isBoundary = boundaries[direction as keyof typeof boundaries](
    matrixIndices
  );

  if (isBoundary) return;

  const res = funcs[direction as keyof typeof funcs](matrixIndices);
  const chosenCharacter = authorize_user_letters.matrix[res.rowIdx][res.colIdx];

  if (chosenCharacter) return res;
  else return handleUserAuthorizationMove(res, direction);
};
