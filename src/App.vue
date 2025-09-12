<!-- <nowiki> -->
<script>
import {
  computed,
  defineComponent,
  inject,
  reactive,
  ref,
  useTemplateRef,
} from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxField,
  CdxIcon,
  CdxMessage,
  CdxTab,
  CdxTabs,
} from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconCollapse,
  cdxIconDownload,
  cdxIconExpand,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconSearch,
} from "@wikimedia/codex-icons";
import C from "./wiki_deps/wikt.core.cookies.js";
import L from "./languages.js";
import T from "./types.js";
import utils from "./utils.js";
import LanguageSelector from "./components/LanguageSelector.vue";
import EntryForm from "./components/EntryForm.vue";
import InputWithToolbar from "./components/InputWithToolbar.vue";
import WikiLink from "./components/WikiLink.vue";
import CategoriesSelector from "./components/CategoriesSelector.vue";
import ExternalWikiLinks from "./components/ExternalWikiLinks.vue";

const COOKIE_NAME = "cne_lang";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    CdxCheckbox,
    CdxTabs,
    CdxTab,
    CdxField,
    CdxMessage,
    LanguageSelector,
    EntryForm,
    InputWithToolbar,
    WikiLink,
    CategoriesSelector,
    ExternalWikiLinks,
  },

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

    const activeTab = ref("tab-1");

    const disableSubmitBtn = computed(() =>
      L.containsLanguage(props.existingLanguageSections, formData.language.code)
    );

    /**
     * @type {Readonly<import("vue").ShallowRef<HTMLFormElement>>}
     */
    const form = useTemplateRef("form");

    /**
     * @type {import("./types.js").FormData}
     */
    const initialFormData = {
      language: startLanguage,
      stub: false,
      entries: [T.createEmptyEntry()],
      etymology: "",
      wikiLinks: {},
      categories: [],
      references: {
        imports: "",
        bibliography: "",
      },
    };

    for (const key of Object.keys(T.wikis)) {
      initialFormData.wikiLinks[key] = {
        enabled: false,
      };
    }

    const showForm = ref(false);
    const showFormFields = ref(false);
    const formData = reactive(initialFormData);

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

        const grammarItem = formData.language.getGrammarItem(wordType);
        if (!grammarItem) return true;

        const selectedProps = entry.wordProperties;
        const expectedPropsCount = Object.entries(
          formData.language.getGrammarItem(wordType).properties
        ).length;

        return (
          // Not enough properties
          selectedProps.length < expectedPropsCount ||
          // Undefined properties
          selectedProps.some((p) => !p)
        );
      };

      return (
        !form.value.checkValidity() || formData.entries.some(isEntryInvalid)
      );
    }

    /*
     * Entries
     */

    /**
     * Add a new empty entry at the end of the array.
     */
    function onAddEntry() {
      const id = utils.getNextId(formData.entries);
      formData.entries.push(T.createEmptyEntry(id));
      activeTab.value = `tab-${id}`;
    }

    /**
     * Delete the entry at the given index.
     * @param {number} entryIndex The index of the entry to delete.
     */
    function onDeleteEntry(entryIndex) {
      const entriesNb = formData.entries.length;
      if (entryIndex < 0 || entryIndex >= entriesNb) return;

      const nearestEntry =
        entryIndex === entriesNb - 1
          ? formData.entries[entriesNb - 2]
          : formData.entries[entryIndex + 1];
      formData.entries.splice(entryIndex, 1);
      activeTab.value = `tab-${nearestEntry.id}`;
    }

    /**
     * Update an entry.
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      formData.entries[event.index] = event.entry;
    }

    /**
     * Move the given entry one position to the left.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryLeft(entryIndex) {
      if (entryIndex === 0) return;
      const entry = formData.entries.splice(entryIndex, 1)[0];
      formData.entries.splice(entryIndex - 1, 0, entry);
    }

    /**
     * Move the given entry one position to the right.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryRight(entryIndex) {
      if (entryIndex === formData.entries.length - 1) return;
      const entry = formData.entries.splice(entryIndex, 1)[0];
      formData.entries.splice(entryIndex + 1, 0, entry);
    }

    /*
     * Submit
     */

    function onSubmit() {
      if (isFormInvalid()) {
        console.log("cannot insert");
        return;
      }
      console.log(formData);
    }

    /**
     * @type {import("./types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      formData,
      languages,
      activeTab,
      // Visual
      showForm,
      showFormFields,
      disableSubmitBtn,
      // Other
      utils,
      config,
      // Icons
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconDownload,
      cdxIconAdd,
      cdxIconSearch,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      // Callbacks
      onLanguageSelection,
      onAddEntry,
      onEntryUpdate,
      onDeleteEntry,
      onMoveEntryLeft,
      onMoveEntryRight,
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
        Création d’une section en <em>{{ formData.language.name }}</em>
      </h1>

      <div v-show="showFormFields">
        <cdx-message type="notice">
          <p>
            Ce gadget permet de créer une section de langue complète en écrivant
            le moins de code possible.
          </p>
          <p>
            Le code sera directement inséré au bon endroit dans la zone
            d’édition.
            <strong>
              Vérifiez bien que le code généré est correct avant de publier
              votre modification.
            </strong>
          </p>
          <p>
            Vous pouvez créer plusieurs sections de types de mots en même temps
            en cliquant sur le bouton «&nbsp;Ajouter une entrée&nbsp;».
          </p>
        </cdx-message>
        <cdx-message type="warning">
          <strong>
          Assurez-vous de bien cliquer sur le bouton «&nbsp;Insérer le
            code&nbsp;» avant de publier la page, sinon les informations que
            vous avez entrées seront perdues.
          </strong>
        </cdx-message>

        <language-selector
          v-model="formData.language"
          :languages="languages"
          :existing-language-sections="$props.existingLanguageSections"
          @update:model-value="onLanguageSelection"
        ></language-selector>

        <cdx-checkbox v-model="formData.stub">
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
              entry.wordType && formData.language.getGrammarItem(entry.wordType)
                ? utils.capitalize(
                    formData.language.getGrammarItem(entry.wordType)
                      .grammaticalClass.label
                  )
                : `Entrée ${entry.id}`
            "
            class="cne-main-tab"
          >
            <entry-form
              :index="i"
              :language="formData.language"
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

          <cdx-tab name="etymology" label="Étymologie" class="cne-main-tab">
            <cdx-field class="cne-box" is-fieldset>
              <template #label>
                <span class="cne-fieldset-btns">
                  <wiki-link page-title="Aide:Étymologies">
                    <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
                  </wiki-link>

                  <wiki-link page-title="Convention:Étymologie">
                    <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
                  </wiki-link>
                </span>
              </template>
              <input-with-toolbar
                v-model="formData.etymology"
                text-area
              ></input-with-toolbar>
            </cdx-field>
          </cdx-tab>

          <cdx-tab name="wiki-links" label="Liens wikis" class="cne-main-tab">
            <external-wiki-links
              v-model="formData.wikiLinks"
              :language="formData.language"
            ></external-wiki-links>
          </cdx-tab>

          <cdx-tab
            name="references"
            label="Références & bibliographie"
            class="cne-main-tab"
          >
            <p>
              Les références présentes ailleurs dans le formulaire seront
              automatiquement insérées. Sont concernées les balises
              <code>&lt;ref>&lt;/ref></code> ainsi que le modèle
              <wiki-link page-title="Modèle:R">R</wiki-link>.
            </p>
            <cdx-field>
              <template #label>
                Imports
                <span class="cne-fieldset-btns">
                  <wiki-link page-title="Aide:Références">
                    <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
                  </wiki-link>
                  <wiki-link page-title="Convention:Références">
                    <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
                  </wiki-link>
                </span>
              </template>
              <template #description>
                Si des informations ont été importées d’autres dictionnaires
                libres de droits ou copiées d’autres wikis, indiquez-le ici.
              </template>
              <input-with-toolbar
                v-model="formData.references.imports"
                text-area
              ></input-with-toolbar>
            </cdx-field>

            <cdx-field>
              <template #label>
                Bibliographie
                <span class="cne-fieldset-btns">
                  <wiki-link page-title="Aide:Références">
                    <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
                  </wiki-link>
                  <wiki-link page-title="Convention:Références">
                    <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
                  </wiki-link>
                </span>
              </template>
              <template #description>
                Liste de tous les ouvrages utilisés globalement pour la
                rédaction de l’article&nbsp;: inspiration pour les définitions,
                champ lexical associé, traduction, etc. Elle permet de
                réorienter le lecteur vers les ouvrages majeurs décrivant le
                sujet.
              </template>
              <input-with-toolbar
                v-model="formData.references.bibliography"
                text-area
              ></input-with-toolbar>
            </cdx-field>
          </cdx-tab>

          <cdx-tab
            name="categories"
            :label="
              formData.categories.length
                ? `Catégories (${formData.categories.length})`
                : 'Catégories'
            "
            class="cne-main-tab"
          >
            <p>
              Vous pouvez ajouter ci-dessous des catégories pertinentes qui ne
              sont pas ajoutées par les modèles déjà présents.
            </p>
            <p>
              Par exemple, il est inutile d’ajouter ici les catégories du type
              «&nbsp;Noms communs en {{ formData.language.name }}&nbsp;» car
              elles seront ajoutées par le modèle
              <wiki-link page-title="Modèle:S">S</wiki-link> qui sera inséré
              automatiquement.
            </p>
            <categories-selector
              v-model="formData.categories"
            ></categories-selector>
          </cdx-tab>
        </cdx-tabs>

        <hr />
        <a
          id=":3"
          href="https://commons.wikimedia.org/wiki/File:Barba_trans.png"
          target="_blank"
          title=":3"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Barba_trans.png/20px-Barba_trans.png"
          />
        </a>
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

a .cdx-icon svg {
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

#\:3 {
  float: right;
}
#\:3 img {
  width: 10px;
  height: 10px;
}
#\:3:hover {
  text-decoration: none;
  filter: none;
}
</style>
<!-- </nowiki> -->
