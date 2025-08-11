<!-- <nowiki> -->
<script>
import { CdxTab, CdxTabs } from "@wikimedia/codex";
import { defineComponent, ref } from "vue";
import DefinitionForm from "./DefinitionForm.vue";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    DefinitionForm,
  },
  props: {
    index: { type: Number, required: true },
    /**
     * @type {import("vue").PropType<import("../types.js").FormEntry>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const language = props.modelValue.language;
    const definitions = ref(props.modelValue.definitions);

    /**
     * @param {import("../types.js").DefinitionUpdateEvent} event
     */
    function onDefinitionUpdate(event) {
      const definition = definitions.value[event.index];
      definition.text = event.definition.text;
      definition.examples = event.definition.examples;
      /**
       * @type {import("../types.js").FormEntryUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        entry: {
          language: language,
          definitions: definitions.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    return {
      definitions,
      onDefinitionUpdate,
    };
  },
});
</script>

<template>
  <cdx-tabs>
    <cdx-tab name="definitions" label="Définitions">
      <definition-form
        v-for="(definition, i) in definitions"
        :key="i"
        :index="i"
        :language="$props.modelValue.language"
        :model-value="definition"
        @update:model-value="onDefinitionUpdate"
      ></definition-form>
    </cdx-tab>
  </cdx-tabs>
</template>
<!-- </nowiki> -->
