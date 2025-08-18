<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxIcon, CdxTab, CdxTabs } from "@wikimedia/codex";
import { cdxIconAdd } from "@wikimedia/codex-icons";
import T from "../types.js";
import utils from "../utils.js";
import EntryForm from "./EntryForm.vue";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    EntryForm,
  },

  inject: ["config"],

  props: {
    language: { type: T.Language, required: true },
    /**
     * @type {import("vue").PropType<import("../types.js").Entry[]>}
     */
    modelValue: { type: Array, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const entries = ref(props.modelValue);

    function fireUpdateEvent() {
      /**
       * @type {import("../types.js").FormEntriesUpdateEvent}
       */
      const firedEvent = {
        entries: entries.value,
      };
      ctx.emit("update:model-value", firedEvent);
    }

    const activeTab = ref("tab-1");

    /**
     * Add a new empty entry at the end of the array.
     */
    function onAddEntry() {
      const id = utils.getNextId(entries.value);
      entries.value.push({
        id,
        wordType: "",
        wordProperties: [],
        definitions: [
          {
            text: "",
            examples: [],
            empty: true,
          },
        ],
        pronunciations: [],
      });
      activeTab.value = `tab-${id}`;
      fireUpdateEvent();
    }

    /**
     * Delete the entry at the given index.
     * @param {number} entryIndex The index of the entry to delete.
     */
    function onDeleteEntry(entryIndex) {
      const entriesNb = entries.value.length;
      if (entryIndex < 0 || entryIndex >= entriesNb) return;

      const nearestEntry =
        entryIndex === entriesNb - 1
          ? entries.value[entriesNb - 2]
          : entries.value[entryIndex + 1];
      entries.value.splice(entryIndex, 1);
      activeTab.value = `tab-${nearestEntry.id}`;
      fireUpdateEvent();
    }

    /**
     * Update an entry.
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      entries.value[event.index] = event.entry;
      fireUpdateEvent();
    }

    /**
     * Move the given entry one position to the left.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryLeft(entryIndex) {
      if (entryIndex === 0) return;
      const entry = entries.value.splice(entryIndex, 1)[0];
      entries.value.splice(entryIndex - 1, 0, entry);
      fireUpdateEvent();
    }

    /**
     * Move the given entry one position to the right.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryRight(entryIndex) {
      if (entryIndex === entries.value.length - 1) return;
      const entry = entries.value.splice(entryIndex, 1)[0];
      entries.value.splice(entryIndex + 1, 0, entry);
      fireUpdateEvent();
    }

    return {
      // Data
      entries,
      activeTab,
      // Other
      utils,
      // Icons
      cdxIconAdd,
      // Callbacks
      onAddEntry,
      onEntryUpdate,
      onDeleteEntry,
      onMoveEntryLeft,
      onMoveEntryRight,
    };
  },
});
</script>

<template>
  <cdx-button
    type="button"
    class="add-entry-btn"
    action="progressive"
    @click="onAddEntry"
  >
    <cdx-icon :icon="cdxIconAdd"></cdx-icon>
    Ajouter une entrée
  </cdx-button>

  <cdx-tabs v-model:active="activeTab">
    <cdx-tab
      v-for="(entry, i) in entries"
      :key="entry.id"
      :name="`tab-${entry.id}`"
      :label="
        entry.wordType && $props.language.getGrammarItem(entry.wordType)
          ? utils.capitalize(
              $props.language.getGrammarItem(entry.wordType).grammaticalClass
                .label
            )
          : `Entrée ${entry.id}`
      "
    >
      <entry-form
        :index="i"
        :language="$props.language"
        :model-value="entry"
        :enable-delete-btn="entries.length > 1"
        :can-move-before="i > 0"
        :can-move-after="i < entries.length - 1"
        @update:model-value="onEntryUpdate"
        @delete="onDeleteEntry"
        @move:before="onMoveEntryLeft"
        @move:after="onMoveEntryRight"
      ></entry-form>
    </cdx-tab>
    <cdx-tab name="etymology" label="Étymologie">🚧 En construction 🏗️</cdx-tab>
    <cdx-tab name="wiki-links" label="Liens wikis"
      >🚧 En construction 🏗️</cdx-tab
    >
    <cdx-tab name="references" label="Références"
      >🚧 En construction 🏗️</cdx-tab
    >
    <cdx-tab name="categories" label="Catégories"
      >🚧 En construction 🏗️</cdx-tab
    >
  </cdx-tabs>
</template>

<style>
.add-entry-btn {
  margin: 0.5em 0;
}
</style>
<!-- </nowiki> -->
