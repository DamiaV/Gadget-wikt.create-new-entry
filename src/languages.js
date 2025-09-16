/**
 * This object contains the data for languages needed by the gadget.
 */
// <nowiki>
import L from "./wiki_deps/wikt.core.languages.js";
import T from "./types.js";

/**
 * All available grammatical genders.
 */
const GENDERS = {
  MASCULINE: new T.GrammaticalProperty("masculin", "{{m}}"),
  FEMININE: new T.GrammaticalProperty("féminin", "{{f}}"),
  FEMININE_MASCULINE_DIFF: new T.GrammaticalProperty(
    "masc. et fém. différents"
  ),
  FEMININE_MASCULINE: new T.GrammaticalProperty(
    "masc. et fém. identiques",
    "{{mf}}"
  ),
};

/**
 * All available grammatical numbers.
 */
const NUMBERS = {
  DIFF_SINGULAR_PLURAL: new T.GrammaticalProperty("sing. et plur. différents"),
  SAME_SINGULAR_PLURAL: new T.GrammaticalProperty(
    "sing. et plur. identiques",
    "{{sp}}"
  ),
  SINGULAR_ONLY: new T.GrammaticalProperty(
    "singulier uniquement",
    "{{au singulier uniquement|{0}}}"
  ),
  PLURAL_ONLY: new T.GrammaticalProperty(
    "pluriel uniquement",
    "{{au pluriel uniquement|{0}}}"
  ),
  INVARIABLE: new T.GrammaticalProperty("invariable", "{{invariable}}"),
  COLLECTIVE_SINGULATIVE: new T.GrammaticalProperty(
    "collectif et singulatif",
    "{{collectif}}"
  ),
  COLLECTIVE_SINGULATIVE_PLURAL: new T.GrammaticalProperty(
    "collectif, singulatif, et pluriel du singulatif",
    "{{collectif}}"
  ),
  SINGULATIVE_DUAL_PLURAL: new T.GrammaticalProperty(
    "singulier, duel, et pluriel"
  ),
};

const COMPARATIVES = {
  COMPARABLE_MORE_MOST: new T.GrammaticalProperty("comparable (more…/most…)"),
  COMPARABLE_ER_EST: new T.GrammaticalProperty("comparable (-er/-est)"),
  UNCOMPARABLE: new T.GrammaticalProperty("incomparable"),
};

/**
 * All available verb groups and types.
 */
const VERBS = {
  GROUP1: new T.GrammaticalProperty(
    "Premier groupe",
    "{{type|{0}}} {{conjugaison|{0}|groupe=1}}"
  ),
  GROUP2: new T.GrammaticalProperty(
    "Deuxième groupe",
    "{{type|{0}}} {{conjugaison|{0}|groupe=2}}"
  ),
  GROUP3: new T.GrammaticalProperty(
    "Troisième groupe",
    "{{type|{0}}} {{conjugaison|{0}|groupe=3}}"
  ),
  REGULAR_VERB: new T.GrammaticalProperty("régulier", "{{type|{0}}}"),
  IRREGULAR_VERB: new T.GrammaticalProperty(
    "irrégulier",
    "{{type|{0}}} {{irrégulier|{0}}}"
  ),
  VERB: new T.GrammaticalProperty("verbe", "{{type|{0}}}"),
};

/**
 * All available grammatical classes.
 */
const GRAMMATICAL_CLASSES = {
  SYMBOL: new T.GrammaticalClass("symbole"),
  LETTER: new T.GrammaticalClass("lettre"),

  SCIENTIFIC_NAME: new T.GrammaticalClass("nom scientifique"),

  // Nouns
  NOUN: new T.GrammaticalClass("nom commun", "nom"),
  PROPER_NOUN: new T.GrammaticalClass("nom propre"),
  FIRST_NAME: new T.GrammaticalClass("prénom"),
  LAST_NAME: new T.GrammaticalClass("nom de famille"),

  // Adjectives
  ADJECTIVE: new T.GrammaticalClass("adjectif"),
  INTERROGATIVE_ADJECTIVE: new T.GrammaticalClass("adjectif interrogatif"),
  NUMERAL_ADJECTIVE: new T.GrammaticalClass("adjectif numéral"),
  POSSESSIVE_ADJECTIVE: new T.GrammaticalClass("adjectif possessif"),

  // Adverbs
  ADVERB: new T.GrammaticalClass("adverbe"),
  INTERROGATIVE_ADVERB: new T.GrammaticalClass("adverbe interrogatif"),

  // Pronouns
  PRONOUN: new T.GrammaticalClass("pronom"),
  DEMONSTRATIVE_PRONOUN: new T.GrammaticalClass("pronom démonstratif"),
  INDEFINITE_PRONOUN: new T.GrammaticalClass("pronom indéfini"),
  INTERROGATIVE_PRONOUN: new T.GrammaticalClass("pronom interrogatif"),
  PERSONAL_PRONOUN: new T.GrammaticalClass("pronom personnel"),
  POSSESSIVE_PRONOUN: new T.GrammaticalClass("pronom possessif"),
  RELATIVE_PRONOUN: new T.GrammaticalClass("pronom relatif"),

  // Conjunctions
  CONJUNCTION: new T.GrammaticalClass("conjonction"),
  COORDINATION_CONJUNCTION: new T.GrammaticalClass(
    "conjonction de coordination"
  ),

  // Articles
  ARTICLE: new T.GrammaticalClass("article"),
  INDEFINITE_ARTICLE: new T.GrammaticalClass("article indéfini"),
  DEFINITE_ARTICLE: new T.GrammaticalClass("article défini"),
  PARTITIVE_ARTICLE: new T.GrammaticalClass("article partitif"),

  // Affixes
  PREFIX: new T.GrammaticalClass("préfixe"),
  SUFFIX: new T.GrammaticalClass("suffixe"),
  CIRCUMFIX: new T.GrammaticalClass("circonfixe"),
  INFIX: new T.GrammaticalClass("infixe"),

  VERB: new T.GrammaticalClass("verbe"),
  PREPOSITION: new T.GrammaticalClass("préposition"),
  POSTPOSITION: new T.GrammaticalClass("postposition"),
  PARTICLE: new T.GrammaticalClass("particule"),
  INTERJECTION: new T.GrammaticalClass("interjection"),
  ONOMATOPOEIA: new T.GrammaticalClass("onomatopée"),

  PHRASE: new T.GrammaticalClass("locution/phrase", "locution-phrase"),
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

  /*
   * French language definition.
   */

  const getFrenchModel = (word, grammarClass, properties, pron, simple) => {
    const [gender, number] =
      properties.length >= 2 ? properties : [null, NUMBERS.INVARIABLE.label];
    if (number === NUMBERS.INVARIABLE.label)
      return `{{fr-inv|${pron}|inv_titre=${grammarClass}}}`;
    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{fr-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{fr-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{fr-inv|${pron}|inv_titre=Pluriel}}`;

    if (gender === GENDERS.FEMININE_MASCULINE.label)
      return `{{fr-rég|${pron}|mf=oui}}`;

    return simple ? `{{fr-rég|${pron}}}` : `{{fr-accord-rég|${pron}}}`;
  };

  languages.push(
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, {}, getFrenchModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {
          genre: [
            GENDERS.FEMININE,
            GENDERS.MASCULINE,
            GENDERS.FEMININE_MASCULINE,
          ],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME, {}),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PARTICLE, {}, getFrenchModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {}),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getFrenchModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          (word, grammarClass, properties, pron) =>
            getFrenchModel(word, grammarClass, properties, pron, true)
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // fr

  /*
   * English language definition.
   */

  const getEnglishModel = (word, grammarClass, properties, pron) => {
    const grammarClass_ = grammarClass.toLowerCase();
    const number = properties[0];
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
      return `{{en-nom-rég|${pron}}}`;
    return `{{en-inv|${pron}|inv_titre=${grammarClass}}}`;
  };

  languages.push(
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            comparatif: [
              COMPARATIVES.COMPARABLE_MORE_MOST,
              COMPARATIVES.COMPARABLE_ER_EST,
              COMPARATIVES.UNCOMPARABLE,
            ],
          },
          getEnglishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, {}, getEnglishModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PROPER_NOUN,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.VERB,
          { type: [VERBS.REGULAR_VERB, VERBS.IRREGULAR_VERB] },
          getEnglishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.LAST_NAME,
          {
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.FIRST_NAME,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, {}, getEnglishModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {},
          getEnglishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // en

  /*
   * Italian language definition.
   */

  const getItalianModel = (word, grammarClass, properties, pron) => {
    const [gender, number] =
      properties.length >= 2 ? properties : [null, NUMBERS.INVARIABLE.label];
    if (number === NUMBERS.INVARIABLE.label)
      return `{{it-inv|${pron}|inv_titre=${grammarClass}}}`;
    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{it-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{it-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{it-inv|${pron}|inv_titre=Pluriel}}`;

    if (gender === GENDERS.FEMININE_MASCULINE.label)
      return `{{it-flexion|${pron}|mf=oui}}`;

    return `{{it-flexion|${pron}}}`;
  };

  languages.push(
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, {}, getItalianModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
          ],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
          ],
        }),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getItalianModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // it

  /*
   * Spanish language definition.
   */

  const getSpanishModel = (word, grammarClass, properties, pron) => {
    const [gender, number] =
      properties.length >= 2 ? properties : [null, NUMBERS.INVARIABLE.label];
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
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, {}, getSpanishModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
          ],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
          régularité: [VERBS.REGULAR_VERB, VERBS.IRREGULAR_VERB],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
          ],
        }),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getSpanishModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // it

  /*
   * Portuguese language definition.
   */

  const getPortugueseModel = (word, grammarClass, properties, pron) => {
    const [gender, number] =
      properties.length >= 2 ? properties : [null, NUMBERS.INVARIABLE.label];
    if (number === NUMBERS.SAME_SINGULAR_PLURAL.label)
      return `{{pt-inv|${pron}|sp=oui}}`;
    if (number === NUMBERS.SINGULAR_ONLY.label)
      return `{{pt-inv|${pron}|inv_titre=Singulier}}`;
    if (number === NUMBERS.PLURAL_ONLY.label)
      return `{{pt-inv|${pron}|inv_titre=Pluriel}}`;

    if (gender === GENDERS.FEMININE_MASCULINE.label)
      return `{{pt-rég|${pron}|mf=oui}}`;

    return `{{pt-inv|${pron}|inv_titre=${grammarClass}}}`;
  };

  languages.push(
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {
            genre: [
              GENDERS.FEMININE_MASCULINE_DIFF,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN, {}),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.VERB, {
          groupe: [VERBS.GROUP1, VERBS.GROUP2, VERBS.GROUP3],
        }),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTICLE,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME, {
          genre: [
            GENDERS.MASCULINE,
            GENDERS.FEMININE,
            GENDERS.FEMININE_MASCULINE,
          ],
        }),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.SAME_SINGULAR_PLURAL,
              NUMBERS.SINGULAR_ONLY,
              NUMBERS.PLURAL_ONLY,
            ],
          },
          getPortugueseModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // pt

  /*
   * Esperanto language definition.
   */

  const getEsperantoModel = (_, grammarClass, properties, pron) => {
    if (
      [
        GRAMMATICAL_CLASSES.NOUN.label,
        GRAMMATICAL_CLASSES.ADJECTIVE.label,
        GRAMMATICAL_CLASSES.FIRST_NAME.label,
        GRAMMATICAL_CLASSES.LAST_NAME.label,
        GRAMMATICAL_CLASSES.PROPER_NOUN.label,
        GRAMMATICAL_CLASSES.CONJUNCTION.label,
      ].includes(properties[0])
    )
      return `{{eo-flexions|${pron}}}`;
    if (grammarClass.toLowerCase() === GRAMMATICAL_CLASSES.VERB.label)
      return "{{eo-verbe}}";
    return "";
  };

  languages.push(
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {},
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADVERB,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.NOUN, {}, getEsperantoModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PROPER_NOUN,
          {},
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.VERB,
          { type: [VERBS.VERB] },
          getEsperantoModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.FIRST_NAME,
          {},
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PRONOUN,
          { nombre: [NUMBERS.INVARIABLE] },
          getEsperantoModel
        ),
      ],
      (word) =>
        word
          .toLowerCase()
          .replace(/c/g, "t͡s")
          .replace(/ĉ/g, "t͡ʃ")
          .replace(/g/g, "ɡ")
          .replace(/ĝ/g, "d͡ʒ")
          .replace(/ĥ/g, "x")
          .replace(/ĵ/g, "ʒ")
          .replace(/ŝ/g, "ʃ")
          .replace(/ŭ/g, "w")
    )
  ); // eo

  /*
   * Breton language definition.
   */

  const getBretonModel = (word, grammarClass, properties) => {
    const number = properties[1];
    if (number === NUMBERS.DIFF_SINGULAR_PLURAL.label)
      return `{{br-nom|${word}}}`;
    if (number === NUMBERS.COLLECTIVE_SINGULATIVE.label)
      return `{{br-nom-cs|${word}}}`;
    if (number === NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL.label)
      return `{{br-nom-csp|${word}}}`;
    if (number === NUMBERS.SINGULATIVE_DUAL_PLURAL.label)
      return `{{br-nom-duel|${word}|<!-- DUEL À COMPLÉTER -->}}`;
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
      return `{{br-prép|${word}|<!-- TYPE À COMPLÉTER -->}}`;
    return "";
  };

  languages.push(
    new T.Language(
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
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ADJECTIVE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB, {}, getBretonModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NOUN,
          {
            genre: [
              GENDERS.MASCULINE,
              GENDERS.FEMININE,
              GENDERS.FEMININE_MASCULINE,
            ],
            nombre: [
              NUMBERS.DIFF_SINGULAR_PLURAL,
              NUMBERS.COLLECTIVE_SINGULATIVE,
              NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL,
              NUMBERS.SINGULATIVE_DUAL_PLURAL,
            ],
          },
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.VERB,
          { type: [VERBS.VERB] },
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PHRASE),

        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADJECTIVE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.NUMERAL_ADJECTIVE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_ADJECTIVE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_ADVERB,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEFINITE_ARTICLE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_ARTICLE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PARTITIVE_ARTICLE,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.CONJUNCTION,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.COORDINATION_CONJUNCTION,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERJECTION,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.ONOMATOPOEIA,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.LAST_NAME),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PARTICLE, {}, getBretonModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSTPOSITION,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PREFIX),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.FIRST_NAME),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PREPOSITION,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PRONOUN, {}, getBretonModel),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.DEMONSTRATIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INDEFINITE_PRONOUN,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.INTERROGATIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.PERSONAL_PRONOUN,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.POSSESSIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(
          GRAMMATICAL_CLASSES.RELATIVE_PRONOUN,
          {},
          getBretonModel
        ),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SUFFIX),
      ]
    )
  ); // br

  /*
   * International conventions "language" definition.
   */

  languages.push(
    new T.Language(
      "conv",
      null,
      null,
      "conventions internationales",
      [],
      [
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SCIENTIFIC_NAME),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.PROPER_NOUN),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.SYMBOL),
        new T.GrammaticalItem(GRAMMATICAL_CLASSES.ADVERB),
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
  const langData = L.getLanguage(code, true);
  if (!langData) return null;
  if (langData.aliasOf) code = langData.aliasOf; // We don’t want to use the alias
  let name = L.getLanguageName(code, true);
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
    (key) => new T.GrammaticalItem(GRAMMATICAL_CLASSES[key])
  );
  // Add all remaining classes
  for (const [k, v] of Object.entries(GRAMMATICAL_CLASSES)) {
    if (!topClasses.includes(k)) {
      items.push(new T.GrammaticalItem(v));
      topClasses.push(k);
    }
  }
  const languageData = L.getLanguage(code);
  return new T.Language(
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
  const lang = L.getLanguage(code, true);
  if (!lang) return false;

  for (const c of codes) {
    const otherLang = L.getLanguage(c, true);
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

export default {
  loadLanguages,
  getDefaultLanguage,
  containsLanguage,
};
// </nowiki>
