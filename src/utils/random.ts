export const randomFrom = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
