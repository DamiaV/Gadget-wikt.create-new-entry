// <nowiki>
import langs from "./wiki_deps/wikt.core.languages.js";
import langs2 from "./languages.js";
import types from "./types.js";
import strings from "./strings.js";
import templates from "./templates.js";

const specialCharacters = [
  "à",
  "À",
  "â",
  "Â",
  "æ",
  "Æ",
  "ç",
  "Ç",
  "é",
  "É",
  "è",
  "È",
  "ê",
  "Ê",
  "ë",
  "Ë",
  "î",
  "Î",
  "ï",
  "Ï",
  "ô",
  "Ô",
  "œ",
  "Œ",
  "ſ",
  "ù",
  "Ù",
  "û",
  "Û",
  "ü",
  "Ü",
  "ÿ",
  "Ÿ",
  "·",
  "’",
];

const sectionsOrder = [
  "variantes orthographiques",
  "variantes",
  "anciennes orthographes",
  "écriture",
  "transcriptions",
  "translittérations",
  "abréviations",
  "noms vernaculaires",
  "augmentatifs",
  "diminutifs",
  "synonymes",
  "quasi-synonymes",
  "antonymes",
  "gentilés",
  "composés",
  "dérivés",
  "apparentés",
  "vocabulaire",
  "phrases",
  "variantes dialectales",
  "hyperonymes",
  "hyponymes",
  "holonymes",
  "méronymes",
  "hyper-verbes",
  "troponymes",
  "traductions",
  "dérivés autres langues",
  "faux-amis",
  "déclinaison",
  "notes",
];

const inlineTemplateFormat = templates.parseTemplateFormat("inline");

/**
 * Format a FormData object into wikitext.
 * @param {import("./types.js").FormData} formData The FormData object to format.
 * @param {string} word The word we are creating a section for.
 * @returns {string} The formatted section.
 */
function generateWikitext(formData, word) {
  const language = formData.language;
  const langCode = language.code;
  const sortKey = formData.sortKey === word ? null : formData.sortKey;

  let wikitext = `== {{langue|${langCode}}} ==\n`;

  if (formData.stub) wikitext += `{{ébauche|${langCode}}}\n`;

  wikitext += "=== {{S|étymologie}} ===\n";
  if (formData.etymology) wikitext += formData.etymology + "\n";
  else wikitext += `{{ébauche-étym|${langCode}}}\n`;

  /** @type {[string, import("./types.js").RelatedWord[]][]} */
  const homophones = [];
  /** @type {[string, import("./types.js").RelatedWord[]][]} */
  const nearHomophones = [];
  /** @type {[string, string][]} */
  const phoneticMutations = [];
  const sectionNumbers = {};
  for (const entry of formData.entries) {
    const wordType = entry.wordType;
    let number;
    // FIXME only show number for word type if total is > 1
    if (sectionNumbers[wordType]) number = ++sectionNumbers[wordType];
    else number = sectionNumbers[wordType] = 1;
    wikitext += formatEntry(entry, word, language, number);

    const label =
      (wordType
        ? strings.capitalize(
            formData.language.getGrammarItem(wordType).grammaticalClass.label
          )
        : "Entrée") + ` ${number}`;
    if (entry.homophones.length) homophones.push([label, entry.homophones]);
    if (entry.nearHomophones.length)
      nearHomophones.push([label, entry.nearHomophones]);
    if (entry.phoneticMutations)
      phoneticMutations.push([label, entry.phoneticMutations]);
  }

  if (langCode !== "conv") {
    wikitext += `\n=== {{S|prononciation}} ===
{{ébauche-pron-audio|${langCode}}}
`;

    if (formData.pronunciationInfo)
      wikitext += formData.pronunciationInfo + "\n";

    if (homophones.length) {
      wikitext += `\n==== {{S|homophones|${langCode}}} ====\n`;
      for (const [label, homophonesSubList] of homophones) {
        if (homophonesSubList.length === 0) continue;
        wikitext += `; ${label}\n`;
        wikitext += formatRelatedWords(homophonesSubList, langCode);
      }
    }

    if (nearHomophones.length) {
      wikitext += "\n==== {{S|paronymes}} ====\n";
      for (const [label, nearHomophonesSubList] of nearHomophones) {
        if (nearHomophonesSubList.length === 0) continue;
        wikitext += `; ${label}\n`;
        wikitext += formatRelatedWords(nearHomophonesSubList, langCode);
      }
    }

    if (phoneticMutations.length) {
      wikitext += "\n==== {{S|mutation phonétique}} ====\n";
      for (const [label, phoneticMutationsSubList] of phoneticMutations) {
        if (phoneticMutationsSubList.length === 0) continue;
        wikitext += `; ${label}\n${phoneticMutationsSubList}`;
      }
    }
  }

  /** @type {string[]} */
  const wikiLinks = [];
  for (const [wikiName, wikiLink] of Object.entries(formData.wikiLinks)) {
    if (!wikiLink.enabled) continue;
    wikiLinks.push(
      templates.templateToString({
        name: types.wikis[wikiName].templateName,
        format: inlineTemplateFormat,
        paramOrder: ["1", "2", "lang"],
        params: {
          1: wikiLink.pageTitle,
          2: wikiLink.text,
          lang: language.wikimediaCode || language.code,
        },
      })
    );
  }

  if (wikiLinks.length) {
    wikitext += "\n=== {{S|voir}} ===\n";
    for (const wikiLink of wikiLinks) wikitext += `* ${wikiLink}\n`;
  }

  const anyReference =
    ((wikitext.includes("<ref ") || wikitext.includes("<ref>")) &&
      wikitext.includes("</ref>")) ||
    wikitext.includes("{{R|") ||
    wikitext.includes("{{réf}}") ||
    wikitext.includes("{{réf|");

  wikitext += formatReferences(formData.references, anyReference);

  for (const category of formData.categories)
    wikitext += `[[Catégorie:${category}${sortKey ? "|" + sortKey : ""}]]\n`;

  return wikitext;
}

/**
 * Escape the given wikitext.
 * @param {string} wikitext The wikitext to escape.
 * @returns {string} The escaped wikitext.
 */
function escape(wikitext) {
  return wikitext.replaceAll("|", "{{!}}");
}

/**
 * Format an Entry object into wikitext.
 * @param {import("./types.js").Entry} entry The Entry object to format.
 * @param {string} word The word we are creating a section for.
 * @param {import("./types.js").Language} language The language of the entry.
 * @param {number?} number The section’s disambiguation number.
 * @returns {string} The formatted entry.
 */
function formatEntry(entry, word, language, number) {
  const langCode = language.code;

  let wikitext = `\n=== {{S|${entry.wordType}|${langCode}`;
  if (number) wikitext += `|num=${number}`;
  wikitext += "}} ===\n";

  const grammarItem = language.getGrammarItem(entry.wordType);
  const wordPropertyTemplates = [];
  const wordPropertyLabels = [];
  if (grammarItem) {
    for (const [propertyType, property] of Object.entries(
      entry.wordProperties
    )) {
      const wordProperty = grammarItem.getProperty(propertyType, property);
      if (wordProperty.template)
        wordPropertyTemplates.push(
          interpolateString(wordProperty.template, langCode)
        );
      wordPropertyLabels.push(wordProperty.label);
    }
  }
  const inflectionsTemplate = grammarItem
    ? grammarItem.getInflectionsTemplate(
        word,
        wordPropertyLabels,
        entry.pronunciations.length ? entry.pronunciations[0].pronunciation : ""
      )
    : "";
  if (inflectionsTemplate) wikitext += inflectionsTemplate + "\n";

  /** @type {string[]} */
  const definitions = [];
  /** @type {Record<string, string | null>} */
  const relatedSections = {
    notes: entry.notes,
    traductions: langCode === "fr" ? "{{trad-début}}\n{{trad-fin}}\n" : null,
  };

  for (let i = 0; i < entry.definitions.length; i++) {
    const definition = entry.definitions[i];
    if (definition.illustration)
      wikitext += formatIllustration(definition.illustration) + "\n";
    definitions.push(formatDefinition(definition, langCode));

    const label = `Définition ${i + 1}`;
    for (const [sectionCode, relatedWords] of Object.entries(
      definition.relatedWords
    )) {
      if (!relatedSections[sectionCode]) relatedSections[sectionCode] = "";
      relatedSections[sectionCode] +=
        `; ${label}\n` + formatRelatedWords(relatedWords, langCode);
    }
  }

  if (
    langCode === "conv" &&
    entry.wordType === langs2.GRAMMATICAL_CLASSES.SCIENTIFIC_NAME.label
  )
    wikitext += `'''''${word}'''''`;
  else wikitext += `'''${word}'''`;
  if (langCode !== "conv")
    wikitext += formatPronunciations(entry.pronunciations, langCode);

  if (wordPropertyTemplates.length)
    wikitext += " " + wordPropertyTemplates.join(" ");
  wikitext += "\n";

  wikitext += definitions.join("");

  for (const [sectionCode, relatedWords] of Object.entries(entry.relatedWords))
    relatedSections[sectionCode] = formatRelatedWords(relatedWords, langCode);

  for (const sectionCode of sectionsOrder) {
    if (!relatedSections[sectionCode]) continue;
    wikitext += `\n==== {{S|${sectionCode}}} ====\n${relatedSections[sectionCode]}`;
  }

  return wikitext;
}

/**
 * Format the given pronunciations.
 * @param {import("./types.js").Pronunciation[]} pronunciations The list of pronunciations to format.
 * @param {string} langCode The entry’s language code.
 * @returns {string} The formatted pronunciations.
 */
function formatPronunciations(pronunciations, langCode) {
  let wikitext = "";

  /**
   * @param {string} templateName
   * @param {string[]} prons
   */
  function formatProns(templateName, prons) {
    const joinedProns = prons.join("|");
    return ` {{${templateName}|${joinedProns}|${langCode}}}`;
  }

  /** @type {string[]} */
  let buffer = [];
  let templateName = "pron";
  let prevPronReconstructed = false;
  for (const pronunciation of pronunciations) {
    if (prevPronReconstructed !== pronunciation.isReconstructed) {
      if (buffer.length !== 0) {
        wikitext += formatProns(templateName, buffer);
        buffer = [];
      }
      prevPronReconstructed = !prevPronReconstructed;
      templateName = prevPronReconstructed ? "pron-recons" : "pron";
    }
    buffer.push(pronunciation.pronunciation);
  }
  if (buffer.length !== 0) wikitext += formatProns(templateName, buffer);

  if (!wikitext) return ` {{pron||${langCode}}}`;

  return wikitext;
}

/**
 * Format an Illustration object into wikitext.
 * @param {import("./types.js").Illustration} illustration The Illustration object to format.
 * @returns {string} The formatted illustration.
 */
function formatIllustration(illustration) {
  let wikitext = "";

  switch (illustration.type) {
    case "image":
    case "video":
    case "audio":
      wikitext = `[[Fichier:${illustration.fileName}|${escape(illustration.description)}`;
      if (illustration.alt) wikitext += `|alt=${illustration.alt}`;
      wikitext += "]]";
      break;
    case "text":
      wikitext = `{{illustration texte|${illustration.text}|${escape(illustration.description)}}}`;
      break;
    case "color":
      wikitext = `{{illustration couleur|${illustration.color}|${escape(illustration.description)}}}`;
      break;
  }

  return wikitext;
}

/**
 * Format a Definition object into wikitext.
 * @param {import("./types.js").Definition} definition The Definition object to format.
 * @param {string} langCode The language code of the entry.
 * @returns {string} The formatted definition with its examples.
 */
function formatDefinition(definition, langCode) {
  let wikitext = `# ${definition.text}\n`;
  if (definition.examples.length)
    for (const example of definition.examples)
      wikitext += formatExample(example, langCode);
  else wikitext += formatExample(types.createEmptyExample(), langCode);
  return wikitext;
}

const exempleTemplateFormatString =
  templates.parseTemplateFormat("{{_\n | _=_\n}}\n");

/**
 * Format an Example object into wikitext.
 * @param {import("./types.js").Example} example The Example object to format.
 * @param {string} langCode The language code of the entry.
 * @returns {string} The formatted example.
 */
function formatExample(example, langCode) {
  return (
    "#* " +
    templates.templateToString({
      name: "exemple",
      format: exempleTemplateFormatString,
      paramOrder: ["1", "2", "3", "source", "lien", "pas-trad", "lang"],
      params: {
        1: example.text,
        2:
          langCode !== "fr" && !example.disableTranslation
            ? example.translation
            : "",
        3: langCode !== "fr" ? example.transcription : "",
        source: example.source,
        "pas-trad": example.disableTranslation,
        lien: example.link,
        lang: langCode,
      },
    })
  );
}

/**
 * Format an array of RelatedWord objects.
 * @param {import("./types.js").RelatedWord[]} relatedWords An array of RelatedWord objects.
 * @param {string} langCode The entry’s language code.
 * @returns {string} The formatted wikitext.
 */
function formatRelatedWords(relatedWords, langCode) {
  /**
   * @type {string[]}
   */
  const lines = [];
  for (const relatedWord of relatedWords) {
    let line;
    if ("words" in relatedWord) {
      const { words, annotation, nonFormattedAnnotation } = relatedWord;
      const links = words
        .map((word) => `{{lien|${word}|${langCode}}}`)
        .join(", ");
      line = `* ${links}`;
      if (annotation) {
        line += " ";
        if (nonFormattedAnnotation) line += annotation;
        else line += `''(${annotation})''`;
      }
    } else line = `: ${relatedWord.text}`;
    lines.push(line);
  }
  return lines.join("\n") + "\n";
}

/**
 * Format the given References object.
 * @param {import("./types.js").References} references The References object to format.
 * @param {boolean} anyReference Whether there are any references anywhere.
 * @returns {string} The formatted references.
 */
function formatReferences(references, anyReference) {
  const { imports, bibliography } = references;
  const wikiImports = Object.entries(references.wikiImports);
  let wikitext = "";

  if (anyReference || imports || bibliography || wikiImports.length) {
    let newLine = false;
    wikitext += "\n=== {{S|références}} ===\n";

    if (imports) {
      wikitext += imports + "\n";
      newLine = true;
    }

    if (wikiImports.length) {
      for (const [wikiName, wikiImports_] of wikiImports) {
        let wiki = types.wikis[wikiName];
        const templateName = `Source-${wiki.interwikiCode}`;
        for (const { langCode, title, oldId } of wikiImports_) {
          const language = langs.getLanguage(langCode, true);
          const template = templates.templateToString({
            name: templateName,
            format: inlineTemplateFormat,
            paramOrder: ["1", "2", "3"],
            params: {
              1: language.wikimediaCode || language.code,
              2: title,
              3: oldId,
            },
          });
          wikitext += `* ${template}\n`;
        }
      }
      newLine = true;
    }

    if (anyReference) {
      if (newLine) wikitext += "\n";
      wikitext += "==== {{S|sources}} ====\n{{Références}}\n";
      newLine = true;
    }

    if (bibliography) {
      if (newLine) wikitext += "\n";
      wikitext += `==== {{S|bibliographie}} ====\n${bibliography}\n`;
    }
  }

  return wikitext;
}

/**
 * Format a string by replacing placeholders (e.g., "{0}", "{1}") with the provided values.
 * @param {string} str The string containing placeholders.
 * @param {any[]} values The list of values to insert into the string.
 * @returns {string} The formatted string.
 */
function interpolateString(str, ...values) {
  return str.replaceAll(/{(\d+)}/g, (match, number) =>
    typeof values[+number] !== "undefined" ? String(values[+number]) : match
  );
}

const SPECIAL_CHARS = "|<>[]{}#";

/**
 * Check whether the given text contains any wikitext special characters, and return the first one if any.
 * @param {string} text The text to check.
 * @param {string?} exclude A string containing characters to ignore.
 * @returns {string | null} The first special character that was encountered, or `null` if there were none.
 */
function findWikitextSpecialChars(text, exclude) {
  for (const char of text)
    if (SPECIAL_CHARS.includes(char) && (!exclude || !exclude.includes(char)))
      return char;
  return null;
}

/**
 * Create a new validator function for the given key prefix and characters exclusion list.
 * @param {import("./types.js").ValidationLock} validationLock A validation lock.
 * @param {string} keyPrefix The prefix for the generated key.
 * @param {string?} excludeChars A string containing characters to ignore.
 * @returns {[(text: string) => string | null, string]} A tuple containing the newly created validator function and the associated random key.
 */
function createWikitextValidator(validationLock, keyPrefix, excludeChars) {
  const lockKey = validationLock.register(keyPrefix);
  return [
    function (text) {
      const invalidChar = findWikitextSpecialChars(text, excludeChars);
      if (invalidChar) {
        validationLock.setError(lockKey, true);
        return `Caractère invalide détecté\u00a0: «\u00a0${invalidChar}\u00a0»`;
      }

      validationLock.setError(lockKey, false);
      return null;
    },
    lockKey,
  ];
}

// </nowiki>
/**
 * This module defines a function to generate wikitext from the gadget’s form data.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/wikitext.js]]
 */
export default {
  specialCharacters,
  generateWikitext,
  findWikitextSpecialChars,
  createWikitextValidator,
};
