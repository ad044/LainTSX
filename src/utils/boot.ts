import { Direction, MatrixIndex2D } from "@/types";

const letterMatrix = [
  [
    "ッ",
    "ャ",
    "ァ",
    "ワ",
    "ラ",
    "ヤ",
    "マ",
    "ハ",
    "ナ",
    "タ",
    "サ",
    "カ",
    "ア",
  ],
  [
    null,
    null,
    "ィ",
    null,
    "リ",
    null,
    "ミ",
    "ヒ",
    "ニ",
    "チ",
    "シ",
    "キ",
    "イ",
  ],
  ["゛", "ュ", "ｩ", null, "ル", "ユ", "ム", "フ", "ヌ", "ツ", "ス", "ク", "ウ"],
  [
    "゜",
    null,
    "ェ",
    null,
    "レ",
    null,
    "メ",
    "ヘ",
    "ネ",
    "テ",
    "セ",
    "ケ",
    "エ",
  ],
  [
    "ー",
    "ョ",
    "ォ",
    "ン",
    "ロ",
    "ヨ",
    "モ",
    "ホ",
    "ノ",
    "ト",
    "ソ",
    "コ",
    "オ",
  ],
];

// huge thanks to oo for help with this!!
export const addCharacter = (
  currentString: string,
  newCharacter: string
): string => {
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
  if (currentString.length === 0 && cantBeFirst.includes(newCharacter)) {
    return currentString;
  }

  const lastChar = currentString.slice(-1);

  //「ー」 cannot be added to 「ッ」 and 「ン」
  if (newCharacter === "ー") {
    if (lastChar === "ッ" || lastChar === "ン" || lastChar === "ー") {
      return currentString;
    } else {
      return currentString.concat(newCharacter);
    }
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
    if (fstSetAppendable.includes(lastChar)) {
      return currentString.concat(newCharacter);
    } else {
      return currentString;
    }
  } else if (sndLowerCharSet.includes(newCharacter)) {
    if (sndSetAppendable.includes(lastChar)) {
      return currentString.concat(newCharacter);
    } else {
      return currentString;
    }
  }

  // for 「ッ」, it can added to any character except itself
  if (newCharacter === "ッ") {
    if (lastChar !== "ッ") {
      return currentString.concat(newCharacter);
    } else {
      return currentString;
    }
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

    if (modified) {
      return currentString.slice(0, -1) + modified;
    } else {
      return currentString;
    }
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

    if (modified) {
      return currentString.slice(0, -1) + modified;
    } else {
      return currentString;
    }
  }

  return currentString.concat(newCharacter);
};

const getNextIndices = (
  index: MatrixIndex2D,
  direction: Direction
): MatrixIndex2D => {
  const { row, col } = index;
  switch (direction) {
    case Direction.Up:
      return { ...index, row: row - 1 };
    case Direction.Down:
      return { ...index, row: row + 1 };
    case Direction.Left:
      return { ...index, col: col - 1 };
    case Direction.Right:
      return { ...index, col: col + 1 };
  }
};

const canMoveInDirection = (
  { row, col }: MatrixIndex2D,
  direction: Direction
) => {
  switch (direction) {
    case Direction.Up:
      return row > 0;
    case Direction.Down:
      return row < 4;
    case Direction.Left:
      return col > 0;
    case Direction.Right:
      return col < 12;
  }
};

export const moveCursor = (
  index: MatrixIndex2D,
  direction: Direction
): MatrixIndex2D => {
  if (!canMoveInDirection(index, direction)) {
    return index;
  }

  const newIndices = getNextIndices(index, direction);

  const chosenCharacter = letterMatrix[index.row][index.col];

  if (chosenCharacter) {
    return newIndices;
  } else {
    return moveCursor(newIndices, direction);
  }
};

export const getCharacter = (index: MatrixIndex2D) => {
  return letterMatrix[index.row][index.col];
};
