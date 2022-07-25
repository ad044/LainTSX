import { addCharacter } from "@/utils/boot";

it("Handles the logic for Japanese characters", () => {
  // cant be first character check
  expect(addCharacter("", "ン")).toEqual("");
  // if its not first, then fine
  expect(addCharacter("キ", "ン")).toEqual("キン");
  //「ー」 cannot be added to 「ッ」 and 「ン」or itself
  expect(addCharacter("キッ", "ー")).toEqual("キッ");
  expect(addCharacter("キン", "ー")).toEqual("キン");
  expect(addCharacter("キー", "ー")).toEqual("キー");
  // characters that can be followed by the lowercase characters
  expect(addCharacter("キ", "ャ")).toEqual("キャ");
  // cant be followed by lowercase character
  expect(addCharacter("ー", "ャ")).toEqual("ー");
  // for 「ッ」, it can added to any character except itself
  expect(addCharacter("ャ", "ッ")).toEqual("ャッ");
  // cant be added
  expect(addCharacter("ッ", "ッ")).toEqual("ッ");
  // dakuten
  expect(addCharacter("カ", "゛")).toEqual("ガ");
  // cant be appended
  expect(addCharacter("ガ", "゛")).toEqual("ガ");
  // handakuten
  expect(addCharacter("ハ", "゜")).toEqual("パ");
  // cant be appended
  expect(addCharacter("キ", "゜")).toEqual("キ");
  expect(addCharacter("パ", "゜")).toEqual("パ");
});
