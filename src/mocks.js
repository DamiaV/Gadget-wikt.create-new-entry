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

class MwStorage {
  /**
   * Retrieve value from device storage.
   *
   * @param {string} key Key of item to retrieve.
   * @returns {string | null | false} String value, null if no value exists, or false
   *  if storage is not available.
   */
  get(key) {
    try {
      return localStorage.getItem(key);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false;
    }
  }

  /**
   * Retrieve JSON object from device storage.
   *
   * @param {string} key Key of item to retrieve.
   * @returns {object | null | boolean} Object, null if no value exists or value
   *  is not JSON-parseable, or false if storage is not available.
   */
  getObject(key) {
    let value;
    try {
      value = localStorage.getItem(key);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false;
    }
    if (value === null) return null;
    try {
      return JSON.parse(value);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return null;
    }
  }

  /**
   * Set a value in device storage.
   *
   * @param {string} key Key name to store under.
   * @param {string} value Value to be stored.
   * @param {number} [expiry] Number of seconds after which this item can be deleted.
   * @returns The value was set.
   */
  // eslint-disable-next-line no-unused-vars
  set(key, value, expiry) {
    try {
      localStorage.setItem(key, value);
      return true;
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false;
    }
  }

  /**
   * Set an object value in device storage by JSON encoding.
   *
   * @param {string} key Key name to store under.
   * @param {object} value Object value to be stored.
   * @param {number} [expiry] Number of seconds after which this item can be deleted.
   * @returns The value was set.
   */
  // eslint-disable-next-line no-unused-vars
  setObject(key, value, expiry) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false;
    }
  }

  /**
   * Remove a value from device storage.
   *
   * @param {string} key Key of item to remove.
   * @returns {boolean} Whether the key was removed.
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false;
    }
  }

  /**
   * Set the expiry time for an item in the store.
   *
   * @param {string} key Key name.
   * @param {number} [expiry] Number of seconds after which this item can be deleted,
   *  omit to clear the expiry (either making the item never expire, or to clean up
   *  when deleting a key).
   * @returns {boolean} The expiry was set (or cleared).
   */
  // eslint-disable-next-line no-unused-vars
  setExpires(key, expiry) {
    return false;
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
  storage: new MwStorage(),
  Api,
};
