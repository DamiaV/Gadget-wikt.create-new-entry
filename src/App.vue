<!-- <nowiki> -->
<script>
import { computed, defineComponent, inject, ref, useTemplateRef } from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxField,
  CdxIcon,
  CdxMessage,
  CdxTab,
  CdxTabs,
  CdxTextInput,
  CdxToggleSwitch,
} from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconCollapse,
  cdxIconDownload,
  cdxIconExpand,
  cdxIconSearch,
} from "@wikimedia/codex-icons";
import C from "./wiki_deps/wikt.core.cookies.js";
import L from "./languages.js";
import T from "./types.js";
import utils from "./utils.js";
import LanguageSelector from "./components/LanguageSelector.vue";
import EntryForm from "./components/EntryForm.vue";

const COOKIE_NAME = "cne_lang";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    CdxCheckbox,
    CdxTabs,
    CdxTab,
    CdxField,
    CdxTextInput,
    CdxToggleSwitch,
    CdxMessage,
    LanguageSelector,
    EntryForm,
  },

  inject: ["config"],

  props: {
    /**
     * @type {import("vue").PropType<string[]>}
     */
    existingLanguageSections: { type: Array, default: () => [] },
  },

  setup(props) {
    const languages = ref(L.loadLanguages());
    const previousLangCode = C.getCookie(COOKIE_NAME);
    let startLanguage;
    for (const lang of languages.value) {
      if (lang.code === previousLangCode) {
        startLanguage = lang;
        break;
      }
    }
    if (!startLanguage) {
      startLanguage = L.getDefaultLanguage(previousLangCode);
      if (startLanguage) languages.value.push(startLanguage);
      else startLanguage = languages.value[0];
    }
    const language = ref(startLanguage);

    const isStub = ref(false);

    const activeTab = ref("tab-1");

    const disableSubmitBtn = computed(() =>
      L.containsLanguage(props.existingLanguageSections, language.value.code)
    );

    /**
     * @type {Readonly<import("vue").ShallowRef<HTMLFormElement>>}
     */
    const form = useTemplateRef("form");

    /**
     * @type {import("./types.js").FormData}
     */
    const initialFormData = {
      language: language.value,
      stub: isStub.value,
      entries: [T.createEmptyEntry()],
      wikiLinks: {},
    };

    for (const key of Object.keys(T.wikis)) {
      initialFormData.wikiLinks[key] = {
        enabled: false,
      };
    }

    const showForm = ref(false);
    const showFormFields = ref(false);
    const formData = ref(initialFormData);

    /*
     * Language
     */

    /**
     * Update the selected language.
     * @param {import("./types.js").Language} language The selected language.
     */
    function onLanguageSelection(language) {
      if (!languages.value.some((lang) => lang.code === language.code))
        languages.value.push(language);
      const newLocal = COOKIE_NAME;
      C.setCookie(newLocal, language.code, 30);
      formData.value.language = language;
    }

    /*
     * Stub
     */

    /**
     * Update the stub article status.
     * @param {boolean} checked Whether the stub checkbox is checked.
     */
    function onStubUpdate(checked) {
      isStub.value = checked;
      formData.value.stub = checked;
    }

    /**
     * Check whether the current `formData` is invalid.
     * @returns {boolean} True if it is invalid, false if it is valid.
     */
    function isFormInvalid() {
      /**
       * Check whether the given entry is invalid.
       * @param {import("./types.js").Entry} entry The entry to check.
       * @returns {boolean} True if the entry is invalid, false if it is valid.
       */
      const isEntryInvalid = (entry) => {
        const wordType = entry.wordType;
        if (!wordType) return true;

        const grammarItem = language.value.getGrammarItem(wordType);
        if (!grammarItem) return true;

        const selectedProps = entry.wordProperties;
        const expectedPropsCount = Object.entries(
          language.value.getGrammarItem(wordType).properties
        ).length;

        return (
          // Not enough properties
          selectedProps.length < expectedPropsCount ||
          // Undefined properties
          selectedProps.some((p) => !p)
        );
      };

      return (
        !form.value.checkValidity() ||
        formData.value.entries.some(isEntryInvalid)
      );
    }

    /*
     * Entries
     */

    /**
     * Add a new empty entry at the end of the array.
     */
    function onAddEntry() {
      const id = utils.getNextId(formData.value.entries);
      formData.value.entries.push(T.createEmptyEntry(id));
      activeTab.value = `tab-${id}`;
    }

    /**
     * Delete the entry at the given index.
     * @param {number} entryIndex The index of the entry to delete.
     */
    function onDeleteEntry(entryIndex) {
      const entriesNb = formData.value.entries.length;
      if (entryIndex < 0 || entryIndex >= entriesNb) return;

      const nearestEntry =
        entryIndex === entriesNb - 1
          ? formData.value.entries[entriesNb - 2]
          : formData.value.entries[entryIndex + 1];
      formData.value.entries.splice(entryIndex, 1);
      activeTab.value = `tab-${nearestEntry.id}`;
    }

    /**
     * Update an entry.
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      formData.value.entries[event.index] = event.entry;
    }

    /**
     * Move the given entry one position to the left.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryLeft(entryIndex) {
      if (entryIndex === 0) return;
      const entry = formData.value.entries.splice(entryIndex, 1)[0];
      formData.value.entries.splice(entryIndex - 1, 0, entry);
    }

    /**
     * Move the given entry one position to the right.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryRight(entryIndex) {
      if (entryIndex === formData.value.entries.length - 1) return;
      const entry = formData.value.entries.splice(entryIndex, 1)[0];
      formData.value.entries.splice(entryIndex + 1, 0, entry);
    }

    /*
     * Wiki links
     */

    /**
     * Update the wiki link with the given ID.
     * @param {string} wikiId The ID of the wiki link to update.
     * @param {string} propertyName The name of the property to update.
     * @param {string} text The value to assign to the property.
     */
    function onWikiLinkUpdate(wikiId, propertyName, text) {
      formData.value.wikiLinks[wikiId][propertyName] = text.trim();
    }

    /**
     * Enable/disable the wiki link with the given ID.
     * @param {string} wikiId The ID of the wiki link to update.
     * @param {string} enabled Whether to enable the link.
     */
    function onWikiLinkToggle(wikiId, enabled) {
      formData.value.wikiLinks[wikiId].enabled = enabled;
    }

    /*
     * Submit
     */

    function onSubmit() {
      if (isFormInvalid()) {
        console.log("cannot insert");
        return;
      }
      console.log(formData.value);
    }

    /**
     * @type {import("./types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      formData,
      language,
      languages,
      isStub,
      activeTab,
      // Visual
      showForm,
      showFormFields,
      disableSubmitBtn,
      // Other
      utils,
      config,
      wikis: T.wikis,
      // Icons
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconDownload,
      cdxIconAdd,
      cdxIconSearch,
      // Callbacks
      onLanguageSelection,
      onStubUpdate,
      onAddEntry,
      onEntryUpdate,
      onDeleteEntry,
      onMoveEntryLeft,
      onMoveEntryRight,
      onWikiLinkUpdate,
      onWikiLinkToggle,
      onSubmit,
    };
  },
});
</script>

<template>
  <div class="cne">
    <div v-if="!showForm" class="cne-start-btn">
      <cdx-button
        action="progressive"
        weight="quiet"
        type="button"
        @click="
          showForm = true;
          showFormFields = true;
        "
      >
        Ouvrir le gadget de création d’entrée
      </cdx-button>
    </div>

    <form v-else ref="form" class="cne-box" @submit.prevent="onSubmit">
      <div class="cne-form-toolbar">
        <cdx-button
          type="button"
          :title="showFormFields ? 'Enrouler' : 'Dérouler'"
          :aria-label="showFormFields ? 'Enrouler' : 'Dérouler'"
          @click="showFormFields = !showFormFields"
        >
          <cdx-icon
            :icon="showFormFields ? cdxIconCollapse : cdxIconExpand"
          ></cdx-icon>
        </cdx-button>
      </div>

      <h1>
        Création d’une section en <em>{{ language.name }}</em>
      </h1>

      <div v-show="showFormFields">
        <cdx-message type="notice">
          <p>
            Ce gadget permet de créer une section de langue complète en écrivant
            le moins de code possible.
          </p>
          <p>
            Le code sera directement inséré au bon endroit dans la zone
            d’édition. Vérifiez bien que le code généré est correct avant de
            publier votre modification.
          </p>
          <p>
            Vous pouvez créer plusieurs sections de types de mots en même temps
            en cliquant sur le bouton «&nbsp;Ajouter une entrée&nbsp;».
          </p>
        </cdx-message>
        <cdx-message type="warning">
          Assurez-vous de bien cliquer sur le bouton «&nbsp;Insérer le
          code&nbsp;» avant de publier la page, sinon les informations que vous
          avez entrées seront perdues.
        </cdx-message>

        <language-selector
          v-model="language"
          :languages="languages"
          :existing-language-sections="$props.existingLanguageSections"
          @update:model-value="onLanguageSelection"
        ></language-selector>
        <cdx-checkbox v-model="isStub" @update:model-value="onStubUpdate">
          Ébauche
          <template #description>
            Cochez cette case pour insérer un bandeau d’ébauche.
          </template>
        </cdx-checkbox>
        <cdx-button
          type="button"
          class="cne-add-entry-btn"
          action="progressive"
          @click="onAddEntry"
        >
          <cdx-icon :icon="cdxIconAdd"></cdx-icon>
          Ajouter une entrée
        </cdx-button>

        <cdx-tabs v-model:active="activeTab">
          <cdx-tab
            v-for="(entry, i) in formData.entries"
            :key="entry.id"
            :name="`tab-${entry.id}`"
            :label="
              entry.wordType && language.getGrammarItem(entry.wordType)
                ? utils.capitalize(
                    language.getGrammarItem(entry.wordType).grammaticalClass
                      .label
                  )
                : `Entrée ${entry.id}`
            "
            class="cne-main-tab"
          >
            <entry-form
              :index="i"
              :language="language"
              :model-value="entry"
              :enable-delete-btn="formData.entries.length > 1"
              :can-move-before="i > 0"
              :can-move-after="i < formData.entries.length - 1"
              @update:model-value="onEntryUpdate"
              @delete="onDeleteEntry"
              @move:before="onMoveEntryLeft"
              @move:after="onMoveEntryRight"
            ></entry-form>
          </cdx-tab>
          <cdx-tab name="etymology" label="Étymologie" class="cne-main-tab"
            >🚧 En construction 🏗️</cdx-tab
          >
          <cdx-tab name="wiki-links" label="Liens wikis" class="cne-main-tab">
            <cdx-field
              v-for="(wiki, key) in wikis"
              :key="key"
              :disabled="
                wiki.showOnlyForLangs &&
                !wiki.showOnlyForLangs.includes(language.wikimediaCode)
              "
            >
              <template #label>
                <cdx-icon
                  v-if="wiki.icon && !wiki.icon.startsWith('https://')"
                  :icon="wiki.icon"
                ></cdx-icon>
                <img
                  v-else-if="wiki.icon && wiki.icon.startsWith('https://')"
                  :src="wiki.icon"
                  :alt="wiki.label"
                  class="cne-custom-icon cdx-icon cdx-icon--medium"
                />
                {{ wiki.label }}
                <span class="cne-fieldset-btns">
                  <a
                    :href="`https://${wiki.urlDomain.replace('{}', language.wikimediaCode)}/${wiki.urlBase}/Special:Search/${encodeURIComponent(config.word)}`"
                    :title="`Rechercher sur ${wiki.label} (S’ouvre dans un nouvel onglet)`"
                    target="_blank"
                  >
                    <cdx-icon :icon="cdxIconSearch"></cdx-icon>
                  </a>
                </span>
              </template>
              <div class="cne-wiki-link-fields">
                <cdx-toggle-switch
                  :model-value="formData.wikiLinks[key].enabled"
                  :aria-label="
                    formData.wikiLinks[key].enabled ? 'Désactiver' : 'Activer'
                  "
                  :title="
                    formData.wikiLinks[key].enabled ? 'Désactiver' : 'Activer'
                  "
                  @update:model-value="onWikiLinkToggle(key, $event)"
                ></cdx-toggle-switch>
                <cdx-text-input
                  :model-value="formData.wikiLinks[key].pageTitle"
                  :disabled="!formData.wikiLinks[key].enabled"
                  :placeholder="
                    wiki.placeholder ||
                    'Titre de la page cible si différent du mot'
                  "
                  @update:model-value="
                    onWikiLinkUpdate(key, 'pageTitle', $event)
                  "
                ></cdx-text-input>
                <cdx-text-input
                  v-if="!wiki.noText"
                  :model-value="formData.wikiLinks[key].text"
                  :disabled="!formData.wikiLinks[key].enabled"
                  placeholder="Texte à afficher si différent du titre"
                  @update:model-value="onWikiLinkUpdate(key, 'text', $event)"
                ></cdx-text-input>
              </div>
            </cdx-field>
          </cdx-tab>
          <cdx-tab name="references" label="Références" class="cne-main-tab"
            >🚧 En construction 🏗️</cdx-tab
          >
          <cdx-tab name="categories" label="Catégories" class="cne-main-tab"
            >🚧 En construction 🏗️</cdx-tab
          >
        </cdx-tabs>

        <hr />
        <div class="bottom-btns">
          <cdx-button
            type="submit"
            action="progressive"
            weight="primary"
            :disabled="disableSubmitBtn"
          >
            <cdx-icon :icon="cdxIconDownload"></cdx-icon>
            Insérer le code
          </cdx-button>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.cne-box {
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 3px;
  padding: 0.5em;
}

.cne-fieldset-btns {
  display: inline-flex;
  gap: 0.5em;
}

.cne a .cdx-icon svg {
  fill: var(--color-progressive);
}

.cne h1,
.cne-start-btn {
  text-align: center;
}

.cne-form-toolbar {
  float: left;
  margin-top: 1em;
}

.cne-language-selector {
  margin-bottom: 1em;
}

.cne-add-entry-btn {
  margin: 0.5em 0;
}

.cne-main-tab {
  margin-top: 1em;
}

.cne-wiki-link-fields {
  display: flex;
  gap: 0.5em;
}
.cne-wiki-link-fields .cdx-text-input {
  flex-grow: 1;
}

.cne-custom-icon {
  filter: grayscale(100%);
}

.bottom-btns {
  display: flex;
  justify-content: center;
  margin: 0.5em 0;
}
</style>
<!-- </nowiki> -->
