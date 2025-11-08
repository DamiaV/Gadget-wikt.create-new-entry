// <nowiki>
import langs from "./wiki_deps/wikt.core.languages.js";
import templates from "./templates.js";
import types from "./types.js";

/**
 * All available grammatical genders.
 */
const GENDERS = {
  UNKNOWN: new types.GrammaticalProperty("je ne sais pas", "{{genre ?}}"),
  MASCULINE: new types.GrammaticalProperty("masculin", "{{m}}"),
  FEMININE: new types.GrammaticalProperty("féminin", "{{f}}"),
  FEMININE_MASCULINE_DIFF: new types.GrammaticalProperty(
    "masc. et fém. différents"
  ),
  FEMININE_MASCULINE: new types.GrammaticalProperty(
    "masc. et fém. identiques",
    "{{mf}}"
  ),
  NEUTRAL: new types.GrammaticalProperty("neutre", "{{n}}"),
};

/**
 * All available grammatical numbers.
 */
const NUMBERS = {
  UNKNOWN: new types.GrammaticalProperty("je ne sais pas", "{{nombre ?}}"),
  DIFF_SINGULAR_PLURAL: new types.GrammaticalProperty(
    "sing. et plur. différents"
  ),
  SAME_SINGULAR_PLURAL: new types.GrammaticalProperty(
    "sing. et plur. identiques",
    "{{sp}}"
  ),
  SINGULAR_ONLY: new types.GrammaticalProperty(
    "singulier uniquement",
    "{{au singulier uniquement|{0}}}"
  ),
  PLURAL_ONLY: new types.GrammaticalProperty(
    "pluriel uniquement",
    "{{au pluriel uniquement|{0}}}"
  ),
  INVARIABLE: new types.GrammaticalProperty("invariable", "{{invariable}}"),
  COLLECTIVE_SINGULATIVE: new types.GrammaticalProperty(
    "collectif et singulatif",
    "{{collectif}}"
  ),
  COLLECTIVE_SINGULATIVE_PLURAL: new types.GrammaticalProperty(
    "collectif, singulatif, et pluriel du singulatif",
    "{{collectif}}"
  ),
  SINGULATIVE_DUAL_PLURAL: new types.GrammaticalProperty(
    "singulier, duel, et pluriel"
  ),
};

const COMPARATIVES = {
  UNKNOWN: new types.GrammaticalProperty("je ne sais pas"),
  COMPARABLE_MORE_MOST: new types.GrammaticalProperty(
    "comparable (more…/most…)"
  ),
  COMPARABLE_ER_EST: new types.GrammaticalProperty("comparable (-er/-est)"),
  UNCOMPARABLE: new types.GrammaticalProperty("incomparable"),
};

/**
 * All available verb groups and types.
 */
const VERBS = {
  GROUP1: new types.GrammaticalProperty(
    "Premier groupe",
    "{{type|{0}}} {{conjugaison|{0}|groupe=1}}"
  ),
  GROUP2: new types.GrammaticalProperty(
    "Deuxième groupe",
    "{{type|{0}}} {{conjugaison|{0}|groupe=2}}"
  ),
  GROUP3: new types.GrammaticalProperty(
    "Troisième groupe",
    "{{type|{0}}} {{conjugaison|{0}|groupe=3}}"
  ),
  REGULAR_VERB: new types.GrammaticalProperty("régulier", "{{type|{0}}}"),
  IRREGULAR_VERB: new types.GrammaticalProperty(
    "irrégulier",
    "{{type|{0}}} {{irrégulier|{0}}}"
  ),
  VERB: new types.GrammaticalProperty("verbe", "{{type|{0}}}"),
};

/**
 * All available grammatical classes.
 */
const GRAMMATICAL_CLASSES = {
  SYMBOL: new types.GrammaticalClass("symbole"),
  LETTER: new types.GrammaticalClass("lettre"),

  SCIENTIFIC_NAME: new types.GrammaticalClass("nom scientifique"),

  // Nouns
  NOUN: new types.GrammaticalClass("nom commun", "nom"),
  PROPER_NOUN: new types.GrammaticalClass("nom propre"),
  FIRST_NAME: new types.GrammaticalClass("prénom"),
  LAST_NAME: new types.GrammaticalClass("nom de famille"),
  PATRONYM: new types.GrammaticalClass("patronyme"),

  // Adjectives
  ADJECTIVE: new types.GrammaticalClass("adjectif"),
  INTERROGATIVE_ADJECTIVE: new types.GrammaticalClass("adjectif interrogatif"),
  NUMERAL_ADJECTIVE: new types.GrammaticalClass("adjectif numéral"),
  POSSESSIVE_ADJECTIVE: new types.GrammaticalClass("adjectif possessif"),

  // Adverbs
  ADVERB: new types.GrammaticalClass("adverbe"),
  INTERROGATIVE_ADVERB: new types.GrammaticalClass("adverbe interrogatif"),

  // Pronouns
  PRONOUN: new types.GrammaticalClass("pronom"),
  DEMONSTRATIVE_PRONOUN: new types.GrammaticalClass("pronom démonstratif"),
  INDEFINITE_PRONOUN: new types.GrammaticalClass("pronom indéfini"),
  INTERROGATIVE_PRONOUN: new types.GrammaticalClass("pronom interrogatif"),
  PERSONAL_PRONOUN: new types.GrammaticalClass("pronom personnel"),
  POSSESSIVE_PRONOUN: new types.GrammaticalClass("pronom possessif"),
  RELATIVE_PRONOUN: new types.GrammaticalClass("pronom relatif"),

  // Conjunctions
  CONJUNCTION: new types.GrammaticalClass("conjonction"),
  COORDINATION_CONJUNCTION: new types.GrammaticalClass(
    "conjonction de coordination"
  ),

  // Articles
  ARTICLE: new types.GrammaticalClass("article"),
  INDEFINITE_ARTICLE: new types.GrammaticalClass("article indéfini"),
  DEFINITE_ARTICLE: new types.GrammaticalClass("article défini"),
  PARTITIVE_ARTICLE: new types.GrammaticalClass("article partitif"),

  // Affixes
  PREFIX: new types.GrammaticalClass("préfixe"),
  SUFFIX: new types.GrammaticalClass("suffixe"),
  CIRCUMFIX: new types.GrammaticalClass("circonfixe"),
  INFIX: new types.GrammaticalClass("infixe"),

  VERB: new types.GrammaticalClass("verbe"),
  PREPOSITION: new types.GrammaticalClass("préposition"),
  POSTPOSITION: new types.GrammaticalClass("postposition"),
  PARTICLE: new types.GrammaticalClass("particule"),
  INTERJECTION: new types.GrammaticalClass("interjection"),
  ONOMATOPOEIA: new types.GrammaticalClass("onomatopée"),

  PHRASE: new types.GrammaticalClass("locution/phrase", "locution-phrase"),
};

/**
 * Load all languages into the gadget.
 * @returns The list of loaded languages.
 */
function loadLanguages() {
  /**
   * @type {import("./types.js").Language[]}
   */
  const languages = [];

  const inlineTemplateFormat = templates.parseTemplateFormat("inline");

  /*
   * French language definition.
   */

  /**
   * Generate the inflections template for French.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string] | [string, string]} properties The selected grammatical properties.
   * @param {string} pron The pronunciation.
   * @param {boolean} simple If true, {{fr-rég}} will be returned instead of {{fr-accord-rég}}.
   * @returns An inflections template.
   */
  const getFrenchModel = (
    word,
    plural,
    grammarClass,
    properties,
    pron,
    simple
  ) => {
    const [gender, number] =
      properties.length === 2 ? properties : [null, NUMBERS.INVARIABLE.label];

    if (number === NUMBERS.INVARIABLE.label)
      return `{{fr-inv|${pron}|inv_titre=${grammarClass}}}`;
    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{fr-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{fr-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{fr-inv|${pron}|inv_titre=Pluriel}}`;

    if (number === NUMBERS.UNKNOWN.label || gender === GENDERS.UNKNOWN.label)
      return "{{boite à flexions demandée|fr}}";

    if (gender === GENDERS.FEMININE_MASCULINE.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "fr-rég",
        paramOrder: ["1", "p", "mf"],
        params: {
          1: pron,
          p: plural,
          mf: true,
        },
      });

    if (
      grammarClass.toLowerCase() === GRAMMATICAL_CLASSES.FIRST_NAME.label ||
      grammarClass.toLowerCase() === GRAMMATICAL_CLASSES.PATRONYM.label
    )
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "fr-accord-ind",
        paramOrder: ["m", "f", "pron"],
        params: {
          m: gender === GENDERS.MASCULINE.label ? word : plural,
          f: gender === GENDERS.MASCULINE.label ? plural : word,
          pron: pron,
        },
      });

    if (simple)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "fr-rég",
        paramOrder: ["1", "p"],
        params: {
          1: pron,
          p: plural,
        },
      });

    return templates.templateToString({
      format: inlineTemplateFormat,
      name: "fr-accord-rég",
      paramOrder: ["1", "radp"],
      params: {
        1: pron,
        radp: plural,
      },
    });
  };

  languages.push(
    new types.Language(
      "fr",
      "fr",
      "fra",
      "français",
      [
        [
          "a",
          "ɑ",
          "ɑ̃",
          "ə",
          "œ",
          "œ̃",
          "ø",
          "e",
          "ɛ",
          "ɛ̃",
          "i",
          "o",
          "ɔ",
          "ɔ̃",
          "y",
          "u",
        ],
        [
          "b",
          "d",
          "f",
          "ɡ",
          "k",
          "l",
          "m",
          "n",
          "ɲ",
          "ŋ",
          "p",
          "ʁ",
          "s",
          "ʃ",
          "t",
          "v",
          "z",
          "ʒ",
        ],
        ["j", "w", "ɥ"],
        [".", "‿"],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {
          genre: [
            GENDERS.FEMININE,
            GENDERS.MASCULINE,
            GENDERS.FEMININE_MASCULINE,
            GENDERS.NEUTRAL,
            GENDERS.UNKNOWN,
          ],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME, {}),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.FIRST_NAME,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.INVARIABLE,
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PATRONYM,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            accord: [NUMBERS.INVARIABLE, GENDERS.FEMININE_MASCULINE_DIFF],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getFrenchModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.NEUTRAL,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          (word, plural, grammarClass, properties, pron) =>
            getFrenchModel(word, plural, grammarClass, properties, pron, true)
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // fr

  /*
   * English language definition.
   */

  /**
   * Generate the inflections template for English.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string] | [string, string]} properties The selected grammatical properties.
   * @param {string} pron The pronunciation.
   * @returns An inflections template.
   */
  const getEnglishModel = (word, plural, grammarClass, properties, pron) => {
    const grammarClass_ = grammarClass.toLowerCase();
    const [number, gender] = properties;

    if (
      number === NUMBERS.UNKNOWN.label ||
      number === COMPARATIVES.UNKNOWN.label ||
      gender === GENDERS.UNKNOWN.label
    )
      return "{{boite à flexions demandée|en}}";

    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{en-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{en-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{en-inv|${pron}|inv_titre=Pluriel}}`;
    if (grammarClass_ === GRAMMATICAL_CLASSES.ADJECTIVE.label) {
      if (number === COMPARATIVES.COMPARABLE_ER_EST.label) {
        if (word.endsWith("e")) return `{{en-adj-e|pron=${pron}}}`;
        if (word.endsWith("y"))
          return `{{en-adj-y|${word.substring(0, word.length - 1)}|pron=${pron}}}`;
        return `{{en-adj-er|pron=${pron}}}`;
      }
      if (number === COMPARATIVES.COMPARABLE_MORE_MOST.label)
        return `{{en-adj|pron=${pron}}}`;
      return `{{en-adj-inc|${pron}}}`;
    }
    if (grammarClass_ === GRAMMATICAL_CLASSES.VERB.label)
      return VERBS.REGULAR_VERB.label
        ? `{{en-conj-rég|inf.pron=${pron}}}`
        : `{{en-conj-irrég|inf=${word}|inf.pron=${pron}|<!-- Compléter -->}}`;
    if (
      [
        GRAMMATICAL_CLASSES.NOUN.label,
        GRAMMATICAL_CLASSES.LAST_NAME.label,
        GRAMMATICAL_CLASSES.FIRST_NAME.label,
      ].includes(grammarClass_) &&
      number === NUMBERS.DIFF_SINGULAR_PLURAL.label
    )
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "en-nom-rég",
        paramOrder: ["1", "p"],
        params: {
          1: pron,
          p: plural,
        },
      });
    return `{{en-inv|${pron}|inv_titre=${grammarClass}}}`;
  };

  languages.push(
    new types.Language(
      "en",
      "en",
      "eng",
      "anglais",
      [
        [
          "i",
          "iː",
          "ɪ",
          "ɛ",
          "æ",
          "ə",
          "ɚ",
          "ɜː",
          "ɝ",
          "uː",
          "u",
          "ʊ",
          "ʌ",
          "ɔː",
          "ɑː",
          "ɒ",
        ],
        ["aɪ", "aʊ", "eə", "eɪ", "əʊ", "oʊ", "ɔə", "ɔɪ", "ɪə", "ʊə", "uə"],
        [
          "b",
          "d",
          "f",
          "ɡ",
          "h",
          "k",
          "l",
          "m",
          "n",
          "ŋ",
          "ɲ",
          "p",
          "ɹ",
          "ɻ",
          "s",
          "ʃ",
          "t",
          "θ",
          "ð",
          "v",
          "z",
          "ʒ",
        ],
        ["j", "w"],
        [".", "ˈ", "ˌ", "ː"],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            comparatif: [
              COMPARATIVES.COMPARABLE_MORE_MOST,
              COMPARATIVES.COMPARABLE_ER_EST,
              COMPARATIVES.UNCOMPARABLE,
              COMPARATIVES.UNKNOWN,
            ],
          },
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PROPER_NOUN,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.VERB,
          { type: [VERBS.REGULAR_VERB, VERBS.IRREGULAR_VERB] },
          getEnglishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.LAST_NAME,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.FIRST_NAME,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
          },
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // en

  /*
   * Italian language definition.
   */

  /**
   * Generate the inflections template for Italian.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string] | [string, string]} properties The selected grammatical properties.
   * @param {string} pron The pronunciation.
   * @returns An inflections template.
   */
  const getItalianModel = (word, plural, grammarClass, properties, pron) => {
    const [gender, number] =
      properties.length === 2 ? properties : [null, NUMBERS.INVARIABLE.label];
    if (number === NUMBERS.INVARIABLE.label)
      return `{{it-inv|${pron}|inv_titre=${grammarClass}}}`;
    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{it-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{it-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{it-inv|${pron}|inv_titre=Pluriel}}`;

    if (number === NUMBERS.UNKNOWN.label || gender === GENDERS.UNKNOWN.label)
      return "{{boite à flexions demandée|it}}";

    return templates.templateToString({
      format: inlineTemplateFormat,
      name: "it-flexion",
      paramOrder: ["1", "p", "mf"],
      params: {
        1: pron,
        p: plural,
        mf: gender === GENDERS.FEMININE_MASCULINE.label,
      },
    });
  };

  languages.push(
    new types.Language(
      "it",
      "it",
      "ita",
      "italien",
      [
        ["a", "e", "ɛ", "i", "o", "ɔ", "u"],
        [
          "b",
          "d",
          "d͡z",
          "d͡ʒ",
          "f",
          "ɡ",
          "k",
          "l",
          "ʎ",
          "m",
          "ɱ",
          "n",
          "ŋ",
          "ɲ",
          "p",
          "r",
          "s",
          "ʃ",
          "t",
          "t͡s",
          "t͡ʃ",
          "v",
          "z",
        ],
        ["j", "w"],
        [".", "ˈ", "ː"],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
            GENDERS.UNKNOWN,
          ],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
            GENDERS.UNKNOWN,
          ],
        }),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getItalianModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // it

  /*
   * Spanish language definition.
   */

  /**
   * Generate the inflections template for Spanish.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string] | [string, string]} properties The selected grammatical properties.
   * @param {string} pron The pronunciation.
   * @returns An inflections template.
   */
  const getSpanishModel = (word, plural, grammarClass, properties, pron) => {
    const [gender, number] =
      properties.length === 2 ? properties : [null, NUMBERS.INVARIABLE.label];
    let mf = "";
    if (gender === GENDERS.FEMININE_MASCULINE.label) mf = "|mf=oui";

    if (number === NUMBERS.INVARIABLE.label)
      return `{{es-inv|${pron}|inv_titre=${grammarClass}${mf}}`;
    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{es-inv|${pron}|inv_titre=Singulier et pluriel${mf}}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{es-inv|${pron}|inv_titre=Singulier${mf}}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{es-inv|${pron}|inv_titre=Pluriel${mf}}}`;

    if (number === NUMBERS.UNKNOWN.label || gender === GENDERS.UNKNOWN.label)
      return "{{boite à flexions demandée|es}}";

    if (!mf) {
      const grammarClass_ = grammarClass.toLowerCase();
      if (
        grammarClass_ === GRAMMATICAL_CLASSES.ADJECTIVE.label &&
        word.endsWith("o")
      )
        return `{{es-accord-oa|${word.slice(0, -1)}|${pron ? pron.slice(0, -1) : ""}}`;
      if (
        grammarClass_ === GRAMMATICAL_CLASSES.ADJECTIVE.label &&
        !/[aáeéiíoóuúüyý]$/.test(word)
      )
        return `{{es-accord-mixte-cons|${word}|${pron}}`;
      if (
        [
          GRAMMATICAL_CLASSES.ADJECTIVE.label,
          GRAMMATICAL_CLASSES.NOUN.label,
        ].includes(grammarClass_) &&
        !/[aáeéiíoóuúüyý]$/.test(word)
      )
        return `{{es-accord-ón|${word.slice(0, -2)}|${pron ? pron.slice(0, -2) : ""}}`;
    }

    return `{{es-rég|${pron}${mf}}}`;
  };

  languages.push(
    new types.Language(
      "es",
      "es",
      "spa",
      "espagnol",
      [
        ["a", "e", "ɛ", "i", "o", "ɔ", "u"],
        [
          "m",
          "n",
          "ɲ",
          "p",
          "b",
          "β",
          "f",
          "t",
          "d",
          "ð",
          "θ",
          "s",
          "t͡ʃ",
          "ʝ",
          "ʃ",
          "k",
          "ɡ",
          "ɣ",
          "x",
          "χ",
          "l",
          "ʎ",
          "ɾ",
          "r",
        ],
        ["j", "w"],
        [".", "ˈ"],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
            GENDERS.UNKNOWN,
          ],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
          régularité: [VERBS.REGULAR_VERB, VERBS.IRREGULAR_VERB],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
            GENDERS.UNKNOWN,
          ],
        }),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getSpanishModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // es

  /*
   * Portuguese language definition.
   */

  /**
   * Generate the inflections template for Portuguese.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string] | [string, string]} properties The selected grammatical properties.
   * @param {string} pron The pronunciation.
   * @returns An inflections template.
   */
  const getPortugueseModel = (word, plural, grammarClass, properties, pron) => {
    const [gender, number] =
      properties.length >= 2 ? properties : [null, NUMBERS.INVARIABLE.label];

    if (number === NUMBERS.UNKNOWN.label || gender === GENDERS.UNKNOWN.label)
      return "{{boite à flexions demandée|pt}}";

    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{pt-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{pt-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{pt-inv|${pron}|inv_titre=Pluriel}}`;
    if (number === NUMBERS.INVARIABLE.label)
      return `{{pt-inv|${pron}|inv_titre=${grammarClass}}}`;

    if (gender === GENDERS.FEMININE_MASCULINE.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "pt-accord-mf",
        paramOrder: ["ps", "p", "mf"],
        params: {
          ps: pron,
          p: plural,
          mf: true,
        },
      });

    if (grammarClass.toLowerCase() === GRAMMATICAL_CLASSES.NOUN.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "pt-rég",
        paramOrder: ["1", "p"],
        params: {
          1: pron,
          p: plural,
        },
      });

    return templates.templateToString({
      format: inlineTemplateFormat,
      name: "pt-accord-mixte",
      paramOrder: ["prad", "mp"],
      params: {
        prad: pron.slice(0, -1),
        mp: plural,
      },
    });
  };

  languages.push(
    new types.Language(
      "pt",
      "pt",
      "por",
      "portugais",
      [
        ["ɐ", "a", "e", "ɛ", "ɨ", "i", "u", "o", "ɔ"],
        ["ɐ̃", "ɐ̃w̃", "ẽ", "ẽj̃", "ĩ", "ĩɰ̃", "õ", "õj̃", "õw̃", "ũ"],
        [
          "b",
          "s",
          "k",
          "ʃ",
          "d",
          "f",
          "ʒ",
          "ɡ",
          "w",
          "l",
          "ʎ",
          "m",
          "n",
          "ɲ",
          "p",
          "ɦ",
          "ɣ",
          "x",
          "ɾ",
          "r",
          "ħ",
          "ɹ",
          "ɦ",
          "z",
          "t",
          "v",
        ],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {}),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
        }),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
            GENDERS.UNKNOWN,
          ],
        }),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
              NUMBERS.UNKNOWN,
            ],
          },
          getPortugueseModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // pt

  /*
   * Esperanto language definition.
   */

  /**
   * Generate the inflections template for Esperanto.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string]} properties The selected grammatical properties.
   * @param {string} pron The pronunciation.
   * @returns An inflections template.
   */
  const getEsperantoModel = (word, plural, grammarClass, properties, pron) => {
    if (
      [
        GRAMMATICAL_CLASSES.NOUN.label,
        GRAMMATICAL_CLASSES.ADJECTIVE.label,
        GRAMMATICAL_CLASSES.FIRST_NAME.label,
        GRAMMATICAL_CLASSES.LAST_NAME.label,
        GRAMMATICAL_CLASSES.PROPER_NOUN.label,
        GRAMMATICAL_CLASSES.CONJUNCTION.label,
      ].includes(grammarClass.toLowerCase())
    )
      return `{{eo-flexions|${pron}}}`;
    if (grammarClass.toLowerCase() === GRAMMATICAL_CLASSES.VERB.label)
      return "{{eo-verbe}}";
    return "";
  };

  languages.push(
    new types.Language(
      "eo",
      "eo",
      "epo",
      "espéranto",
      [
        ["a", "e", "i", "o", "u"],
        [
          "b",
          "d",
          "d͡ʒ",
          "f",
          "ɡ",
          "h",
          "k",
          "l",
          "m",
          "n",
          "p",
          "r",
          "s",
          "t",
          "t͡s",
          "t͡ʃ",
          "v",
          "x",
          "z",
          "ʃ",
          "ʒ",
        ],
        ["j", "w"],
        [".", "ˈ"],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {},
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {},
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PROPER_NOUN,
          {},
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.VERB,
          { type: [VERBS.VERB] },
          getEsperantoModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.FIRST_NAME,
          {},
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
      ],
      (word) =>
        word
          .toLowerCase()
          .replaceAll("c", "t͡s")
          .replaceAll("ĉ", "t͡ʃ")
          .replaceAll("g", "ɡ")
          .replaceAll("ĝ", "d͡ʒ")
          .replaceAll("ĥ", "x")
          .replaceAll("ĵ", "ʒ")
          .replaceAll("ŝ", "ʃ")
          .replaceAll("ŭ", "w")
          .replaceAll(/['’]/g, "")
    )
  ); // eo

  /*
   * Breton language definition.
   */

  /**
   * Generate the inflections template for Breton.
   * @param {string} word The word.
   * @param {string} plural The word’s plural.
   * @param {string} grammarClass The selected grammatical class.
   * @param {[string] | [string, string]} properties The selected grammatical properties.
   * @returns An inflections template.
   */
  const getBretonModel = (word, plural, grammarClass, properties) => {
    const number = properties[1];
    if (number === NUMBERS.UNKNOWN.label)
      return "{{boite à flexions demandée|br}}";
    if (number === NUMBERS.DIFF_SINGULAR_PLURAL.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "br-nom",
        paramOrder: ["1", "2"],
        params: {
          1: word,
          2: plural,
        },
      });
    if (number === NUMBERS.COLLECTIVE_SINGULATIVE.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "br-nom-cs",
        paramOrder: ["1", "2"],
        params: {
          1: word,
          2: plural,
        },
      });
    if (number === NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "br-nom-csp",
        paramOrder: ["1", "2"],
        params: {
          1: word,
          2: plural,
        },
      });
    if (number === NUMBERS.SINGULATIVE_DUAL_PLURAL.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "br-nom-duel",
        paramOrder: ["1", "2"],
        params: {
          1: word,
          2: plural,
        },
      });

    const grammarClass_ = grammarClass.toLowerCase();
    if (grammarClass_ === GRAMMATICAL_CLASSES.PROPER_NOUN.label)
      return `{{br-nom-pr}}`;
    if (grammarClass_ === GRAMMATICAL_CLASSES.FIRST_NAME.label)
      return `{{br-nom-pr|forme=Prénom}}`;
    if (grammarClass_ === GRAMMATICAL_CLASSES.LAST_NAME.label)
      return `{{br-nom-pr|forme=Nom de famille}}`;
    if (grammarClass_ === GRAMMATICAL_CLASSES.ADJECTIVE.label)
      return `{{br-flex-adj}}`;
    if (grammarClass_ === GRAMMATICAL_CLASSES.VERB.label)
      return `{{br-forme-mut|${word}}}`;
    if (grammarClass_ === GRAMMATICAL_CLASSES.PREPOSITION.label)
      return templates.templateToString({
        format: inlineTemplateFormat,
        name: "br-prép",
        paramOrder: ["1", "2"],
        params: {
          1: word,
          2: plural,
        },
      });

    return "";
  };

  languages.push(
    new types.Language(
      "br",
      "br",
      "bre",
      "breton",
      [
        ["a", "ɑ", "ɒ", "e", "ɛ", "i", "o", "ɔ", "y"],
        ["ã", "ẽ", "ɛ̃", "ĩ", "õ", "ɔ̃", "ỹ"],
        [
          "k",
          "ɡ",
          "t",
          "d",
          "d͡ʒ",
          "p",
          "b",
          "ʃ",
          "ʒ",
          "f",
          "v",
          "ʋ",
          "f̬",
          "v̝",
          "s",
          "z",
          "χ",
          "x",
          "ɣ",
          "h",
          "ɦ",
          "t͡ʃ",
          "c",
          "l",
          "r",
          "r̥",
          "ʁ",
          "ʀ",
          "ɾ",
          "m",
          "n",
        ],
        ["j", "ɥ", "w"],
        [".", "ˈ", "ˑ", "ː"],
      ],
      [
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
              GENDERS.UNKNOWN,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.COLLECTIVE_SINGULATIVE,
              NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL,
              NUMBERS.SINGULATIVE_DUAL_PLURAL,
              NUMBERS.UNKNOWN,
            ],
          },
          getBretonModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.VERB,
          { type: [VERBS.VERB] },
          getBretonModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // br

  /*
   * International conventions "language" definition.
   */

  languages.push(
    new types.Language(
      "conv",
      null,
      null,
      "conventions internationales",
      [],
      [
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SCIENTIFIC_NAME),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.SYMBOL),
        new types.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB),
      ]
    )
  ); // conv

  return languages;
}

/**
 * Return a default Language object for the given code.
 * @param {string} code The language’s code .
 * @returns A new Language object or null if the given code is not registered.
 */
function getDefaultLanguage(code) {
  const langData = langs.getLanguage(code, true);
  if (!langData) return null;
  if (langData.aliasOf) code = langData.aliasOf; // We don’t want to use the alias
  const name = langs.getLanguageName(code, true);
  if (!name) return null;

  // Add most common classes on top
  const topClasses = [
    "ADJECTIVE",
    "ADVERB",
    "NOUN",
    "VERB",
    "PRONOUN",
    "PROPER_NOUN",
    "INTERJECTION",
  ];
  const items = topClasses.map(
    (key) => new types.GrammaticalItem(GRAMMATICAL_CLASSES[key])
  );
  // Add all remaining classes
  for (const [k, v] of Object.entries(GRAMMATICAL_CLASSES)) {
    if (!topClasses.includes(k)) {
      items.push(new types.GrammaticalItem(v));
      topClasses.push(k);
    }
  }
  const languageData = langs.getLanguage(code);
  return new types.Language(
    code,
    languageData.wikimediaCode || null,
    null,
    name,
    [],
    items,
    null,
    false
  );
}

/**
 * Check whether the given language code is present in the given list of codes.
 * This function takes aliases into account.
 * @param {string[]} codes List of language codes.
 * @param {string} code A language code.
 * @returns {boolean} True if the code or any of its aliases is in the list, false otherwise.
 */
function containsLanguage(codes, code) {
  const lang = langs.getLanguage(code, true);
  if (!lang) return false;

  for (const c of codes) {
    const otherLang = langs.getLanguage(c, true);
    if (!otherLang) continue;
    if (
      code === c ||
      lang.aliasOf === c ||
      code === otherLang.aliasOf ||
      (lang.aliasOf && otherLang.aliasOf && lang.aliasOf === otherLang.aliasOf)
    )
      return true;
  }
  return false;
}

// </nowiki>
/**
 * This module defines the languages and language-related data used by the gadget.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/languages.js]]
 */
export default {
  GENDERS,
  NUMBERS,
  COMPARATIVES,
  VERBS,
  GRAMMATICAL_CLASSES,
  loadLanguages,
  getDefaultLanguage,
  containsLanguage,
};
