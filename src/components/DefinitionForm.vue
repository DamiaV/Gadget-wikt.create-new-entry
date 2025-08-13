<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import InputWithToolbar from "./InputWithToolbar.vue";

export default defineComponent({
  components: {
    InputWithToolbar,
  },
  props: {
    index: { type: Number, required: true },
    /**
     * @type {import("vue").PropType<import("../types").Definition>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const definition = ref(props.modelValue.text);
    const examples = ref(props.modelValue.examples);

    function fireEvent() {
      /**
       * @type {import("../types.js").DefinitionUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        definition: {
          text: definition.value,
          examples: examples.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /**
     * Called when the definition is updated.
     * @param {string} text The new definition.
     */
    function onDefinitionUpdate(text) {
      definition.value = text;
      fireEvent();
    }

    return {
      definition,
      examples,
      onDefinitionUpdate,
    };
  },
});
</script>

<template>
  <input-with-toolbar
    v-model.trim="definition"
    required
    text-area
    @update:model-value="onDefinitionUpdate"
  >
    <template #label>Définition {{ index + 1 }}</template>
    <template #description>
      Une courte définition, pas plus d’une ou deux phrases si possible
    </template>
    <template #help-text>
      La définition ne doit pas être recopiée depuis un autre dictionnaire.
    </template>
  </input-with-toolbar>
</template>
<!-- </nowiki> -->
