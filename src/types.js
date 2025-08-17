/**
 * Data type definitions for the gadget.
 */
// <nowiki>

/**
 * @typedef {{
 *  word: string,
 *  userGender: string,
 * }} AppConfig
 */

/*
 * Event types
 */

/**
 * @typedef {{entries: Entry[]}} FormEntriesUpdateEvent
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

/*
 * Data types
 */

/**
 * @typedef {{
 *  language: Language,
 *  stub: boolean,
 *  entries: Entry[],
 * }} FormData
 */

/**
 * @typedef {{
 *  id: number,
 *  wordType: string,
 *  wordProperties: string[],
 *  definitions: Definition[],
 *  pronunciation?: string,
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
 *  readonly properties: GrammaticalProperty[][],
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
   * @param {GrammaticalProperty[][]?} properties Associated grammatical properties.
   * @param {InflectionsGenerator?} generateInflections Optional function that generates inflections template.
   */
  constructor(grammaticalClass, properties, generateInflections) {
    /**
     * @type {GrammaticalClass}
     * @private
     */
    this._grammaticalClass = grammaticalClass;
    /**
     * @type {GrammaticalProperty[][]}
     * @private
     */
    this._properties = properties || [];
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
   * @return {GrammaticalProperty[][]} The available grammatical properties.
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
 *  readonly showOnlyForLangs: string[],
 * }} Wiki
 */
/**
 * A simple class that defines useful properties of sister wikis.
 */
class Wiki {
  /**
   * Create a new Wiki object.
   * @param {string} label Wiki’s French name.
   * @param {string} templateName Wiki’s link template.
   * @param {string} urlDomain Wiki’s URL pattern.
   * @param {string?} urlBase Wiki’s search URL.
   * @param {string[]?} showOnlyForLangs A list of language code for which to enable this wiki.
   */
  constructor(label, templateName, urlDomain, urlBase, showOnlyForLangs) {
    /**
     * @type {string}
     * @private
     */
    this.name = label;
    /**
     * @type {string}
     * @private
     */
    this.templateName = templateName;
    /**
     * @type {string}
     * @private
     */
    this.urlDomain = urlDomain;
    /**
     * @type {string}
     * @private
     */
    this.urlBase = urlBase || "w/index.php?search=";
    /**
     * @type {string[]}
     * @private
     */
    this.showOnlyForLangs = showOnlyForLangs || [];
  }
}

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
  Wiki,
  ArticleSection,
};
// </nowiki>
