<script>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxIcon, CdxTab, CdxTabs } from "@wikimedia/codex";
import { cdxIconAdd } from "@wikimedia/codex-icons";
import EntryForm from "./EntryForm.vue";
import T from "../types.js";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    EntryForm,
  },
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

    function fireEvent() {
      /**
       * @type {import("../types.js").FormEntriesUpdateEvent}
       */
      const firedEvent = {
        entries: entries.value,
      };
      ctx.emit("update:model-value", firedEvent);
    }

    const activeTab = ref("tab-0");

    function onAddEntry() {
      const id = Math.max(...entries.value.map((e) => e.id)) + 1;
      entries.value.push({
        id,
        definitions: [
          {
            text: "",
            examples: [],
          },
        ],
      });
      activeTab.value = `tab-${id}`;
      fireEvent();
    }

    /**
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      entries.value[event.index] = event.entry;
      fireEvent();
    }

    /**
     * @param {number} entryIndex The index of the entry to delete.
     */
    function onEntryDelete(entryIndex) {
      const nearestEntry =
        entryIndex === entries.value.length - 1
          ? entries.value[entries.value.length - 2]
          : entries.value[entryIndex + 1];
      entries.value.splice(entryIndex, 1);
      activeTab.value = `tab-${nearestEntry.id}`;
      fireEvent();
    }

    return {
      entries,
      activeTab,
      cdxIconAdd,
      onAddEntry,
      onEntryUpdate,
      onEntryDelete,
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
      :label="`Nouvelle entrée ${entry.id + 1}`"
    >
      <entry-form
        :index="i"
        :language="$props.language"
        :model-value="entry"
        :enable-delete-btn="entries.length > 1"
        @update:model-value="onEntryUpdate"
        @delete="onEntryDelete"
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
