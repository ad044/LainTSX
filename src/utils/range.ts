const range = (start: number, end: number) => {
  return Array.from(new Array(end - start), (_, i) => i + start);
};

export default range;
