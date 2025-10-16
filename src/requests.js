// <nowiki>
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

const userPrefsPageTitle = "Gadget-wikt.create-new-entry.prefs.json";

/**
 * Fetch the preferences of the current user.
 * @param {string?} username The user’s username. If no value is provided, the browser’s local storage will be used instead.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the browser’s local storage will be used instead.
 * @returns {Promise<import("./types.js").UserPreferences>} The fetched preferences.
 */
async function getUserPreferences(username, api) {
  if (!username || !api) {
    const getFlag = (key) => localStorage.getItem(`cne-${key}`) === "true";
    return {
      minimalMode: getFlag("minimalMode"),
      formValidityCheckingDisabled: getFlag("formValidityCheckingDisabled"),
      tabClosingWarningDisabled: getFlag("tabClosingWarningDisabled"),
      introMessageHidden: getFlag("introMessageHidden"),
      warningIntroMessageHidden: getFlag("warningIntroMessageHidden"),
    };
  }

  const pageTitle = `User:${username}/${userPrefsPageTitle}`;
  /**
   * @typedef {{
   *  revisions: {
   *    slots: {
   *      main: {
   *        contentmodel: string,
   *        contentformat: string,
   *        content: string,
   *      }
   *    }
   *  }[],
   * }} Page
   */
  /**
   * @type {{
   *  query: {
   *    pages: (Page | { missing: true })[],
   *  },
   * }}
   */
  const json = await queryWikiApi(
    {
      action: "query",
      titles: pageTitle,
      prop: "revisions",
      rvprop: "content",
      rvslots: "*",
      format: "json",
      formatversion: "2",
    },
    api
  );
  const page = json.query.pages[0];
  if ("missing" in page) throw new Error(`Missing page`);

  const pageData = page.revisions[0].slots.main;
  if (pageData.contentmodel !== "json")
    throw new Error(
      `Invalid contentmodel: expected "json", got "${pageData.contentmodel}"`
    );

  return JSON.parse(pageData.content);
}

/**
 * Save the given user preferences to their user page.
 * @param {string | null} username The user’s username. If no value is provided, the browser’s local storage will be used instead.
 * @param {import("./types.js").UserPreferences} prefs The preferences to save.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the browser’s local storage will be used instead.
 */
async function setUserPreferences(username, prefs, api) {
  if (!username || !api) {
    localStorage.setItem("cne-minimalMode", prefs.minimalMode);
    localStorage.setItem(
      "cne-formValidityCheckingDisabled",
      prefs.formValidityCheckingDisabled
    );
    localStorage.setItem(
      "cne-tabClosingWarningDisabled",
      prefs.tabClosingWarningDisabled
    );
    localStorage.setItem("cne-introMessageHidden", prefs.introMessageHidden);
    localStorage.setItem(
      "cne-warningIntroMessageHidden",
      prefs.warningIntroMessageHidden
    );
    return;
  }

  const pageTitle = `User:${username}/${userPrefsPageTitle}`;
  await api.edit(pageTitle, () => JSON.stringify(prefs));
}

// </nowiki>
/**
 * This module defines async functions to query data from the wiki’s HTTPS API.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/requests.js]]
 */
export default {
  queryWikiApi,
  getImageFileUrl,
  getVideoFileUrls,
  getAudioFileUrls,
  getUserPreferences,
  setUserPreferences,
};
