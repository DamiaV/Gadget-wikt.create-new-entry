/**
 * Data type definitions for the gadget.
 */
// <nowiki>

import {
  cdxIconLogoWikibooks,
  cdxIconLogoWikidata,
  cdxIconLogoWikimediaCommons,
  cdxIconLogoWikinews,
  cdxIconLogoWikipedia,
  cdxIconLogoWikiquote,
  cdxIconLogoWikisource,
  cdxIconLogoWikispecies,
  cdxIconLogoWikiversity,
  cdxIconLogoWikivoyage,
} from "@wikimedia/codex-icons";

/**
 * @typedef {{
 *  id: number,
 *  name: string,
 *  canonicalName: string,
 *  aliases: string[],
 *  allowsSubpages: boolean,
 * }} Namespace
 */

/**
 * @typedef {{
 *  word: string,
 *  userGender: string,
 *  namespaces: Namespace[],
 * }} AppConfig
 */

/*
 * Event types
 */

/**
 * @typedef {{
 *  index: number,
 *  entry: Entry,
 * }} FormEntryUpdateEvent
 */

/**
 * @typedef {{
 *  index: number,
 *  definition: Definition,
 * }} DefinitionUpdateEvent
 */

/**
 * @typedef {{
 *  index: number,
 *  example: Example,
 * }} ExampleUpdateEvent
 */

/**
 * @typedef {{
 *  index: number,
 *  pronunciation: Pronunciation,
 * }} PronunciationUpdateEvent
 */

/*
 * Data types
 */

/**
 * @typedef {{
 *  language: Language,
 *  stub: boolean,
 *  entries: Entry[],
 *  etymology: string,
 *  wikiLinks: {
 *    [wikiName: string]: {
 *      pageTitle?: string,
 *      text?: string,
 *      enabled: boolean,
 *    }
 *  },
 *  categories: string[],
 * }} FormData
 */

/**
 * @typedef {{
 *  id: number,
 *  wordType: string,
 *  wordProperties: string[],
 *  definitions: Definition[],
 *  pronunciations: Pronunciation[],
 *  empty: boolean,
 * }} Entry
 */

/**
 * Type for a single definition and its examples.
 * @typedef {{
 *  id: number,
 *  text: string,
 *  examples: Example[],
 *  illustration?: Illustration,
 *  empty: boolean,
 * }} Definition
 */

/**
 * Type for a single word usage example.
 * @typedef {{
 *  id: number,
 *  text: string,
 *  translation?: string,
 *  transcription?: string,
 *  source?: string,
 *  link?: string,
 *  disableTranslation?: boolean,
 *  empty: boolean,
 * }} Example
 */

/**
 * @typedef {{
 *  id: number,
 *  pronunciation: string,
 *  empty: boolean,
 * }} Pronunciation
 */

/**
 * @typedef {MediaIllustration | TextIllustration | ColorIllustration} Illustration
 */

/**
 * @typedef {{
 *  type: "image" | "video" | "audio",
 *  fileName: string,
 *  description?: string,
 *  alt?: string,
 *  empty: boolean,
 * }} MediaIllustration
 */

/**
 * @typedef {{
 *  type: "text",
 *  text: string,
 *  description?: string,
 *  empty: boolean,
 * }} TextIllustration
 */

/**
 * @typedef {{
 *  type: "audio",
 *  fileName: string,
 *  description?: string,
 *  empty: boolean,
 * }} AudioIllustration
 */

/**
 * @typedef {{
 *  type: "color",
 *  color: string,
 *  description?: string,
 *  empty: boolean,
 * }} ColorIllustration
 */

/**
 * Create an empty Entry object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {Entry} An empty Entry object.
 */
function createEmptyEntry(id) {
  return {
    id: id || 1,
    wordType: "",
    wordProperties: [],
    definitions: [createEmptyDefinition()],
    pronunciations: [],
    empty: true,
  };
}

/**
 * Create an empty Definition object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {Definition} An empty Definition object.
 */
function createEmptyDefinition(id) {
  return {
    id: id || 1,
    text: "",
    examples: [],
    empty: true,
  };
}

/**
 * Create an empty Example object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {Example} An empty Example object.
 */
function createEmptyExample(id) {
  return {
    id: id || 1,
    text: "",
    empty: true,
  };
}

/**
 * Create an empty Illustration object.
 * @returns {Illustration} An empty Illustration object with type "image".
 */
function createEmptyIllustration() {
  return {
    type: "image",
    fileName: "",
    empty: true,
  };
}

/**
 * Create an empty Pronunciation object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {Pronunciation} An empty Pronunciation object.
 */
function createEmptyPronunciation(id) {
  return {
    id: id || 1,
    pronunciation: "",
    empty: true,
  };
}

/**
 * @typedef {{
 *  readonly label: string,
 *  readonly template: string,
 * }} GrammaticalProperty
 */
/**
 * This class represents a grammatical property with a name and an associated template.
 */
class GrammaticalProperty {
  /**
   * @param {string} label Property’s label.
   * @param {string?} template Property’s template if any.
   */
  constructor(label, template) {
    /**
     * @type {string}
     * @private
     */
    this._label = label;
    /**
     * @type {string}
     * @private
     */
    this._template = template || "";
  }

  /**
   * @return {string} The label.
   */
  get label() {
    return this._label;
  }

  /**
   * @return {string} The template if any.
   */
  get template() {
    return this._template;
  }
}

/**
 * @typedef {{
 *  readonly label: string,
 *  readonly sectionCode: string,
 * }} GrammaticalClass
 */
/**
 * This class represents a grammatical class.
 */
class GrammaticalClass {
  /**
   * @param {string} label Class’ label.
   * @param {string?} sectionCode Class’ section code. If left empty, the label will be used.
   * (as defined in [[Convention:Structure des pages#Résumé des sections]] 2,1 onwards).
   */
  constructor(label, sectionCode) {
    /**
     * @type {string}
     * @private
     */
    this._label = label;
    /**
     * @type {string}
     * @private
     */
    this._sectionCode = sectionCode || label;
  }

  /**
   * @return {string} Class’ label.
   */
  get label() {
    return this._label;
  }

  /**
   * @return {string} Class’ section code.
   */
  get sectionCode() {
    return this._sectionCode;
  }
}

/**
 * @typedef {((word: string, grammarClass: string, labels: string[], pronunciation: string) => string)?} InflectionsGenerator
 */

/**
 * @typedef {{
 *  readonly grammaticalClass: GrammaticalClass,
 *  readonly properties: Record<string, GrammaticalProperty[]>,
 *  readonly getProperty: (index: number, label: string) => GrammaticalProperty | null,
 *  readonly getInflectionsTemplate: (word: string, labels: string[], pronunciation: string) => string,
 * }} GrammaticalItem
 */
/**
 * A grammatical item associates a grammatical class to properties.
 */
class GrammaticalItem {
  /**
   * @param {GrammaticalClass} grammaticalClass The grammatical class.
   * @param {Record<string, GrammaticalProperty[]>?} properties Associated grammatical properties.
   * @param {InflectionsGenerator?} generateInflections Optional function that generates inflections template.
   */
  constructor(grammaticalClass, properties, generateInflections) {
    /**
     * @type {GrammaticalClass}
     * @private
     */
    this._grammaticalClass = grammaticalClass;
    /**
     * @type {Record<string, GrammaticalProperty[]>}
     * @private
     */
    this._properties = properties || {};
    /**
     * @type {InflectionsGenerator}
     * @private
     */
    this._generateInflections = generateInflections || (() => "");
  }

  /**
   * @return {GrammaticalClass} The grammatical class.
   */
  get grammaticalClass() {
    return this._grammaticalClass;
  }

  /**
   * @return {Record<string, GrammaticalProperty[]>} The available grammatical properties.
   */
  get properties() {
    return this._properties;
  }

  /**
   * Fetches the grammatical property with the given index and label.
   * @param {number} index
   * @param {string} label
   * @return {GrammaticalProperty | null}
   */
  getProperty(index, label) {
    const props = this._properties[index];
    if (!props) return null;
    for (const prop of props) if (prop.label === label) return prop;
    return null;
  }

  /**
   * Generates the inflections template.
   * @param {string} word The base word.
   * @param {string[]} labels Grammatical properties’ labels.
   * @param {string} pronunciation IPA pronunciation.
   * @return {string} Template’s wikicode.
   */
  getInflectionsTemplate(word, labels, pronunciation) {
    let grammarClass = this._grammaticalClass.label;
    grammarClass =
      grammarClass.charAt(0).toUpperCase() + grammarClass.substring(1);
    return this._generateInflections(word, grammarClass, labels, pronunciation);
  }
}

/**
 * @typedef {{
 *  readonly code: string,
 *  readonly wikimediaCode: string,
 *  readonly iso6393Code: string,
 *  readonly name: string,
 *  readonly ipaSymbols: string[][],
 *  readonly grammarItems: Record<string, GrammaticalItem>,
 *  readonly isSupported: boolean,
 *  readonly getGrammarItem: (sectionName: string) => GrammaticalItem,
 *  readonly generatePronunciation: (word: string) => string,
 * }} Language
 */
/**
 * This class encapsulates data and behaviors specific to a specific language.
 */
class Language {
  /**
   * @param {string} code Language code defined in [[Module:langues/data]].
   * @param {string|null} wikimediaCode Language code used by WikiMedia projects.
   * @param {string|null} iso6393Code ISO 639-3 language code for Lingua Libre’s files.
   * @param {string} name Language’s name (in French).
   * @param {string[][]?} ipaSymbols An optional list of common IPA symbols for the language.
   * @param {GrammaticalItem[]?} grammarItems An optional list of grammatical items.
   * @param {((word: string) => string)?} pronGenerator An optional function that generates an approximate pronunciation based on the word.
   * @param {boolean?} isSupported Indicate whether this language is officialy supported by this gadget.
   */
  constructor(
    code,
    wikimediaCode,
    iso6393Code,
    name,
    ipaSymbols,
    grammarItems,
    pronGenerator,
    isSupported = true
  ) {
    /**
     * @type {string}
     * @private
     */
    this._code = code;
    /**
     * @type {string}
     * @private
     */
    this._wikimediaCode = wikimediaCode;
    /**
     * @type {string}
     * @private
     */
    this._iso6393Code = iso6393Code;
    /**
     * @type {string}
     * @private
     */
    this._name = name;
    /**
     * @type {string[][]}
     * @private
     */
    this._ipaSymbols = ipaSymbols || [];
    /**
     * @type {Record<string, GrammaticalItem>}
     * @private
     */
    this._grammarItems = {};
    /**
     * @type {(word: string) => string}
     * @private
     */
    this._pronGenerator = pronGenerator || (() => "");
    /**
     * @type {boolean}
     * @private
     */
    this._isSupported = isSupported;

    for (const grammarItem of grammarItems || []) {
      this._grammarItems[grammarItem.grammaticalClass.sectionCode] =
        grammarItem;
    }
  }

  /**
   * @return {string} This language’s code.
   */
  get code() {
    return this._code;
  }

  /**
   * @return {string} This language’s WikiMedia code.
   */
  get wikimediaCode() {
    return this._wikimediaCode;
  }

  /**
   * @return {string} This language’s ISO 639-3 code.
   */
  get iso6393Code() {
    return this._iso6393Code;
  }

  /**
   * @return {string} This language’s name.
   */
  get name() {
    return this._name;
  }

  /**
   * @return {string[][]} The IPA symbols for this language.
   */
  get ipaSymbols() {
    return this._ipaSymbols;
  }

  /**
   * @return {Record<string, GrammaticalItem>} The grammatical items for this language.
   */
  get grammarItems() {
    return this._grammarItems;
  }

  /**
   * @return {boolean} True if this language is officialy supported by the gadget, false otherwise.
   */
  get isSupported() {
    return this._isSupported;
  }

  /**
   * Fetches the grammatical item that has the given section title.
   * @param {string} sectionName Section’s title.
   * @return {GrammaticalItem | undefined} The grammatical item if found or undefined otherwise.
   */
  getGrammarItem(sectionName) {
    return this._grammarItems[sectionName];
  }

  /**
   * Generates the pronunciation of the given word for this language.
   * @param {string} word The word.
   * @return {string} The pronunciation or an empty string if no function was defined in the constructor.
   */
  generatePronunciation(word) {
    return this._pronGenerator(word);
  }
}

/**
 * @typedef {{
 *  readonly label: string,
 *  readonly templateName: string,
 *  readonly urlDomain: string,
 *  readonly urlBase: string,
 *  readonly placeholder?: string,
 *  readonly showOnlyForLangs?: string[],
 *  readonly icon?: string,
 *  readonly noText?: boolean,
 * }} Wiki
 */

/**
 * List of sister projects and associated templates and domain names.
 * @type {Record<string, Wiki>}
 */
const wikis = {
  wikidata: {
    label: "Wikidata",
    templateName: "liste projets",
    urlDomain: "wikidata.org",
    urlBase: "wiki",
    placeholder: "QID pour le modèle {{liste projets}}",
    icon: cdxIconLogoWikidata,
    noText: true,
  },
  wikipedia: {
    label: "Wikipédia",
    templateName: "WP",
    urlDomain: "{}.wikipedia.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikipedia,
  },
  wikisource: {
    label: "Wikisource",
    templateName: "WS",
    urlDomain: "{}.wikisource.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikisource,
  },
  wikiquote: {
    label: "Wikiquote",
    templateName: "WQ",
    urlDomain: "{}.wikiquote.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikiquote,
  },
  wikiversity: {
    label: "Wikiversité",
    templateName: "WV",
    urlDomain: "{}.wikiversity.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikiversity,
  },
  wikibooks: {
    label: "Wikilivres",
    templateName: "WL",
    urlDomain: "{}.wikibooks.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikibooks,
  },
  wikispecies: {
    label: "Wikispecies",
    templateName: "WSP",
    urlDomain: "species.wikimedia.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikispecies,
  },
  wikivoyage: {
    label: "Wikivoyage",
    templateName: "VOY",
    urlDomain: "{}.wikivoyage.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikivoyage,
  },
  wikinews: {
    label: "Wikinews",
    templateName: "WN",
    urlDomain: "{}.wikinews.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikinews,
  },
  commons: {
    label: "Wikimedia Commons",
    templateName: "Commons",
    urlDomain: "commons.wikimedia.org",
    urlBase: "wiki",
    icon: cdxIconLogoWikimediaCommons,
  },
  vikidia: {
    label: "Vikidia",
    templateName: "Vikidia",
    urlDomain: "{}.vikidia.org",
    urlBase: "wiki",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Vikidia_V_vectorised.svg",
    showOnlyForLangs: [
      "fr",
      "ca",
      "de",
      "el",
      "en",
      "es",
      "eu",
      "it",
      "ru",
      "scn",
      "hy",
    ],
  },
  dicoado: {
    label: "Le Dico des Ados",
    templateName: "Dicoado",
    urlDomain: "{}.dicoado.org",
    urlBase: "dico",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/06/Le_Dico_des_Adps_small_logo_2021_dark_background.svg",
    showOnlyForLangs: ["fr"],
  },
};

/**
 * @typedef {{
 *  readonly label: string,
 *  readonly code: string,
 *  readonly level: number,
 *  readonly help?: string,
 *  readonly hidden?: boolean,
 * }} ArticleSection
 */
/**
 * A simple class that defines properties of an article’s section.
 */
class ArticleSection {
  /**
   * Creates a new article section object.
   * @param {string} label Section’s label.
   * @param {string} code Section’s template code.
   * @param {number} level Section’s level.
   * @param {string?} help Section’s help page name.
   * @param {boolean?} hidden Whether this section should be hidden from the form (used for generated sections).
   */
  constructor(label, code, level, help, hidden) {
    /**
     * @type {string}
     * @private
     */
    this.label = label;
    /**
     * @type {string}
     * @private
     */
    this.code = code;
    /**
     * @type {string}
     * @private
     */
    this.help = help;
    /**
     * @type {number}
     * @private
     */
    this.level = level;
    /**
     * @type {boolean}
     * @private
     */
    this.hidden = !!hidden;
  }
}

export default {
  GrammaticalProperty,
  GrammaticalClass,
  GrammaticalItem,
  Language,
  ArticleSection,
  wikis,
  createEmptyEntry,
  createEmptyDefinition,
  createEmptyExample,
  createEmptyIllustration,
  createEmptyPronunciation,
};
// </nowiki>
