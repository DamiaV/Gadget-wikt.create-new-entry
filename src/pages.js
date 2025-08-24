// <nowiki>
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
 * @returns {Promise<string[]>} The list of matching page titles.
 */
async function searchPages(query, namespaces) {
  const params = new URLSearchParams();
  params.append("action", "query");
  params.append("generator", "search");
  params.append("gsrsearch", escapeQuery(query) + "*");
  if (namespaces && namespaces.length)
    params.append("gsrnamespace", namespaces.map(String).join("|"));
  else params.append("gsrnamespace", "*");
  params.append("gsrlimit", 50);
  params.append("format", "json");

  const response = await fetch(`https://fr.wiktionary.org/w/api.php?${params}`);
  /**
   * @type {{
   *  query?: {
   *    pages: {
   *      [pageId: string]: { title: string }
   *    }
   *  }
   * }}
   */
  const json = await response.json();

  const results = [];
  if (json.query)
    for (const { title } of Object.values(json.query.pages))
      results.push(title);

  return results;
}

/**
 * Fetch information about the wiki’s namespaces.
 * @returns {Promise<import("./types.js").Namespace[]>}
 */
async function getNamespacesInfo() {
  const params = new URLSearchParams();
  params.append("action", "query");
  params.append("meta", "siteinfo");
  params.append("siprop", "namespaces|namespacealiases");
  params.append("formatversion", 2);
  params.append("format", "json");

  const response = await fetch(`https://fr.wiktionary.org/w/api.php?${params}`);
  /**
   * @type {{
   *  query: {
   *    namespaces: {
   *      [id: string]: {
   *        id: number,
   *        case: string,
   *        name: string,
   *        subpages: boolean,
   *        canonical?: string,
   *        content: boolean,
   *        nonincludable: boolean,
   *      }
   *    },
   *    namespacealiases: {
   *      id: number,
   *      alias: string,
   *    }[],
   *  }
   * }}
   */
  const json = await response.json();

  const allAliases = json.query.namespacealiases;
  /**
   * @type {import("./types.js").Namespace[]}
   */
  const results = [];
  for (const { id, name, canonical, subpages } of Object.values(
    json.query.namespaces
  )) {
    const aliases = [];
    for (const { id: aliasId, alias } of allAliases)
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
