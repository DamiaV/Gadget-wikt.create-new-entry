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

const DISPLAY_MODE_PREF = "cne-displayMode";
const FAVORITED_SECTIONS_PREF = "cne-favoritedSections";
const NO_FORM_VALIDITY_CHECK_PREF = "cne-formValidityCheckingDisabled";
const TAB_CLOSE_WARNING_PREF = "cne-tabClosingWarningDisabled";
const HIDE_INTRO_MESSAGE_PREF = "introMessageHidden";
const HIDE_WARNING_INTRO_MESSAGE_PREF = "warningIntroMessageHidden";

/**
 * Fetch the preferences of the current user.
 * @param {string?} username The user’s username. If no value is provided, `mw.storage` will be used instead.
 * @param {mw.Api} api The MediaWiki API to use.
 * @returns {Promise<import("./types.js").UserPreferences>} The fetched preferences.
 */
async function getUserPreferences(username, api) {
  if (!username) {
    const getFlag = (key) => mw.storage.get(key) === "1";

    let displayMode = String(mw.storage.get(DISPLAY_MODE_PREF));
    if (!["minimal", "compact", "full"].includes(displayMode))
      displayMode = "full";

    return {
      displayMode: displayMode,
      formValidityCheckingDisabled: getFlag(NO_FORM_VALIDITY_CHECK_PREF),
      tabClosingWarningDisabled: getFlag(TAB_CLOSE_WARNING_PREF),
      introMessageHidden: getFlag(HIDE_INTRO_MESSAGE_PREF),
      warningIntroMessageHidden: getFlag(HIDE_WARNING_INTRO_MESSAGE_PREF),
      favoritedSections: mw.storage.getObject(FAVORITED_SECTIONS_PREF) || {},
    };
  }

  /**
   * @type {{
   *  query: {
   *    userinfo: {
   *      options: Record<string, string | boolean | number | null>,
   *    }
   *  },
   * }}
   */
  const json = await api.get({
    meta: "userinfo",
    uiprop: "options",
    format: "json",
    formatversion: "2",
  });
  const options = json.query.userinfo.options;

  let displayMode = String(options["userjs-" + DISPLAY_MODE_PREF]);
  if (!["minimal", "compact", "full"].includes(displayMode))
    displayMode = "full";

  let favoritedSections;
  try {
    favoritedSections = JSON.parse(
      options["userjs-" + FAVORITED_SECTIONS_PREF]
    );
  } catch (e) {
    console.warn(e);
    favoritedSections = {};
  }

  return {
    displayMode: displayMode,
    formValidityCheckingDisabled:
      options["userjs-" + NO_FORM_VALIDITY_CHECK_PREF] === "1",
    tabClosingWarningDisabled:
      options["userjs-" + TAB_CLOSE_WARNING_PREF] === "1",
    introMessageHidden: options["userjs-" + HIDE_INTRO_MESSAGE_PREF] === "1",
    warningIntroMessageHidden:
      options["userjs-" + HIDE_WARNING_INTRO_MESSAGE_PREF] === "1",
    favoritedSections: favoritedSections,
  };
}

/**
 * Save the given user preferences to their user page.
 * @param {string | null} username The user’s username. If no value is provided, `mw.storage` will be used instead.
 * @param {import("./types.js").UserPreferences} prefs The preferences to save.
 * @param {mw.Api} api The MediaWiki API to use.
 */
async function setUserPreferences(username, prefs, api) {
  if (!username) {
    mw.storage.set(DISPLAY_MODE_PREF, prefs.displayMode ? 1 : 0);
    mw.storage.set(
      NO_FORM_VALIDITY_CHECK_PREF,
      prefs.formValidityCheckingDisabled
    );
    mw.storage.set(
      TAB_CLOSE_WARNING_PREF,
      prefs.tabClosingWarningDisabled ? 1 : 0
    );
    mw.storage.set(HIDE_INTRO_MESSAGE_PREF, prefs.introMessageHidden ? 1 : 0);
    mw.storage.set(
      HIDE_WARNING_INTRO_MESSAGE_PREF,
      prefs.warningIntroMessageHidden ? 1 : 0
    );
    mw.storage.setObject(FAVORITED_SECTIONS_PREF, prefs.favoritedSections);
    return;
  }

  await api.saveOptions({
    ["userjs-" + DISPLAY_MODE_PREF]: prefs.displayMode ? 1 : 0,
    ["userjs-" + NO_FORM_VALIDITY_CHECK_PREF]:
      prefs.formValidityCheckingDisabled ? 1 : 0,
    ["userjs-" + TAB_CLOSE_WARNING_PREF]: prefs.tabClosingWarningDisabled
      ? 1
      : 0,
    ["userjs-" + HIDE_INTRO_MESSAGE_PREF]: prefs.introMessageHidden ? 1 : 0,
    ["userjs-" + HIDE_WARNING_INTRO_MESSAGE_PREF]:
      prefs.warningIntroMessageHidden ? 1 : 0,
    ["userjs-" + FAVORITED_SECTIONS_PREF]: JSON.stringify(
      prefs.favoritedSections
    ),
  });
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
