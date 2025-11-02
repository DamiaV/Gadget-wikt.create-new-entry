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
  cdxIconLogoWiktionary,
} from "@wikimedia/codex-icons";
import languages from "./wiki_deps/wikt.core.languages.js";
import sections from "./wiki_deps/wikt.core.sections.js";
import additionalSectionsData from "./sections-additional.json";
import wikisData from "./wikis.json";

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
 *  api?: mw.Api,
 *  word: string,
 *  userName: string | null,
 *  userGender: string,
 *  skin: string,
 *  namespaces: Namespace[],
 * }} AppConfig
 */

/**
 * @typedef {{
 *  status: "pinned",
 * } | {
 *  status: "locked",
 *  content: RelatedWord[] | string,
 * }} SectionStatus
 */

/**
 * @typedef {{
 *  displayMode: "minimal" | "compact" | "full",
 *  formValidityCheckingDisabled: boolean,
 *  tabClosingWarningDisabled: boolean,
 *  introMessageHidden: boolean,
 *  warningIntroMessageHidden: boolean,
 *  favoritedSections: Record<string, SectionStatus | null>,
 * }} UserPreferences
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
 *  etymology: Etymology,
 *  wikiLinks: Record<string, ExternalWikiLink>,
 *  categories: string[],
 *  pronunciationInfo: string,
 *  references: References,
 *  sortKey: string,
 * }} FormData
 */

/**
 * Type for an etymology and its historical examples.
 * @typedef {{
 *  text: string,
 *  examples: Example[],
 *  empty: boolean,
 * }} Etymology
 */

/**
 * @typedef {{
 *  pageTitle?: string,
 *  text?: string,
 *  enabled: boolean,
 * }} ExternalWikiLink
 */

/**
 * @typedef {{
 *  wikiImports: Record<string, WikiImport[]>,
 *  imports: string,
 *  bibliography: string,
 *  empty: boolean,
 * }} References
 */

/**
 * Type for {{Source-*}} template declarations.
 * Language name is cached to avoid requesting it during every refresh.
 * @typedef {{
 *  langCode: string,
 *  langName: string,
 *  title?: string,
 *  oldId?: number,
 * }} WikiImport
 */

/**
 * @typedef {{
 *  id: number,
 *  wordType: string,
 *  wordProperties: Record<string, string>,
 *  plural: string,
 *  definitions: Definition[],
 *  relatedWords: Record<string, RelatedWord[] | string>,
 *  pronunciations: Pronunciation[],
 *  homophones: RelatedWord[],
 *  nearHomophones: RelatedWord[],
 *  phoneticMutations: string,
 *  notes: string,
 *  empty: boolean,
 * }} Entry
 */

/**
 * Type for a single definition and its examples.
 * @typedef {{
 *  id: number,
 *  text: string,
 *  examples: Example[],
 *  relatedWords: Record<string, RelatedWord[] | string>,
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
 *  isReconstructed: boolean,
 *  isGenerated: boolean,
 *  empty: boolean,
 * }} Pronunciation
 */

/**
 * @typedef {FormattedRelatedWord | UnformattedRelatedWord} RelatedWord
 */

/**
 * @typedef {{
 *  id: number,
 *  words: string[],
 *  annotation: string,
 *  nonFormattedAnnotation: boolean,
 *  empty: boolean,
 * }} FormattedRelatedWord
 */

/**
 * @typedef {{
 *  id: number,
 *  text: string,
 *  empty: boolean,
 * }} UnformattedRelatedWord
 */

/**
 * @typedef {MediaIllustration | TextIllustration | ColorIllustration} Illustration
 */

/**
 * @typedef {{
 *  type: "image" | "video" | "audio",
 *  fileName: string,
 *  description: string,
 *  alt?: string,
 *  empty: boolean,
 * }} MediaIllustration
 */

/**
 * @typedef {{
 *  type: "text",
 *  text: string,
 *  description: string,
 *  empty: boolean,
 * }} TextIllustration
 */

/**
 * @typedef {{
 *  type: "color",
 *  color: string,
 *  description: string,
 *  empty: boolean,
 * }} ColorIllustration
 */

/**
 * Create ane empty UserPreferences object.
 * @returns {UserPreferences} An empty UserPreferences object.
 */
function createEmptyUserPreferences() {
  return {
    displayMode: "full",
    formValidityCheckingDisabled: false,
    tabClosingWarningDisabled: false,
    introMessageHidden: false,
    warningIntroMessageHidden: false,
    favoritedSections: {},
  };
}

/**
 * Create an empty Etymology object.
 * @returns {Etymology} An empty Etymology object.
 */
function createEmptyEtymology() {
  return {
    text: "",
    examples: [],
    empty: true,
  };
}

/**
 * Create an empty Entry object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {Entry} An empty Entry object.
 */
function createEmptyEntry(id) {
  return {
    id: id || 1,
    wordType: "",
    wordProperties: {},
    plural: "",
    definitions: [createEmptyDefinition()],
    relatedWords: {},
    pronunciations: [],
    homophones: [],
    nearHomophones: [],
    phoneticMutations: "",
    notes: "",
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
    relatedWords: {},
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
    isReconstructed: false,
    isGenerated: false,
    empty: true,
  };
}

/**
 * Create an empty References object.
 * @returns {References} An empty References object.
 */
function createEmptyReferences() {
  return {
    wikiImports: {},
    imports: "",
    bibliography: "",
    empty: true,
  };
}

/**
 * Create an empty FormattedRelatedWord object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {FormattedRelatedWord} An empty FormattedRelatedWord object.
 */
function createEmptyFormattedRelatedWord(id) {
  return {
    id: id || 1,
    words: [],
    annotation: "",
    nonFormattedAnnotation: false,
    empty: true,
  };
}

/**
 * Create an empty UnformattedRelatedWord object.
 * @param {number?} id An optional ID. If null, the value 1 will be used.
 * @returns {UnformattedRelatedWord} An empty FormatteUnformattedRelatedWorddRelatedWord object.
 */
function createEmptyUnformattedRelatedWord(id) {
  return {
    id: id || 1,
    text: "",
    empty: true,
  };
}

/**
 * @typedef {import("./wiki_deps/wikt.core.sections.js").SectionData & {
 *  definitionSpecific: boolean,
 *  helpPage?: string,
 *  conventionPage?: string,
 *  isText?: boolean,
 * }} SectionData
 */

/**
 * @type {Record<string, SectionData>}
 */
const definitionSectionsData = {};
/**
 * @type {Record<string, SectionData>}
 */
const entrySectionsData = {};
/**
 * @type {Record<string, SectionData>}
 */
const otherSectionsData = {};

for (const code of sections.getSectionCodes()) {
  const sectionData = sections.getSectionData(code);
  /**
   * @type {{
   *  definitionSpecific?: boolean,
   *  helpPage?: string,
   *  conventionPage?: string,
   *  isText?: boolean,
   * }}
   */
  const additionalData = additionalSectionsData[code];
  if (
    code === "traductions" ||
    !sectionData ||
    sectionData.level !== 4 ||
    !additionalData
  )
    continue;

  /**
   * @type {{
   *  helpPage?: string,
   *  conventionPage?: string,
   *  isText?: boolean,
   * }}
   */
  const extendedData = {};
  if (additionalData.isText) extendedData.isText = additionalData.isText;
  if (additionalData.helpPage) extendedData.helpPage = additionalData.helpPage;
  if (additionalData.conventionPage)
    extendedData.conventionPage = additionalData.conventionPage;

  /**
   * @type {SectionData}
   */
  const extendedSectionData = Object.assign(extendedData, sectionData);

  if (extendedSectionData.parent === "type de mot") {
    if (additionalData.definitionSpecific)
      definitionSectionsData[code] = extendedSectionData;
    else entrySectionsData[code] = extendedSectionData;
  } else if (extendedSectionData.parent === "pron")
    otherSectionsData[code] = extendedSectionData;
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
   * @returns {string} The label.
   */
  get label() {
    return this._label;
  }

  /**
   * @returns {string} The template or an empty string if there is none.
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
   * @returns {string} Class’ label.
   */
  get label() {
    return this._label;
  }

  /**
   * @returns {string} Class’ section code.
   */
  get sectionCode() {
    return this._sectionCode;
  }
}

/**
 * @typedef {((word: string, plural: string, grammarClass: string, labels: string[], pronunciation: string) => string)?} InflectionsGenerator
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
   * @returns {GrammaticalClass} The grammatical class.
   */
  get grammaticalClass() {
    return this._grammaticalClass;
  }

  /**
   * @returns {Record<string, GrammaticalProperty[]>} The available grammatical properties.
   */
  get properties() {
    return this._properties;
  }

  /**
   * Fetches the grammatical property with the given index and label.
   * @param {string} propertyType The type of the property to get.
   * @param {string} label The label of the property to get.
   * @returns {GrammaticalProperty | null}
   */
  getProperty(propertyType, label) {
    const props = this._properties[propertyType];
    if (!props) return null;
    for (const prop of props) if (prop.label === label) return prop;
    return null;
  }

  /**
   * Generates the inflections template.
   * @param {string} word The base word.
   * @param {string} plural The base word’s plural.
   * @param {string[]} labels Grammatical properties’ labels.
   * @param {string} pronunciation IPA pronunciation.
   * @returns {string} Template’s wikicode.
   */
  getInflectionsTemplate(word, plural, labels, pronunciation) {
    let grammarClass = this._grammaticalClass.label;
    grammarClass =
      grammarClass.charAt(0).toUpperCase() + grammarClass.substring(1);
    return this._generateInflections(
      word,
      plural,
      grammarClass,
      labels,
      pronunciation
    );
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
 *  readonly hasPronunciationAppendix: boolean,
 *  readonly getGrammarItem: (sectionName: string) => GrammaticalItem | undefined,
 *  readonly generatePronunciation: (word: string) => string | null,
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
   * @param {((word: string) => string | null)?} pronGenerator An optional function that generates an approximate pronunciation based on the word.
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
    this._pronGenerator = pronGenerator || (() => null);
    /**
     * @type {boolean}
     * @private
     */
    this._isSupported = isSupported;
    /**
     * @type {boolean}
     * @private
     */
    this._hasPronunciationAppendix =
      languages.getLanguage(code).hasPronunciationAppendix;

    for (const grammarItem of grammarItems || []) {
      this._grammarItems[grammarItem.grammaticalClass.sectionCode] =
        grammarItem;
    }
  }

  /**
   * @returns {string} This language’s code.
   */
  get code() {
    return this._code;
  }

  /**
   * @returns {string} This language’s WikiMedia code.
   */
  get wikimediaCode() {
    return this._wikimediaCode;
  }

  /**
   * @returns {string} This language’s ISO 639-3 code.
   */
  get iso6393Code() {
    return this._iso6393Code;
  }

  /**
   * @returns {string} This language’s name.
   */
  get name() {
    return this._name;
  }

  /**
   * @returns {string[][]} The IPA symbols for this language.
   */
  get ipaSymbols() {
    return this._ipaSymbols;
  }

  /**
   * @returns {Record<string, GrammaticalItem>} The grammatical items for this language.
   */
  get grammarItems() {
    return this._grammarItems;
  }

  /**
   * @returns {boolean} True if this language is officialy supported by the gadget, false otherwise.
   */
  get isSupported() {
    return this._isSupported;
  }

  /**
   * @returns {boolean} True if this language has an "Annexe/Prononciation/<name>" page.
   */
  get hasPronunciationAppendix() {
    return this._hasPronunciationAppendix;
  }

  /**
   * Fetches the grammatical item that has the given section title.
   * @param {string} sectionName Section’s title.
   * @returns {GrammaticalItem | undefined} The grammatical item if found or undefined otherwise.
   */
  getGrammarItem(sectionName) {
    return this._grammarItems[sectionName];
  }

  /**
   * Generates the pronunciation of the given word for this language.
   * @param {string} word The word.
   * @returns {string | null} The pronunciation or an empty string if no function was defined in the constructor.
   */
  generatePronunciation(word) {
    return this._pronGenerator(word);
  }
}

/**
 * @typedef {{
 *  readonly label: string,
 *  readonly interwikiCode: string,
 *  readonly templateName: string,
 *  readonly importTemplateName: string,
 *  readonly urlDomain: string,
 *  readonly urlBase: string,
 *  readonly placeholder?: string,
 *  readonly showOnlyForLangs?: string[],
 *  readonly icon: string,
 *  readonly noText?: boolean,
 * }} Wiki
 */

const icons = {
  wikidata: cdxIconLogoWikidata,
  wiktionary: cdxIconLogoWiktionary,
  wikipedia: cdxIconLogoWikipedia,
  wikisource: cdxIconLogoWikisource,
  wikiquote: cdxIconLogoWikiquote,
  wikiversity: cdxIconLogoWikiversity,
  wikibooks: cdxIconLogoWikibooks,
  wikispecies: cdxIconLogoWikispecies,
  wikivoyage: cdxIconLogoWikivoyage,
  wikinews: cdxIconLogoWikinews,
  commons: cdxIconLogoWikimediaCommons,
  // Rescaled to 20×20px viewbox from https://commons.wikimedia.org/wiki/File:Vikidia_V_vectorised.svg?oldid=857292438
  vikidia:
    "<path d='M 10.283979,7.6600867 C 10.660863,6.1514142 11.02793,4.639937 11.422255,3.1357348 a 10.962569,10.962569 0 0 1 0.47908,-1.3262786 c 0.143829,-0.3539197 0.440164,-0.5134377 0.814331,-0.5137006 2.086004,-0.00193 4.17201,-0.00439 6.258014,0.00439 0.539908,0.00227 1.040812,0.2191183 1.026,0.7563961 -0.01674,0.604766 -0.273459,1.2575628 -0.457257,1.8283218 -1.018197,3.1622215 -2.081535,6.3098975 -3.130671,9.4621315 q -0.674885,2.026933 -1.353713,4.052197 c -0.410279,1.231619 -0.498625,1.296215 -1.785462,1.297179 -1.700358,0.0014 -3.4007152,0 -5.1010726,0.0097 -0.4881078,0.0027 -0.8405373,-0.187131 -1.0610578,-0.62642 Q 4.4556984,12.790346 1.7982331,7.5023217 1.0462197,6.0051311 0.29341724,4.5082033 C 0.24643829,4.414596 0.2008617,4.3198493 0.16054397,4.2231744 -0.25411527,3.2280273 0.14827334,2.41431 1.2080164,2.2501468 2.9202059,1.9851014 4.6405463,1.7708038 6.3598354,1.5533509 6.9446179,1.4792889 7.4130926,1.7857039 7.6931256,2.3772353 8.3960566,3.8631194 9.091275,5.3525095 9.7919274,6.8394454 9.9215577,7.114395 10.061706,7.3843483 10.197033,7.6565808 Z M 18.7323,2.3763587 c -0.127701,0 -0.222887,0 -0.318161,0 q -2.392769,-0.00185 -4.785102,-0.00306 c -0.748506,5.26e-4 -0.653936,-0.088435 -0.842289,0.6522709 q -1.000844,3.935882 -2.003354,7.8713314 c -0.03086,0.120252 -0.129017,0.223325 -0.195804,0.334374 -0.08616,-0.08853 -0.20492,-0.161972 -0.253651,-0.267673 Q 8.5544353,7.1065066 6.7905341,3.2423138 C 6.6578361,2.9519385 6.4544942,2.8509688 6.1394901,2.8940035 5.1255865,3.0326616 4.109141,3.153089 3.0946241,3.2877151 2.4500659,3.3732588 1.8071732,3.4717744 1.1378111,3.5681863 1.1978496,3.6948366 1.2399204,3.7891451 1.2868115,3.8811748 q 1.7871276,3.5344636 3.5760086,7.0677872 c 0.6582308,1.294727 1.3403895,2.577268 1.9929235,3.874713 0.4159741,0.827038 0.8026737,1.668978 1.1914769,2.509428 0.1196385,0.258471 0.3007178,0.356374 0.5784721,0.355409 1.5250644,-0.0053 3.0501254,-0.0077 4.5746634,0.0048 0.356109,0.003 0.539468,-0.134013 0.641315,-0.475048 0.377409,-1.262736 0.762531,-2.523453 1.169301,-3.776897 0.317195,-0.976916 0.68023,-1.938846 1.006804,-2.912782 0.596615,-1.7792391 1.179821,-3.5634747 1.771439,-5.3446424 0.308081,-0.9272203 0.621946,-1.8521619 0.943085,-2.8076927 z'/>",
  // Rescaled to 20×20px viewbox from https://commons.wikimedia.org/wiki/File:Le_Dico_des_Adps_small_logo_2021_dark_background.svg?oldid=917058613
  dicoado:
    "<path d='m 9.9998055,14.860326 a 2.6728257,2.6728257 0 1 1 2.6730205,-2.67302 2.6759942,2.6759942 0 0 1 -2.6730205,2.67302 z'/><path d='M 17.765678,12.186552 V 1.2414048e-5 A 3.3939499,3.3939499 0 0 0 14.371728,3.3939624 v 2.42195 h -3.1e-4 v 6.4180496 a 4.3755786,4.3755786 0 1 1 -1.69791,-3.4585696 v -3.83512 a 7.7671676,7.7671676 0 1 0 5.09366,7.2936896 c 0,-0.0159 -0.001,-0.0315 -0.001,-0.0474 z'/>",
};
/**
 * List of sister projects and associated templates and domain names.
 * @type {Record<string, Wiki>}
 */
const wikis = {};
for (const [wikiName, wikiData] of Object.entries(wikisData))
  wikis[wikiName] = Object.assign({ icon: icons[wikiName] }, wikiData);

/**
 * Generate the URL for a page on the given wiki.
 * @param {Wiki} wiki The wiki.
 * @param {string} langCode The wiki’s language code.
 * @param {string} pageTitle The title of a page on the wiki.
 * @param {Record<string, any>?} urlParams Additional URL get parameters.
 * @param {string?} anchor Optional anchor to append.
 * @returns {string} The corresponding URl.
 */
function getWikiUrl(wiki, langCode, pageTitle, urlParams, anchor) {
  const hostName = wiki.urlDomain.replace("{}", langCode);
  const escapedTitle = encodeURIComponent(pageTitle.replaceAll(" ", "_"))
    .replaceAll("%2F", "/")
    .replaceAll("%3A", ":"); // We want to keep all / and :
  let url = `https://${hostName}/${wiki.urlBase}/${escapedTitle}`;
  if (urlParams) url += "?" + new URLSearchParams(urlParams);
  if (anchor) url += "#" + encodeURIComponent(anchor);
  return url;
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

/**
 * @typedef {{
 *  register: (keyPrefix: string) => string,
 *  unregister: (key: string) => void,
 *  setError: (key: string, error: boolean) => void,
 *  anyError: () => boolean,
 * }} ValidationLock
 */
/**
 * A validation lock is used to check whether any error is present in the form, and if so to prevent its submitting.
 */
class ValidationLock {
  constructor() {
    /**
     * @type {Record<string, boolean>}
     */
    this._registry = {};
    this._counter = 0;
  }

  /**
   * Register a new entry. This method returns a randomly generated key using the given prefix.
   * All subsequent operations for the registered entry should use the returned key.
   * @param {string} keyPrefix The prefix for the generated key.
   * @returns {string} The randomly generated keyk
   */
  register(keyPrefix) {
    const key = keyPrefix + this._counter++;
    this._registry[key] = false;
    return key;
  }

  /**
   * Unregister the given key.
   * @param {string} key The key to unregister.
   */
  unregister(key) {
    if (!(key in this._registry)) return;
    delete this._registry[key];
  }

  /**
   * Set the error status for the given key.
   * @param {string} key A key returned by {@link register()}.
   * @param {boolean} error The new error value.
   */
  setError(key, error) {
    if (!(key in this._registry))
      throw new Error(`Key "${key}" is not registered.`);
    this._registry[key] = error;
  }

  /**
   * Check whether any error flag is active.
   * @returns {boolean} True if any error flag is set to true, false otherwise.
   */
  anyError() {
    return Object.values(this._registry).some((error) => error);
  }
}

// </nowiki>
/**
 * This module defines global types and type-related functions.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/types.js]]
 */
export default {
  GrammaticalProperty,
  GrammaticalClass,
  GrammaticalItem,
  Language,
  ArticleSection,
  ValidationLock,
  wikis,
  definitionSectionsData,
  entrySectionsData,
  otherSectionsData,
  getWikiUrl,
  createEmptyUserPreferences,
  createEmptyEtymology,
  createEmptyEntry,
  createEmptyDefinition,
  createEmptyExample,
  createEmptyIllustration,
  createEmptyPronunciation,
  createEmptyReferences,
  createEmptyFormattedRelatedWord,
  createEmptyUnformattedRelatedWord,
};
