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
  params.append("iiprop", "url|mediatype");
  params.append("format", "json");
  const response = await fetch(`/w/api.php?${params}`);
  const json = await response.json();
  const pageInfo = json.query.pages["-1"];
  if (!pageInfo.imageinfo) return null;

  const imageInfo = pageInfo.imageinfo[0];

  // bitmap = png, jpg, gif, bmp; drawing = svg
  return ["BITMAP", "DRAWING"].includes(imageInfo.mediatype)
    ? imageInfo.url
    : null;
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
 * @returns {Promise<VideoFileSources | null>} The corresponding static URls or null if the file does not exist.
 */
async function getVideoFileUrls(pageName) {
  // Return default video for local testing
  if (location.hostname === "localhost")
    return {
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Test.ogv/432px--Test.ogv.jpg",
      sources: [
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
      ],
    };

  const params = new URLSearchParams();
  params.append("action", "query");
  params.append("titles", `File:${pageName}`);
  params.append("prop", "videoinfo");
  params.append("viprop", "derivatives|size|mediatype");
  params.append("format", "json");
  const response = await fetch(`/w/api.php?${params}`);
  const json = await response.json();
  const pageInfo = json.query.pages["-1"];
  if (!pageInfo.videoinfo) return null;

  const videoInfo = pageInfo.videoinfo[0];
  if (videoInfo.mediatype !== "VIDEO") return null;

  const params2 = new URLSearchParams();
  params2.append("action", "query");
  params2.append("titles", `File:${pageName}`);
  params2.append("prop", "videoinfo");
  params2.append("viprop", "url");
  params2.append("viurlwidth", videoInfo.width);
  params2.append("format", "json");
  const response2 = await fetch(`/w/api.php?${params2}`);
  const json2 = await response2.json();
  const pageInfo2 = json2.query.pages["-1"];

  return {
    thumbUrl: pageInfo2.videoinfo[0].thumburl,
    sources: videoInfo.derivatives,
  };
}

/**
 * Get the static URLs for the given audio file page on Commons.
 * @param {string} pageName The wiki page name on Commons.
 * @returns {Promise<MediaFileSource[] | null>} The corresponding static URls or null if the file does not exist.
 */
async function getAudioFileUrls(pageName) {
  // Return default audio for local testing
  if (location.hostname === "localhost")
    return [
      {
        type: 'audio/ogg; codecs="vorbis"',
        src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/35/WikiTest.mid/WikiTest.mid.ogg",
      },
      {
        type: "audio/mpeg",
        src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/35/WikiTest.mid/WikiTest.mid.mp3",
      },
      {
        type: "audio/midi",
        src: "https://upload.wikimedia.org/wikipedia/commons/3/35/WikiTest.mid",
      },
    ];

  const params = new URLSearchParams();
  params.append("action", "query");
  params.append("titles", `File:${pageName}`);
  params.append("prop", "videoinfo");
  params.append("viprop", "derivatives|mediatype");
  params.append("format", "json");
  const response = await fetch(`/w/api.php?${params}`);
  const json = await response.json();
  const pageInfo = json.query.pages["-1"];
  if (!pageInfo.videoinfo) return null;

  const videoInfo = pageInfo.videoinfo[0];
  if (videoInfo.mediatype !== "AUDIO") return null;

  return videoInfo.derivatives;
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
  getAudioFileUrls,
  capitalize,
};
