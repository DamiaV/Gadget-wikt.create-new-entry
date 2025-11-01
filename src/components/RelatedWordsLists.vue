<script>
// <nowiki>
import { computed, defineComponent, inject, reactive, ref, toRaw } from "vue";
import { CdxSelect } from "@wikimedia/codex";
import {
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import strings from "../strings.js";
import RelatedWordsList from "./RelatedWordsList.vue";

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
    CdxSelect,
    RelatedWordsList,
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
      ctx.emit("update:model-value", Object.assign({}, toRaw(relatedWords)));
    }

    const selectedItem = ref("");
    const items = computed(() => {
      /**
       * @type {import("@wikimedia/codex").MenuItemData[]}
       */
      const items = [];
      for (const [code, data] of Object.entries(props.sections)) {
        if (relatedWords[code] !== undefined) continue;
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
      v-for="(relatedWordsListOrText, sectionName) in relatedWords"
      :key="sectionName"
    >
      <related-words-list
        :model-value="relatedWordsListOrText"
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
