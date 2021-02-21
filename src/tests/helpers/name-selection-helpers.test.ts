import handleNameSelection from "../../helpers/name-selection-helpers";

it("Handles the logic for japanese characters", () => {
  // cant be first character check
  expect(handleNameSelection("", "ン")).toEqual(undefined);
  // if its not first, then fine
  expect(handleNameSelection("キ", "ン")).toEqual("キン");
  //「ー」 cannot be added to 「ッ」 and 「ン」or itself
  expect(handleNameSelection("キッ", "ー")).toEqual(undefined);
  expect(handleNameSelection("キン", "ー")).toEqual(undefined);
  expect(handleNameSelection("キー", "ー")).toEqual(undefined);
  // characters that can be followed by the lowercase characters
  expect(handleNameSelection("キ", "ャ")).toEqual("キャ");
  // cant be followed by lowercase character
  expect(handleNameSelection("ー", "ャ")).toEqual(undefined);
  // for 「ッ」, it can added to any character except itself
  expect(handleNameSelection("ャ", "ッ")).toEqual("ャッ");
  // cant be added
  expect(handleNameSelection("ッ", "ッ")).toEqual(undefined);
  // dakuten
  expect(handleNameSelection("カ", "゛")).toEqual("ガ");
  // cant be appended
  expect(handleNameSelection("ガ", "゛")).toEqual(undefined);
  // handakuten
  expect(handleNameSelection("ハ", "゜")).toEqual("パ");
  // cant be appended
  expect(handleNameSelection("キ", "゜")).toEqual(undefined);
  expect(handleNameSelection("パ", "゜")).toEqual(undefined);
});
