<script>
// <nowiki>
import { computed, defineComponent, ref } from "vue";
import { CdxField, CdxIcon, CdxLookup, CdxSelect } from "@wikimedia/codex";
import { cdxIconLanguage, cdxIconSearch } from "@wikimedia/codex-icons";
import languages from "../wiki_deps/wikt.core.languages.js";
import langs from "../languages.js";
import types from "../types.js";

// </nowiki>
/**
 * A component to select a language from a dropdown menu.
 * It features a search bar to add languages that are missing from the menu.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/LanguageSelector.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxField,
    CdxIcon,
    CdxLookup,
    CdxSelect,
  },

  props: {
    /**
     * The list of all available languages.
     * @type {import("vue").PropType<import("../types.js").Language[]>}
     */
    languages: { type: Array, required: true },
    /**
     * An optional array containing the language codes of all sections that already exist in the page.
     * @type {import("vue").PropType<string[]>}
     */
    existingLanguageSections: { type: Array, default: () => [] },
    /**
     * The selected language.
     */
    modelValue: { type: types.Language, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    /**
     * @type {import("@wikimedia/codex").MenuItemData[]}
     */
    const languagesData = [];
    for (const [code, langData] of languages.getLanguages().entries()) {
      languagesData.push({
        label: langData.name,
        value: code,
        supportingText: `(${code})`,
      });
    }

    const languageItems = computed(() => {
      /**
       * @type {import("@wikimedia/codex").MenuItemData[]}
       */
      const items = [];
      for (const language of props.languages) {
        items.push({
          label: language.name,
          value: language.code,
          supportingText: `(${language.code})`,
          description: !language.isSupported ? "Support réduit" : "",
        });
      }
      items.sort((i1, i2) => {
        const code1 = i1.value;
        const code2 = i2.value;
        if (code1 === "fr") return -1;
        if (code2 === "fr") return 1;
        if (code1 === "conv") return 1;
        if (code2 === "conv") return -1;
        return i1.label.localeCompare(i2.label);
      });
      return items;
    });

    const langCode = ref(props.modelValue.code);

    const menuSelection = ref("");
    /**
     * @type {import("vue").Ref<import("@wikimedia/codex").MenuItemData[]>}
     */
    const menuItems = ref([]);

    /**
     * @type {import("@wikimedia/codex").MenuConfig}
     */
    const menuConfig = {
      boldLabel: true,
      visibleItemLimit: 10,
    };

    const status = computed(() =>
      langs.containsLanguage(props.existingLanguageSections, langCode.value)
        ? "error"
        : "default"
    );
    const messages = ref({
      error: "Une section dans cette langue existe déjà.",
    });

    /**
     * Called when the menu selection changes.
     * @param {string} code The selected language code.
     */
    function onLanguageSelection(code) {
      const lang = props.languages.find((lang) => lang.code === code);
      if (!code || !lang) return;
      ctx.emit("update:model-value", lang);
    }

    /**
     * Filter items on input.
     * @param {string} value
     */
    function onInput(value) {
      if (value) {
        value = value.toLocaleLowerCase();
        menuItems.value = languagesData
          .filter((item) => item.label.toLocaleLowerCase().includes(value))
          .sort((i1, i2) => {
            const name1 = i1.label.toLocaleLowerCase();
            const name2 = i2.label.toLocaleLowerCase();
            if (name1.startsWith(value) && !name2.startsWith(value)) return -1;
            if (!name1.startsWith(value) && name2.startsWith(value)) return 1;
            return name1.localeCompare(name2);
          })
          .slice(0, 10);
      }
    }

    /**
     * Called when the collapsible menu selection changes.
     * @param {string | null} code The selected code.
     */
    function onMenuSelection(code) {
      if (!code) return;
      const language = langs.getDefaultLanguage(code);
      langCode.value = language.code;
      menuSelection.value = ""; // Reset lookup selection
      ctx.emit("update:model-value", language);
    }

    return {
      // Data
      languageItems,
      langCode,
      menuSelection,
      menuItems,
      menuConfig,
      // Visual
      status,
      messages,
      // Icons
      cdxIconLanguage,
      cdxIconSearch,
      // Callbacks
      onLanguageSelection,
      onInput,
      onMenuSelection,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-language-selector cne-box" is-fieldset>
    <template #label>
      <cdx-icon :icon="cdxIconLanguage"></cdx-icon>
      Langue
    </template>
    <cdx-field :status="status" :messages="messages">
      <template #description>La langue de l’entrée.</template>
      <template #help-text>
        Si une langue n’est pas disponible dans le menu déroulant à gauche, vous
        pouvez chercher son nom dans la barre de recherche à droite. Cliquez
        ensuite sur une des suggestions pour valider votre choix.
      </template>
      <div class="language-inputs">
        <cdx-select
          v-model:selected="langCode"
          required
          :menu-items="languageItems"
          :menu-config="menuConfig"
          @update:selected="onLanguageSelection"
        ></cdx-select>
        <cdx-lookup
          v-model:selected="menuSelection"
          :menu-items="menuItems"
          :menu-config="menuConfig"
          :start-icon="cdxIconSearch"
          clearable
          placeholder="Rechercher une langue…"
          @input="onInput"
          @update:selected="onMenuSelection"
        >
          <template #no-results>Aucun résultat.</template>
        </cdx-lookup>
      </div>
    </cdx-field>
  </cdx-field>
</template>

<style>
.cne-language-selector .language-inputs {
  display: flex;
  gap: 1em;
}
/* </nowiki> */
</style>
