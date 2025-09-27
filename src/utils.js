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
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the builtin `fetch()` function will be used instead.
 * @returns {Promise<string | null>} The corresponding static URl or null if the file does not exist.
 */
async function getImageFileUrl(pageName, api) {
  /**
   * @type {{
   *  query: {
   *    pages: {
   *      "-1": {
   *        imageinfo?: {
   *          url: string,
   *          mediatype: string,
   *        }[]
   *      }
   *    }
   *  }
   * }}
   */
  const json = await queryWikiApi(
    {
      action: "query",
      titles: `File:${pageName}`,
      prop: "imageinfo",
      iiprop: "url|mediatype",
      format: "json",
    },
    api
  );
  const { imageinfo } = json.query.pages["-1"];
  if (!imageinfo) return null;

  const { mediatype, url } = imageinfo[0];
  // bitmap = png, jpg, gif, bmp; drawing = svg
  return ["BITMAP", "DRAWING"].includes(mediatype) ? url : null;
}

/**
 * @typedef {{
 *  src: string,
 *  type: string,
 * }} MediaFileSource
 */
/**
 * @typedef {{
 *  thumbUrl: string,
 *  sources: MediaFileSource[],
 * }} VideoFileSources
 */

/**
 * Get the static URLs for the given video file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the builtin `fetch()` function will be used instead.
 * @returns {Promise<VideoFileSources | null>} The corresponding static URls or null if the file does not exist.
 */
async function getVideoFileUrls(pageName, api) {
  const fileName = `File:${pageName}`;
  /**
   * @type {{
   *  query: {
   *    pages: {
   *      "-1": {
   *        videoinfo?: {
   *          mediatype: string,
   *          derivatives: MediaFileSource[],
   *          width: number,
   *        }[]
   *      }
   *    }
   *  }
   * }}
   */
  const json = await queryWikiApi(
    {
      action: "query",
      titles: fileName,
      prop: "videoinfo",
      viprop: "derivatives|size|mediatype",
      format: "json",
    },
    api
  );
  const { videoinfo } = json.query.pages["-1"];
  if (!videoinfo) return null;

  const { mediatype, derivatives, width } = videoinfo[0];
  if (mediatype !== "VIDEO") return null;

  /**
   * @type {{
   *  query: {
   *    pages: {
   *      "-1": {
   *        videoinfo: { thumburl: string }[]
   *      }
   *    }
   *  }
   * }}
   */
  const json2 = await queryWikiApi(
    {
      action: "query",
      titles: fileName,
      prop: "videoinfo",
      viprop: "url",
      viurlwidth: width,
      format: "json",
    },
    api
  );
  const { videoinfo: thumbVideoInfo } = json2.query.pages["-1"];

  return {
    thumbUrl: thumbVideoInfo[0].thumburl,
    sources: derivatives,
  };
}

/**
 * Get the static URLs for the given audio file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the builtin `fetch()` function will be used instead.
 * @returns {Promise<MediaFileSource[] | null>} The corresponding static URls or null if the file does not exist.
 */
async function getAudioFileUrls(pageName, api) {
  /**
   * @type {{
   *  query: {
   *    pages: {
   *      "-1": {
   *        videoinfo?: {
   *          mediatype: string,
   *          derivatives: MediaFileSource[],
   *        }[]
   *      }
   *    }
   *  }
   * }}
   */
  const json = await queryWikiApi(
    {
      action: "query",
      titles: `File:${pageName}`,
      prop: "videoinfo",
      viprop: "derivatives|mediatype",
      format: "json",
    },
    api
  );
  const { videoinfo } = json.query.pages["-1"];
  if (!videoinfo) return null;

  const { mediatype, derivatives } = videoinfo[0];
  if (mediatype !== "AUDIO") return null;

  return derivatives;
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
 * Send a GET query to the wiki’s API.
 * @param {Record<string, any>} params The request’s GET parameters.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the builtin `fetch()` function will be used instead.
 * @returns {Promise<Record<string, any>>}
 */
async function queryWikiApi(params, api) {
  if (api) return await api.get(params);
  // For local testing
  const args = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) args.append(name, value);
  const response = await fetch(`https://fr.wiktionary.org/w/api.php?${args}`);
  return await response.json();
}

// </nowiki>
/**
 * This module defines utility functions.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/utils.js]]
 */
export default {
  userGenderSwitch,
  getNextId,
  getImageFileUrl,
  getVideoFileUrls,
  getAudioFileUrls,
  queryWikiApi,
  capitalize,
};
