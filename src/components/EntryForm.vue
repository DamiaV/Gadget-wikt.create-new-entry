<!-- <nowiki> -->
<script>
import { CdxTab, CdxTabs } from "@wikimedia/codex";
import { defineComponent, ref } from "vue";
import T from "../types.js";
import DefinitionForm from "./DefinitionForm.vue";
import InputWithToolbar from "./InputWithToolbar.vue";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    DefinitionForm,
    InputWithToolbar,
  },
  props: {
    index: { type: Number, required: true },
    language: { type: T.Language, required: true },
    /**
     * @type {import("vue").PropType<import("../types.js").FormEntry>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const definitions = ref(props.modelValue.definitions);
    const pronunciation = ref(props.modelValue.pronunciation || "");

    function fireEvent() {
      /**
       * @type {import("../types.js").FormEntryUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        entry: {
          definitions: definitions.value,
          pronunciation: pronunciation.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /**
     * Called when the definition component is updated.
     * @param {import("../types.js").DefinitionUpdateEvent} event The event.
     */
    function onDefinitionUpdate(event) {
      definitions.value[event.index] = event.definition;
      fireEvent();
    }

    /**
     * Called when the pronunciation field is updated.
     * @param {string} text The new pronunciation.
     */
    function onPronunciationUpdate(text) {
      pronunciation.value = text;
      fireEvent();
    }

    return {
      definitions,
      pronunciation,
      onDefinitionUpdate,
      onPronunciationUpdate,
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
        :model-value="definition"
        @update:model-value="onDefinitionUpdate"
      ></definition-form>

      <input-with-toolbar
        :show-format-buttons="false"
        :special-characters="$props.language.ipaSymbols"
        :model-value="pronunciation"
        @update:model-value="onPronunciationUpdate"
      >
        <template #label>Prononciation</template>
        <template #help-text>
          Si vous ne maitrisez pas l’
          <a
            class="plainlinks"
            href="/wiki/alphabet phonétique international"
            target="_blank"
            title="S’ouvre dans un nouvel onglet"
          >
            alphabet phonétique international
          </a>
          , ne remplissez pas ce champ.
        </template>
      </input-with-toolbar>
    </cdx-tab>
  </cdx-tabs>
</template>
<!-- </nowiki> -->
