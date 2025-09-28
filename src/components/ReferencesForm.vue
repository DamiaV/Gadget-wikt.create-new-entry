<script>
// <nowiki>
import { computed, defineComponent, inject, reactive, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxSelect,
  CdxTextInput,
  CdxToggleSwitch,
} from "@wikimedia/codex";
import {
  cdxIconEdit,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconReferences,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import L from "../wiki_deps/wikt.core.languages.js";
import T from "../types.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

// </nowiki>
/**
 * A form component to edit a References object.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/ReferencesForm.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxButton,
    CdxDialog,
    CdxField,
    CdxIcon,
    CdxSelect,
    CdxTextInput,
    CdxToggleSwitch,
    InputWithToolbar,
    WikiLink,
  },

  props: {
    /**
     * The References object to manage.
     * @type {import("vue").PropType<import("../types.js").References>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    /**
     * @type {import("vue").Reactive<import("../types.js").References>}
     */
    const data = reactive(props.modelValue);
    const otherImportsEnabled = ref(false);

    const wikis = Object.entries(T.wikis).filter(
      ([, wiki]) => !!wiki.importTemplateName
    );

    const showImports = ref(true);

    function isEmpty() {
      return (
        !data.bibliography &&
        !data.imports &&
        Object.values(data.wikiImports).length === 0
      );
    }

    function fireEvent() {
      /**
       * @type {import("../types.js").References}
       */
      const firedEvent = {
        bibliography: data.bibliography,
        imports: otherImportsEnabled.value ? data.imports : "",
        wikiImports: data.wikiImports,
        empty: isEmpty(),
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /*
     * Edit dialog
     */

    const openEditDialog = ref(false);
    const addMode = ref(false);
    const selectedWikiName = ref("");
    /**
     * @type {import("vue").Ref<import("../types.js").Wiki | null>}
     */
    const selectedWiki = ref(null);
    const selectedIndex = ref(-1);
    const editDialogData = reactive({
      langCode: "",
      title: "",
      oldId: "",
    });

    const isDialogValid = computed(() => !!editDialogData.langCode);

    /**
     * @type {import("vue").ComputedRef<import("@wikimedia/codex").PrimaryModalAction>}
     */
    const dialogPrimaryAction = computed(() => ({
      label: addMode.value ? "Ajouter" : "Appliquer",
      actionType: "progressive",
      disabled: !isDialogValid.value,
    }));
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const dialogDefaultAction = {
      label: "Annuler",
    };

    const languageItems = computed(() => {
      if (!selectedWiki.value || !selectedWiki.value.showOnlyForLangs)
        return [];

      /**
       * @type {import("@wikimedia/codex").MenuItemData[]}
       */
      const items = [];
      for (const langCode of selectedWiki.value.showOnlyForLangs) {
        const language = L.getLanguage(langCode);
        items.push({
          label: language.name,
          value: langCode,
          supportingText: `(${langCode}${language.wikimediaCode && langCode !== language.wikimediaCode ? "/" + language.wikimediaCode : ""})`,
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

    /**
     * @type {import("@wikimedia/codex").MenuConfig}
     */
    const menuConfig = {
      boldLabel: true,
      visibleItemLimit: 10,
    };

    /**
     * Open the wiki import edit dialog.
     * @param {string} wikiName The name of the target wiki.
     * @param {number?} index The index of the import to edit. Leave empty to open in adding mode.
     */
    function openImportEditDialog(wikiName, index) {
      selectedWikiName.value = wikiName;
      selectedWiki.value = T.wikis[wikiName];
      const adding = index === undefined || index === null;
      addMode.value = adding;
      selectedIndex.value = index;
      if (adding) {
        editDialogData.langCode =
          languageItems.value.length !== 0 ? languageItems.value[0].value : "";
        editDialogData.title = "";
        editDialogData.oldId = "";
      } else {
        const selectedData = data.wikiImports[wikiName][index];
        editDialogData.langCode = selectedData.langCode;
        editDialogData.title = selectedData.title;
        editDialogData.oldId = selectedData.oldId;
      }
      editDialogData.value = openEditDialog.value = true;
    }

    function onEditDialogSubmit() {
      if (addMode.value) {
        if (!data.wikiImports[selectedWikiName.value])
          data.wikiImports[selectedWikiName.value] = [];
        data.wikiImports[selectedWikiName.value].push(
          Object.assign(
            {
              langName: L.getLanguageName(editDialogData.langCode, true),
            },
            editDialogData
          )
        );
      } else {
        const selectedData =
          data.wikiImports[selectedWikiName.value][selectedIndex.value];
        selectedData.langCode = editDialogData.langCode;
        selectedData.langName = L.getLanguageName(
          editDialogData.langCode,
          true
        );
        selectedData.title = editDialogData.title;
        selectedData.oldId = editDialogData.oldId;
      }
      fireEvent();
    }

    /**
     * Add an import to the given wiki.
     * @param {string} wikiName The name of the wiki.
     */
    function onAddWikiImport(wikiName) {
      openImportEditDialog(wikiName);
    }

    /**
     * Edit an import for the given wiki.
     * @param {string} wikiName The name of the wiki.
     * @param {number} index The index of the import to edit.
     */
    function onEditWikiImport(wikiName, index) {
      openImportEditDialog(wikiName, index);
    }

    /**
     * Delete the given import for a wiki.
     * @param {string} wikiName The name of the wiki.
     * @param {number} index The index of the import to delete for the wiki.
     */
    function onDeleteWikiImport(wikiName, index) {
      data.wikiImports[wikiName].splice(index, 1);
      fireEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      data,
      otherImportsEnabled,
      // Visual
      showImports,
      // Edit dialog
      dialogPrimaryAction,
      dialogDefaultAction,
      openEditDialog,
      addMode,
      editDialogData,
      selectedWiki,
      selectedWikiName,
      languageItems,
      menuConfig,
      // Other
      wikis,
      config,
      // Icons
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconEdit,
      cdxIconTrash,
      cdxIconReferences,
      // Callbacks
      fireEvent,
      onAddWikiImport,
      onEditWikiImport,
      onDeleteWikiImport,
      onEditDialogSubmit,
    };
  },
});
</script>

<template>
  <div class="cne-references">
    <cdx-field>
      <template #label>
        <cdx-icon :icon="cdxIconReferences"></cdx-icon>
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
        Liste de tous les ouvrages utilisés globalement pour la rédaction de
        l’article&nbsp;: inspiration pour les définitions, champ lexical
        associé, traductions, etc. Elle permet de réorienter les lecteur·ices
        vers les ouvrages majeurs décrivant le sujet.
      </template>
      <input-with-toolbar
        v-model="data.bibliography"
        text-area
      ></input-with-toolbar>
    </cdx-field>

    <hr class="cne-horizontal-separator" />

    <p>J’ai recopié, adapté, ou traduit des informations depuis…</p>
    <div
      v-for="[name, wiki] in wikis"
      :key="name"
      class="cne-refs-wiki-imports"
    >
      <cdx-button
        type="button"
        action="progressive"
        @click="onAddWikiImport(name)"
      >
        … {{ (name === "wiktionary" ? "un autre " : "") + wiki.label }}
        <cdx-icon :icon="wiki.icon"></cdx-icon>
      </cdx-button>

      <ul class="cne-refs-wiki-imports-list">
        <li
          v-for="({ langCode, langName, title, oldId }, i) in data.wikiImports[
            name
          ]"
          :key="i"
        >
          <cdx-button
            type="button"
            size="small"
            action="destructive"
            aria-label="Supprimer"
            title="Supprimer"
            @click="onDeleteWikiImport(name, i)"
          >
            <cdx-icon :icon="cdxIconTrash"></cdx-icon>
          </cdx-button>
          <cdx-button
            type="button"
            size="small"
            aria-label="Modifier"
            title="Modifier"
            @click="onEditWikiImport(name, i)"
          >
            <cdx-icon :icon="cdxIconEdit"></cdx-icon>
          </cdx-button>
          <span>
            <wiki-link
              :wiki="wiki"
              :wiki-language="langCode"
              :page-title="title || config.word"
              :url-params="oldId ? { oldid: oldId } : null"
            >
              {{ title || config.word }}
            </wiki-link>
            sur {{ name === "wiktionary" ? "le" : "" }} {{ wiki.label }} en
            {{ langName }}
          </span>
        </li>
      </ul>
    </div>

    <cdx-field>
      <cdx-toggle-switch
        v-model="otherImportsEnabled"
        @update:model-value="fireEvent"
      >
        J’ai recopié, adapté, ou traduit des informations d’un ouvrage, ou site
        web libre de droits
      </cdx-toggle-switch>
    </cdx-field>
    <cdx-field v-show="otherImportsEnabled">
      <template #description>
        Listez les ouvrages dans le champ ci-dessous (un par ligne, chacun
        précédé d’une astérisque «&nbsp;*&nbsp;»).
      </template>
      <input-with-toolbar v-model="data.imports" text-area></input-with-toolbar>
      <template #help-text>
        <strong>
          Rappel&nbsp;: Il est formellement interdit de recopier du texte de
          documents non libres de droits.
        </strong>
        Si aucune licence n’est indiquée dans le document ou le site web, ou que
        vous avez un doute, considérez qu’il n’est pas libre et ne recopiez pas
        son contenu.
      </template>
    </cdx-field>

    <cdx-dialog
      v-model:open="openEditDialog"
      :title="`${addMode ? 'Ajout' : 'Modification'} d’un import depuis${selectedWikiName === 'wiktionary' ? ' un autre' : ''} ${selectedWiki ? selectedWiki.label : '-'}`"
      subtitle="Indiquez la page depuis laquelle vous avez copié des informations."
      use-close-button
      :primary-action="dialogPrimaryAction"
      :default-action="dialogDefaultAction"
      @primary="
        openEditDialog = false;
        onEditDialogSubmit();
      "
      @default="openEditDialog = false"
    >
      <cdx-field>
        <template #label>Langue du wiki</template>
        <cdx-select
          v-model:selected="editDialogData.langCode"
          required
          :menu-items="languageItems"
          :menu-config="menuConfig"
        ></cdx-select>
      </cdx-field>

      <cdx-field>
        <template #label>Titre de la page</template>
        <cdx-text-input
          v-model.trim="editDialogData.title"
          clearable
        ></cdx-text-input>
        <template #help-text>
          Laissez vide si le titre de la page sur {{ selectedWiki.label }} est
          exactement le même.
        </template>
      </cdx-field>

      <cdx-field>
        <template #label>Numéro de version de la page</template>
        <cdx-text-input
          v-model.trim="editDialogData.oldId"
          clearable
        ></cdx-text-input>
        <template #help-text>
          Pour le trouver, allez dans l’<wiki-link
            v-if="editDialogData.langCode"
            :wiki="selectedWiki"
            :wiki-language="editDialogData.langCode"
            :page-title="editDialogData.title || config.word"
            :url-params="{ action: 'history' }"
            >historique de la page</wiki-link
          ><template v-else>historique de la page</template>, puis cliquez sur
          la version pertinente de la page, et enfin récupérez le numéro dans
          l’adresse de la page après le texte « &oldid= ».
        </template>
      </cdx-field>
    </cdx-dialog>
  </div>
</template>

<style>
.cne-refs-wiki-imports {
  margin-bottom: 1em;
}

.cne-refs-wiki-imports-list {
  list-style-type: none;
  padding-left: 1em;
}

.cne-refs-wiki-imports-list > li {
  display: flex;
  gap: 0.5em;
  align-items: center;
  margin-bottom: 0.2em;
}
/* </nowiki> */
</style>
