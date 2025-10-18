/**
 * This module provides mocks for parts of MediaWiki’s global `mw` object.
 */
import mw_config_logged_out from "./mw.config.values.logged-out.json";
import mw_config_logged_in from "./mw.config.values.logged-in.json";

class Api {
  /**
   * @param {mw.Api.Options} [options] See {@link mw.Api.Options}. This can also be overridden for
   *  each request by passing them to {@link get()} or {@link post()} (or directly to {@link ajax()}) later on.
   */
  constructor(options) {
    this._options = options;
  }

  /**
   * @param {string | mw.Title} title Page title (True type: TitleLike)
   * @param {Record<string, string | number | boolean | File | string[] | number[] | undefined>} params Edit API parameters (True type: ApiEditPageParams)
   * @param {string} content Page content
   * @returns {Promise<never>}
   */
  // eslint-disable-next-line no-unused-vars
  async create(title, params, content) {
    throw new Error("not implemented");
  }

  /**
   * @param {string | mw.Title} title Page title (True type: TitleLike)
   * @param {mw.Api.EditTransform} transform Callback that prepares the edit
   * @returns {Promise<never>}
   */
  // eslint-disable-next-line no-unused-vars
  async edit(title, transform) {
    throw new Error("not implemented");
  }

  /**
   * @param {Record<string, string | number | boolean | File | string[] | number[] | undefined>} parameters (True type: UnknownApiParams)
   */
  async get(parameters) {
    const args = new URLSearchParams();
    for (const [name, value] of Object.entries(parameters))
      args.append(name, value);
    const response = await fetch(
      `https://fr.wiktionary.org/w/api.php?${args}`,
      {
        headers: {
          "Api-User-Agent": this._options.userAgent,
        },
      }
    );
    return await response.json();
  }
}

/**
 * @type {Record<string, any>}
 */
const mw_config = new URLSearchParams(location.search).has("logged_in")
  ? mw_config_logged_in
  : mw_config_logged_out;

window.mw = {
  config: new Map(Object.entries(mw_config)),
  notify(message, options) {
    const type = (options.type || "info").toUpperCase();
    console.log(`[${type}] mw.notify: ${message}`);
  },
  Api,
};
