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
 * Get the static URL for the given image file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @returns {Promise<string | null>} The corresponding static URl or null if the file does not exist.
 */
async function getImageFileUrl(pageName) {
  // Return default image for local testing
  if (location.hostname === "localhost")
    return "https://upload.wikimedia.org/wikipedia/commons/2/28/Testbeeld_MK8.png";

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

/**
 * @typedef {{
 *  src: string,
 *  type: string,
 * }} VideoFileSource
 */

/**
 * Get the static URLs for the given vide file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @returns {Promise<VideoFileSource[] | null>} The corresponding static URls or null if the file does not exist.
 */
async function getVideoFileUrls(pageName) {
  // Return default video for local testing
  if (location.hostname === "localhost")
    return [
      {
        type: 'video/ogg; codecs="theora, vorbis"',
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Test.ogv",
      },
      {
        type: 'video/webm; codecs="vp8, vorbis"',
        src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6b/Test.ogv/Test.ogv.360p.webm",
      },
      {
        type: 'video/webm; codecs="vp9, opus"',
        src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6b/Test.ogv/Test.ogv.240p.vp9.webm",
      },
    ];

  const params = new URLSearchParams();
  params.append("action", "query");
  params.append("titles", `File:${pageName}`);
  params.append("prop", "videoinfo");
  params.append("viprop", "derivatives");
  params.append("format", "json");
  const response = await fetch(`/w/api.php?${params}`);
  const json = await response.json();
  const pageInfo = json.query.pages["-1"];
  return pageInfo.videoinfo ? pageInfo.videoinfo[0].derivatives : null;
}

/**
 * Capitalize the first letter of the given string.
 * @param {string} s A string.
 * @returns {string} The input string with its first letter capitalized.
 */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

// </nowiki>

export default {
  userGenderSwitch,
  getNextId,
  getImageFileUrl,
  getVideoFileUrls,
  capitalize,
};
