<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxIcon } from "@wikimedia/codex";
import { cdxIconHelpNotice, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxIcon,
    InputWithToolbar,
    WikiLink,
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
      cdxIconHelpNotice,
      cdxIconInfoFilled,
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
    <template #label>
      Définition {{ index + 1 }}
      <wiki-link class="help-icon" page-title="Aide:Définitions">
        <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
      </wiki-link>
      <wiki-link class="help-icon" page-title="Convention:Définitions">
        <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
      </wiki-link>
    </template>
    <template #description>
      Une courte définition, pas plus d’une ou deux phrases si possible
    </template>
    <template #help-text>
      Pour des raisons de
      <wiki-link
        page-title="Aide:Définitions"
        anchor="Astuces_pour_rédiger_une_définition"
        >droit d’auteur</wiki-link
      >, la définition ne doit pas être recopiée depuis un autre dictionnaire.
    </template>
  </input-with-toolbar>
</template>
<!-- </nowiki> -->
