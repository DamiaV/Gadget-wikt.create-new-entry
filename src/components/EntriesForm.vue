<script>
import { defineComponent, ref } from "vue";
import { CdxTab, CdxTabs } from "@wikimedia/codex";
import { cdxIconAdd } from "@wikimedia/codex-icons";
import EntryForm from "./EntryForm.vue";
import T from "../types.js";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
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

    /**
     * @param {string} tabName Name of the selected tab.
     */
    function onTabSelection(tabName) {
      console.log(tabName);
      if (tabName === "add-entry") {
        entries.value.push({
          definitions: [
            {
              text: "",
              examples: [],
            },
          ],
        });
        activeTab.value = `tab-${entries.value.length - 1}`;
      } else activeTab.value = tabName;
      fireEvent();
    }

    /**
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      entries.value[event.index] = event.entry;
      fireEvent();
    }

    return {
      entries,
      activeTab,
      cdxIconAdd,
      onTabSelection,
      onEntryUpdate,
    };
  },
});
</script>

<template>
  <cdx-tabs v-model:active="activeTab" @update:active="onTabSelection">
    <cdx-tab
      v-for="(entry, i) in entries"
      :key="i"
      :name="`tab-${i}`"
      :label="`Entrée ${i + 1}`"
    >
      <entry-form
        :index="i"
        :language="$props.language"
        :model-value="entry"
        @update:model-value="onEntryUpdate"
      ></entry-form>
    </cdx-tab>
    <cdx-tab name="add-entry" label="+"></cdx-tab>
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
