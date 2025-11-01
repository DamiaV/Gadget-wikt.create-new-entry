// <nowiki>
/**
 * Get the static URL for the given image file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @param {mw.Api} api The MediaWiki API to use.
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
  const json = await api.get({
    action: "query",
    titles: `File:${pageName}`,
    prop: "imageinfo",
    iiprop: "url|mediatype",
    format: "json",
  });
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
 * @param {mw.Api} api The MediaWiki API to use.
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
  const json = await api.get({
    action: "query",
    titles: fileName,
    prop: "videoinfo",
    viprop: "derivatives|size|mediatype",
    format: "json",
  });
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
  const json2 = await api.get({
    action: "query",
    titles: fileName,
    prop: "videoinfo",
    viprop: "url",
    viurlwidth: width,
    format: "json",
  });
  const { videoinfo: thumbVideoInfo } = json2.query.pages["-1"];

  return {
    thumbUrl: thumbVideoInfo[0].thumburl,
    sources: derivatives,
  };
}

/**
 * Get the static URLs for the given audio file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @param {mw.Api} api The MediaWiki API to use.
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
  const json = await api.get({
    action: "query",
    titles: `File:${pageName}`,
    prop: "videoinfo",
    viprop: "derivatives|mediatype",
    format: "json",
  });
  const { videoinfo } = json.query.pages["-1"];
  if (!videoinfo) return null;

  const { mediatype, derivatives } = videoinfo[0];
  if (mediatype !== "AUDIO") return null;

  return derivatives;
}

/**
 * Render the given wikitext through the wiki’s API.
 * @param {string} wikitext The wikitext to render.
 * @param {string} word The current page’s title.
 * @param {string} skin The internal name of the skin to use.
 * @param {mw.Api} api The MediaWiki API to use.
 * @returns The rendered wikitext.
 */
async function renderWikitext(wikitext, word, skin, api) {
  /**
   * @type {{
   *  parse: {
   *    text: string,
   *  }
   * }}
   */
  const json = await api.get({
    action: "parse",
    title: word,
    text: wikitext,
    contentformat: "text/x-wiki",
    contentmodel: "wikitext",
    useskin: skin,
    disabletoc: true,
    disablelimitreport: true,
    disableeditsection: true,
    preview: true,
    format: "json",
    formatversion: 2,
  });

  return json.parse.text;
}

const userPrefsPageTitle = "Gadget-wikt.create-new-entry.prefs.json";

/**
 * Fetch the preferences of the current user.
 * @param {string?} username The user’s username. If no value is provided, the browser’s local storage will be used instead.
 * @param {mw.Api} api The MediaWiki API to use.
 * @returns {Promise<import("./types.js").UserPreferences>} The fetched preferences.
 */
async function getUserPreferences(username, api) {
  if (!username) {
    const getFlag = (key) => localStorage.getItem(`cne-${key}`) === "true";
    return {
      minimalMode: getFlag("minimalMode"),
      formValidityCheckingDisabled: getFlag("formValidityCheckingDisabled"),
      tabClosingWarningDisabled: getFlag("tabClosingWarningDisabled"),
      introMessageHidden: getFlag("introMessageHidden"),
      warningIntroMessageHidden: getFlag("warningIntroMessageHidden"),
      favoritedSections:
        JSON.parse(localStorage.getItem("cne-favoritedSections")) || {},
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
  const json = await api.get({
    action: "query",
    titles: pageTitle,
    prop: "revisions",
    rvprop: "content",
    rvslots: "*",
    format: "json",
    formatversion: "2",
  });
  const page = json.query.pages[0];
  if ("missing" in page) throw new Error(`Missing page`);

  const pageData = page.revisions[0].slots.main;
  if (pageData.contentmodel !== "json")
    throw new Error(
      `Invalid contentmodel: expected "json", got "${pageData.contentmodel}"`
    );

  const rawPrefs = JSON.parse(pageData.content);
  return {
    minimalMode: !!rawPrefs.minimalMode,
    formValidityCheckingDisabled: !!rawPrefs.formValidityCheckingDisabled,
    tabClosingWarningDisabled: !!rawPrefs.tabClosingWarningDisabled,
    introMessageHidden: !!rawPrefs.introMessageHidden,
    warningIntroMessageHidden: !!rawPrefs.warningIntroMessageHidden,
    favoritedSections: rawPrefs.favoritedSections || {},
  };
}

/**
 * Save the given user preferences to their user page.
 * @param {string | null} username The user’s username. If no value is provided, the browser’s local storage will be used instead.
 * @param {import("./types.js").UserPreferences} prefs The preferences to save.
 * @param {mw.Api} api The MediaWiki API to use.
 */
async function setUserPreferences(username, prefs, api) {
  if (!username) {
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
    localStorage.setItem(
      "cne-favoritedSections",
      JSON.stringify(prefs.favoritedSections)
    );
    return;
  }

  const pageTitle = `User:${username}/${userPrefsPageTitle}`;
  const summary = "Sauvegarde des préférences";
  try {
    await api.edit(pageTitle, () => ({
      text: JSON.stringify(prefs),
      summary,
    }));
  } catch (e) {
    if (e === "nocreate-missing")
      await api.create(pageTitle, { summary }, JSON.stringify(prefs));
    else throw e;
  }
}

// </nowiki>
/**
 * This module defines async functions to query data from the wiki’s HTTPS API.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/requests.js]]
 */
export default {
  getImageFileUrl,
  getVideoFileUrls,
  getAudioFileUrls,
  renderWikitext,
  getUserPreferences,
  setUserPreferences,
};
