<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxField, CdxTextArea } from "@wikimedia/codex";
import EditTools from "./EditTools.vue";
import T from "../types.js";

export default defineComponent({
  components: {
    CdxField,
    CdxTextArea,
    EditTools,
  },
  props: {
    index: { type: Number, required: true },
    language: { type: T.Language, required: true },
    /**
     * @type {import("vue").PropType<import("../types").Definition>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const inputValue = ref(props.modelValue.text);
    const examples = ref(props.modelValue.examples);

    /**
     * @param {string} text
     */
    function onDefinitionUpdate(text) {
      /**
       * @type {import("../types.js").DefinitionUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        definition: {
          text: text,
          examples: examples.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    function onBold() {
      console.log("bold");
    }

    function onItalic() {
      console.log("italic");
    }

    return {
      inputValue,
      examples,
      onDefinitionUpdate,
      onBold,
      onItalic,
    };
  },
});
</script>

<template>
  <h2>Définition {{ index + 1 }}</h2>

  <cdx-field>
    <edit-tools
      :language="$props.language"
      @style:bold="onBold"
      @style:italic="onItalic"
    ></edit-tools>
    <cdx-text-area
      :model-value="inputValue"
      @update:model-value="onDefinitionUpdate"
    ></cdx-text-area>
    <template #help-text>
      La définition ne doit pas être recopiée depuis un autre dictionnaire.
    </template>
  </cdx-field>
</template>
<!-- </nowiki> -->
