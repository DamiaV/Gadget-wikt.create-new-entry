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
 * Return the next id from the given array.
 * @param {{id: number}[]} objectsWithId An array of objects with an numerical "id" property.
 * @returns {number} The maximum id of the list + 1, or 1 if the array is empty.
 */
function getNextId(objectsWithId) {
  if (objectsWithId.length === 0) return 1;
  return Math.max(...objectsWithId.map((e) => e.id)) + 1;
}

/**
 * Get the static URL for the given file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @returns {Promise<string | null>} The corresponding static URl or null if the file does not exist.
 */
async function getFileUrl(pageName) {
  const params = new URLSearchParams();
  params.append("action", "query");
  params.append("titles", `File:${pageName}`);
  params.append("prop", "imageinfo");
  params.append("iiprop", "url");
  params.append("format", "json");
  const response = await fetch(`/w/api.php?${params}`);
  const json = await response.json();
  const pageInfo = json.query.pages["-1"];
  return pageInfo.imageinfo ? pageInfo.imageinfo[0].url : null;
}

// </nowiki>

export default {
  userGenderSwitch,
  getNextId,
  getFileUrl,
};
