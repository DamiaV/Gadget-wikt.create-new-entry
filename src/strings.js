// <nowiki>
/**
 * Select the text based the given gender.
 * @param {"unknown" | "female" | "male"} gender A gender.
 * @param {string} unknown The text for unknown gender.
 * @param {string} female The text for female gender.
 * @param {string} male The text for male gender.
 * @returns {string} The text corresponding to the user’s gender.
 */
function userGenderSwitch(gender, unknown, female, male) {
  switch (gender) {
    case "unknown":
      return unknown;
    case "female":
      return female;
    case "male":
      return male;
  }
}

/**
 * Capitalize the first letter of the given string.
 * @param {string} s A string.
 * @returns {string} The input string with its first letter capitalized.
 */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

/**
 * Extract the trailing whitespace from the given text and return all three parts separately.
 * @param {string} text The text to transform.
 * @returns {[string, string, string]} A triple containing the leading whitespace, the stripped text, and the tailing whitespace.
 */
function extractTrailingWhitespace(text) {
  if (!text) return ["", "", ""];
  if (/^\s+$/.test(text)) return [text, "", ""];
  // The "s" (dotAll) flag is not available prior to ES2018
  const match = /^(\s*)(\S[\S\s]*?)(\s*)$/.exec(text);
  return [match[1], match[2], match[3]];
}

/**
 * Apply the specified substitutions to the given string.
 * Substitutions are applied following the insertion order of the second argument.
 * @param {string} string The string to transform.
 * @param {Record<string, string>} substitutionTable An object containing the substitutions to make.
 * @returns The transformed string.
 */
function substitute(string, substitutionTable) {
  for (const [searchValue, replaceValue] of Object.entries(substitutionTable))
    string = string.replaceAll(searchValue, replaceValue);
  return string;
}

// </nowiki>
/**
 * This module defines functions to manipulate strings.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/strings.js]]
 */
export default {
  userGenderSwitch,
  capitalize,
  extractTrailingWhitespace,
  substitute,
};
