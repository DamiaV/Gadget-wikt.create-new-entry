<script>
// <nowiki>
import { computed, defineComponent, inject, reactive, ref } from "vue";
import { CdxButton, CdxField, CdxIcon, CdxSelect } from "@wikimedia/codex";
import {
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import strings from "../strings.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import RelatedWordsList from "./RelatedWordsList.vue";
import WikiLink from "./WikiLink.vue";

// </nowiki>
/**
 * A wrapper component to edit multiple arrays of RelatedWord objects.
 * It features a dropdown menu to select the type of relation to add.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/RelatedWordsLists.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxButton,
    CdxField,
    CdxIcon,
    CdxSelect,
    InputWithToolbar,
    RelatedWordsList,
    WikiLink,
  },

  props: {
    /**
     * The data for all selectable sections.
     * @type {import("vue").PropType<Record<string, import("../types.js").SectionData>>}
     */
    sections: { type: Object, required: true },
    /**
     * The arrays of RelatedWord objects to manage.
     * @type {import("vue").PropType<Record<string, import("../types.js").RelatedWord[] | string>>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    /**
     * @type {import("vue").Reactive<Record<string, import("../types.js").RelatedWord[] | string>>}
     */
    const relatedWords = reactive(props.modelValue);

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");
    /**
     * @type {import("../types.js").UserPreferences}
     */
    const userPrefs = inject("userPrefs");

    function fireUpdateEvent() {
      ctx.emit("update:model-value", Object.assign({}, relatedWords));
    }

    const selectedItem = ref("");
    const items = computed(() => {
      /**
       * @type {import("@wikimedia/codex").MenuItemData[]}
       */
      const items = [];
      for (const [code, data] of Object.entries(props.sections)) {
        if (relatedWords[code]) continue;
        items.push({
          label: data.name,
          value: code,
        });
      }
      return items;
    });

    /**
     * Update the list of related words for the given relation type.
     * @param {string} relationType The type of the update relation.
     * @param {import("../types.js").RelatedWord[] | string} newRelatedWords The new list of related words for that section.
     */
    function onRelatedWordsUpdate(relationType, newRelatedWords) {
      relatedWords[relationType] = newRelatedWords;
      fireUpdateEvent();
    }

    /**
     * Delete the given related words for the given relation type.
     * @param {string} relationType The type of relation to delete.
     */
    function onDeleteRelatedWords(relationType) {
      delete relatedWords[relationType];
      fireUpdateEvent();
    }

    /**
     * Add a new section of the given type.
     * @param {string} selectedSection The selected section type.
     */
    function onSelection(selectedSection) {
      if (!selectedSection) return;
      if (props.sections[selectedSection].isText)
        relatedWords[selectedSection] = "";
      else relatedWords[selectedSection] = [];
      fireUpdateEvent();
    }

    let anySection = false;
    for (const [code, data] of Object.entries(props.sections)) {
      const sectionStatusObject = userPrefs.favoritedSections[code];
      if (sectionStatusObject) {
        if (sectionStatusObject.status) {
          if (data.isText) relatedWords[code] = "";
          else relatedWords[code] = [];
          anySection = true;
        }
      }
    }
    if (anySection) fireUpdateEvent();

    return {
      // Data
      relatedWords,
      items,
      selectedItem,
      // Other
      config,
      // Icons
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconTrash,
      // Callbacks
      onRelatedWordsUpdate,
      onDeleteRelatedWords,
      onSelection,
      capitalize: strings.capitalize,
    };
  },
});
</script>

<template>
  <div class="cne-related-words-lists">
    <cdx-select
      v-model:selected="selectedItem"
      :menu-items="items"
      default-label="— Sélectionnez une section à ajouter —"
      class="cne-section-selector"
      @update:selected="onSelection"
    ></cdx-select>

    <template
      v-for="(relatedWordsList, sectionName) in relatedWords"
      :key="sectionName"
    >
      <cdx-field
        v-if="$props.sections[sectionName].isText"
        is-fieldset
        class="cne-box cne-related-words-list"
        style="margin-top: 0"
      >
        <template #label>
          {{ capitalize($props.sections[sectionName].name) }}
          <span class="cne-fieldset-btns">
            <wiki-link
              v-if="$props.sections[sectionName].helpPage"
              :page-title="$props.sections[sectionName].helpPage"
            >
              <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
            </wiki-link>

            <wiki-link
              v-if="$props.sections[sectionName].conventionPage"
              :page-title="$props.sections[sectionName].conventionPage"
            >
              <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
            </wiki-link>

            <cdx-button
              v-if="!$props.disableDelete"
              type="button"
              size="small"
              action="destructive"
              aria-label="Supprimer"
              title="Supprimer"
              @click="onDeleteRelatedWords(sectionName)"
            >
              <cdx-icon :icon="cdxIconTrash"></cdx-icon>
            </cdx-button>
          </span>
        </template>

        <template #help-text>{{
          $props.sections[sectionName].title
            ? $props.sections[sectionName].title.replace("{mot}", config.word) +
              "."
            : ""
        }}</template>

        <input-with-toolbar
          :model-value="relatedWordsList"
          text-area
          @update:model-value="onRelatedWordsUpdate(sectionName, $event)"
          @delete="onDeleteRelatedWords"
        >
        </input-with-toolbar>
      </cdx-field>

      <related-words-list
        v-else
        :model-value="relatedWordsList"
        :section-data="$props.sections[sectionName]"
        :section-type="sectionName"
        :description="
          $props.sections[sectionName].title
            ? $props.sections[sectionName].title.replace('{mot}', config.word) +
              '.'
            : ''
        "
        @update:model-value="onRelatedWordsUpdate(sectionName, $event)"
        @delete="onDeleteRelatedWords"
      ></related-words-list>
    </template>
  </div>
</template>

<style>
.cne-section-selector {
  margin-bottom: 1em;
}
/* </nowiki> */
</style>
