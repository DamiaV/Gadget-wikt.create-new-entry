<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxIcon, CdxTab, CdxTabs } from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import DefinitionForm from "./DefinitionForm.vue";
import InputWithToolbar from "./InputWithToolbar.vue";
import T from "../types.js";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    DefinitionForm,
    InputWithToolbar,
  },
  props: {
    index: { type: Number, required: true },
    language: { type: T.Language, required: true },
    enableDeleteBtn: { type: Boolean, require: true },
    /**
     * @type {import("vue").PropType<import("../types.js").Entry>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value", "delete"],
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
          id: props.modelValue.id,
          definitions: definitions.value,
          pronunciation: pronunciation.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    function onDeleteEntry() {
      ctx.emit("delete", props.index);
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
      cdxIconClose,
      onDeleteEntry,
      onDefinitionUpdate,
      onPronunciationUpdate,
    };
  },
});
</script>

<template>
  <cdx-button
    type="button"
    class="delete-entry-btn"
    action="destructive"
    :disabled="!$props.enableDeleteBtn"
    @click="onDeleteEntry"
  >
    <cdx-icon :icon="cdxIconClose"></cdx-icon>
    Supprimer l’entrée
  </cdx-button>
  <cdx-tabs class="cne-entry-tabs" framed>
    <cdx-tab name="definitions" label="Définitions & exemples">
      <definition-form
        v-for="(definition, i) in definitions"
        :key="i"
        :index="i"
        :model-value="definition"
        @update:model-value="onDefinitionUpdate"
      ></definition-form>
    </cdx-tab>
    <cdx-tab name="other-sections" label="Synonymes, dérivés, etc."
      >🚧 En construction 🏗️</cdx-tab
    >
    <cdx-tab name="pronunciation" label="Prononciation">
      <input-with-toolbar
        v-model.trim="pronunciation"
        :show-format-buttons="false"
        :special-characters="$props.language.ipaSymbols"
        @update:model-value="onPronunciationUpdate"
      >
        <template #label>Prononciation</template>
        <template #help-text>
          Si vous ne maitrisez pas l’<a
            class="plainlinks"
            href="/wiki/alphabet phonétique international"
            target="_blank"
            title="S’ouvre dans un nouvel onglet"
            >alphabet phonétique international</a
          >, ne remplissez pas ce champ.
        </template>
      </input-with-toolbar>
    </cdx-tab>
  </cdx-tabs>
</template>

<style>
.cne-entry-tabs .cdx-tabs__content {
  margin-top: 1em;
}

.delete-entry-btn {
  margin: 0.5em 0;
}
</style>
<!-- </nowiki> -->
