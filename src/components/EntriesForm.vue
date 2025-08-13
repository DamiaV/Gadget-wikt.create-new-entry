<script>
import { defineComponent, ref } from "vue";
import { CdxTab, CdxTabs } from "@wikimedia/codex";
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

    /**
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      entries.value[event.index] = event.entry;
      fireEvent();
    }

    return {
      entries,
      onEntryUpdate,
    };
  },
});
</script>

<template>
  <cdx-tabs>
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
  </cdx-tabs>
</template>
