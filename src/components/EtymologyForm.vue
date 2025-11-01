<script>
// <nowiki>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxField, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconArticle,
  cdxIconCollapse,
  cdxIconExpand,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconQuotes,
} from "@wikimedia/codex-icons";
import types from "../types.js";
import utils from "../utils.js";
import CollapsedPreview from "./CollapsedPreview.vue";
import ExampleForm from "./ExampleForm.vue";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

// </nowiki>
/**
 * A form component to edit an Etymology object.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/EtymologyForm.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxIcon,
    CdxButton,
    CdxField,
    CollapsedPreview,
    ExampleForm,
    InputWithToolbar,
    WikiLink,
  },

  props: {
    /**
     * The currently selected language.
     */
    language: { type: types.Language, required: true },
    /**
     * The Etymology object to manage.
     * @type {import("vue").PropType<import("../types.js").Etymology>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value", "delete", "move:before", "move:after"],

  setup(props, ctx) {
    const text = ref(props.modelValue.text);
    const examples = ref(props.modelValue.examples);

    const showExamples = ref(true);

    function isEmpty() {
      return !text.value && examples.value.every((ex) => ex.empty);
    }

    function fireUpdateEvent() {
      /**
       * @type {import("../types.js").Etymology}
       */
      const firedEvent = {
        text: text.value,
        examples: examples.value,
        empty: isEmpty(),
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /*
     * Examples
     */

    /**
     * Called when the example component is updated.
     * @param {import("../types.js").ExampleUpdateEvent} event The event.
     */
    function onExampleUpdate(event) {
      examples.value[event.index] = event.example;
      fireUpdateEvent();
    }

    /**
     * Add a new empty example at the end of the array.
     */
    function onAddExample() {
      const id = utils.getNextId(examples.value);
      examples.value.push(types.createEmptyExample(id));
      fireUpdateEvent();
    }

    /**
     * Delete the example at the given index.
     * @param {number} exampleIndex The index of the example to delete.
     */
    function onDeleteExample(exampleIndex) {
      if (exampleIndex < 0 || exampleIndex >= examples.value.length) return;
      examples.value.splice(exampleIndex, 1);
      fireUpdateEvent();
    }

    /**
     * Move the given example one position upwards.
     * @param {number} exampleIndex The index of the example to move.
     */
    function onMoveExampleUp(exampleIndex) {
      if (exampleIndex === 0) return;
      const example = examples.value.splice(exampleIndex, 1)[0];
      examples.value.splice(exampleIndex - 1, 0, example);
      fireUpdateEvent();
    }

    /**
     * Move the given example one position downwards.
     * @param {number} examplesIndex The index of the example to move.
     */
    function onMoveExampleDown(examplesIndex) {
      if (examplesIndex === examples.value.length - 1) return;
      const example = examples.value.splice(examplesIndex, 1)[0];
      examples.value.splice(examplesIndex + 1, 0, example);
      fireUpdateEvent();
    }

    return {
      // Data
      text,
      examples,
      // Visuals
      showExamples,
      // Icons
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconAdd,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconQuotes,
      cdxIconArticle,
      // Callbacks
      fireUpdateEvent,
      onExampleUpdate,
      onAddExample,
      onDeleteExample,
      onMoveExampleUp,
      onMoveExampleDown,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-etymology-form cne-box" is-fieldset>
    <template #label>
      <cdx-icon :icon="cdxIconArticle"></cdx-icon>
      Étymologie
      <span class="cne-fieldset-btns">
        <wiki-link page-title="Aide:Étymologies">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>

        <wiki-link page-title="Convention:Étymologie">
          <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
        </wiki-link>
      </span>
    </template>

    <div class="cne-etymology-form-fields">
      <input-with-toolbar v-model="text" text-area @change="fireUpdateEvent">
        <template #description>L’étymologie de chaque entrée.</template>
      </input-with-toolbar>

      <cdx-field class="cne-historical-examples cne-box" is-fieldset>
        <template #label>
          <cdx-icon :icon="cdxIconQuotes"></cdx-icon>
          Attestations historiques
          <span class="cne-fieldset-btns">
            <wiki-link page-title="Aide:Exemples">
              <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
            </wiki-link>

            <wiki-link page-title="Convention:Exemples">
              <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
            </wiki-link>

            <cdx-button
              type="button"
              size="small"
              :aria-label="showExamples ? 'Enrouler' : 'Dérouler'"
              :title="showExamples ? 'Enrouler' : 'Dérouler'"
              @click="showExamples = !showExamples"
            >
              <cdx-icon
                :icon="showExamples ? cdxIconCollapse : cdxIconExpand"
              ></cdx-icon>
            </cdx-button>
          </span>
        </template>

        <div v-show="showExamples">
          <example-form
            v-for="(example, i) in examples"
            :key="example.id"
            :index="i"
            enable-delete-btn
            :can-move-before="i > 0"
            :can-move-after="i < examples.length - 1"
            :model-value="example"
            :language="$props.language"
            @update:model-value="onExampleUpdate"
            @delete="onDeleteExample"
            @move:before="onMoveExampleUp"
            @move:after="onMoveExampleDown"
          ></example-form>
          <cdx-button
            class="cne-add-example-btn"
            type="button"
            action="progressive"
            @click="onAddExample"
          >
            <cdx-icon :icon="cdxIconAdd"></cdx-icon>
            Ajouter un exemple
          </cdx-button>
        </div>
        <collapsed-preview
          v-show="!showExamples"
          :text="
            examples.length === 0
              ? 'Aucun exemple'
              : `${examples.length} exemple${examples.length > 1 ? 's' : ''}`
          "
        ></collapsed-preview>
      </cdx-field>
    </div>
  </cdx-field>
</template>

<style>
.cne:not(.minimal-ui) .cne-etymology-form {
  margin-bottom: 4em;
}

.cne-historical-examples {
  margin-top: 2em;
  margin-bottom: 2em;
}
/* </nowiki> */
</style>
