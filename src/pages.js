// <nowiki>
import utils from "./utils.js";

const specialQueryChars = '~*\\?-"!';

/**
 * Escape the given query.
 * @param {string} query The query to escape.
 * @returns {string} The escaped query.
 */
function escapeQuery(query) {
  for (const specialChar of specialQueryChars)
    query = query.replaceAll(specialChar, "\\" + specialChar);
  return query;
}

/**
 * Search for pages that match the given query.
 * @param {string} query A query.
 * @param {number[]?} namespaces A list of namespaces IDs to search into. If null or empty, all namespaces will be searched.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the builtin `fetch()` function will be used instead.
 * @returns {Promise<string[]>} The list of matching page titles.
 */
async function searchPages(query, namespaces, api) {
  /**
   * @type {{
   *  query?: {
   *    pages: Record<string, { title: string }>
   *  }
   * }}
   */
  const json = await utils.queryWikiApi(
    {
      action: "query",
      generator: "search",
      gsrsearch: escapeQuery(query) + "*",
      gsrnamespace:
        namespaces && namespaces.length ? namespaces.join("|") : "*",
      gsrlimit: 50,
      format: "json",
    },
    api
  );

  const results = [];
  if (json.query)
    for (const { title } of Object.values(json.query.pages))
      results.push(title);

  return results;
}

/**
 * Fetch information about the wiki’s namespaces.
 * @param {mw.Api?} api The MediaWiki API to use. If no value is provided, the builtin `fetch()` function will be used instead.
 * @returns {Promise<import("./types.js").Namespace[]>}
 */
async function getNamespacesInfo(api) {
  /**
   * @type {{
   *  query: {
   *    namespaces: Record<string, {
   *      id: number,
   *      case: string,
   *      name: string,
   *      subpages: boolean,
   *      canonical?: string,
   *      content: boolean,
   *      nonincludable: boolean,
   *    }>,
   *    namespacealiases: {
   *      id: number,
   *      alias: string,
   *    }[],
   *  }
   * }}
   */
  const json = await utils.queryWikiApi(
    {
      action: "query",
      meta: "siteinfo",
      siprop: "namespaces|namespacealiases",
      formatversion: 2,
      format: "json",
    },
    api
  );

  const { namespacealiases: namespaceAliases, namespaces } = json.query;
  /**
   * @type {import("./types.js").Namespace[]}
   */
  const results = [];
  for (const { id, name, canonical, subpages } of Object.values(namespaces)) {
    const aliases = [];
    for (const { id: aliasId, alias } of namespaceAliases)
      if (id === aliasId) aliases.push(alias);
    results.push({
      id,
      name,
      canonicalName: canonical || "",
      aliases,
      allowsSubpages: subpages,
    });
  }

  return results;
}

/**
 * Extract the namespace info for the given page title.
 * @param {string} pageTitle A page title to extract namespace info from.
 * @param {import("./types.js").Namespace[]} namespacesInfo An array containing information for all wiki namespaces.
 * @returns {import("./types.js").Namespace}
 */
function extractNamespace(pageTitle, namespacesInfo) {
  pageTitle = pageTitle.toLocaleLowerCase();
  for (const namespace of namespacesInfo)
    if (
      pageTitle.startsWith(namespace.name.toLocaleLowerCase() + ":") ||
      pageTitle.startsWith(namespace.canonicalName.toLocaleLowerCase() + ":") ||
      namespace.aliases.some((alias) =>
        pageTitle.startsWith(alias.toLocaleLowerCase() + ":")
      )
    )
      return namespace;
  return namespacesInfo.filter((ns) => ns.id === 0)[0];
}

/**
 * Remove the namespace prefix from the given page title.
 * @param {string} pageTitle A page title.
 * @param {import("./types.js").Namespace[]} namespacesInfo An array containing information for all wiki namespaces.
 * @returns {string} The page title without the namespace name.
 */
function stripNamespace(pageTitle, namespacesInfo) {
  const namespace = extractNamespace(pageTitle, namespacesInfo);
  if (namespace.id !== 0 && pageTitle.includes(":"))
    return pageTitle.substring(pageTitle.indexOf(":") + 1);
  return pageTitle;
}

// </nowiki>

export default {
  escapeQuery,
  searchPages,
  getNamespacesInfo,
  extractNamespace,
  stripNamespace,
};
