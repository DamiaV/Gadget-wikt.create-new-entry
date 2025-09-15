// <nowiki>
const specialCharacters = [
  "à",
  "À",
  "â",
  "Â",
  "æ",
  "Æ",
  "ç",
  "Ç",
  "é",
  "É",
  "è",
  "È",
  "ê",
  "Ê",
  "ë",
  "Ë",
  "î",
  "Î",
  "ï",
  "Ï",
  "ô",
  "Ô",
  "œ",
  "Œ",
  "ſ",
  "ù",
  "Ù",
  "û",
  "Û",
  "ü",
  "Ü",
  "ÿ",
  "Ÿ",
  "«\u00a0",
  "\u00a0»",
  "’",
];

/**
 * Generate the wikitext for the given form data.
 * @param {import("./types.js").FormData} formData
 */
function generateWikitext(formData) {
  for (const entry of formData.entries) {
    console.log(entry); // TODO
  }
}

export default {
  specialCharacters,
  generateWikitext,
};
// </nowiki>
