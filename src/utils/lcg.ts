const LCG = (a: number, c: number, m: number, s: number) => () =>
  (s = (s * a + c) % m);

export default LCG;
