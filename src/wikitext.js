// <nowiki>
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
  generateWikitext,
};
// </nowiki>
