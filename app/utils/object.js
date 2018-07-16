export function pick(obj, fields) {
  return Object.keys(obj).reduce((result, currentField) => {
    if (fields.includes(currentField)) {
      return {
        ...result,
        [currentField]: obj[currentField],
      };
    }

    return result;
  }, {});
}
