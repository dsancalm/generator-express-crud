const primitives = ["string", "number", "bigint", "boolean", "symbol"];
// eslint-disable-next-line func-names
module.exports = function validate(modelFile, doc) {
  // Check if exists keys
  let keys = Object.keys(doc);
  if (keys.length === 0) {
    throw new SyntaxError("File " + modelFile + " not have any keys defined");
  }

  // Check for each key
  keys.forEach(key => {
    // Check the if exists at least 1 child key
    let childKeys = Object.keys(doc[key]);
    if (childKeys.length === 0) {
      throw new SyntaxError(
        "File " + modelFile + " not have any childKeys defined"
      );
    }

    // For each childKey check...
    childKeys.forEach(childKey => {
      // The type of child key is string (Not a number, not a symbol, not a complex type...)
      if (typeof doc[key][childKey] !== "string") {
        throw new SyntaxError(
          "File " + modelFile + " has childKeys with complex types"
        );
      }

      const containsString = primitives.some(element => {
        return element.toLowerCase() === doc[key][childKey].toLowerCase();
      });
      // Check if child key is a primitive
      if (!containsString) {
        throw new SyntaxError(
          "File " +
            modelFile +
            " has childKeys value with unknown primitive types"
        );
      }
    });
  });
};
