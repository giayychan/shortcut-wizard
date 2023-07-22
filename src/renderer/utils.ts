const mapArrayWithId = (source: any[]): any[] => {
  if (!source) return source;
  if (!Array.isArray(source)) return source;

  return source.map((value, index) => ({
    id: index,
    value: mapArrayWithId(value),
  }));
};

export default mapArrayWithId;
