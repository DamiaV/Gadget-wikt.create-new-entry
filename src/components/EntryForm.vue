<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxIcon,
  CdxTab,
  CdxTabs,
} from "@wikimedia/codex";
import {
  cdxIconClose,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconAdd,
  cdxIconArrowPrevious,
  cdxIconArrowNext,
} from "@wikimedia/codex-icons";
import DefinitionForm from "./DefinitionForm.vue";
import T from "../types.js";
import utils from "../utils.js";
import WordPropertiesSelector from "./WordPropertiesSelector.vue";
import PronunciationForm from "./PronunciationForm.vue";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    CdxDialog,
    WordPropertiesSelector,
    DefinitionForm,
    PronunciationForm,
  },

  props: {
    index: { type: Number, required: true },
    language: { type: T.Language, required: true },
    enableDeleteBtn: { type: Boolean, default: false },
    canMoveBefore: { type: Boolean, default: true },
    canMoveAfter: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<import("../types.js").Entry>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value", "delete", "move:before", "move:after"],

  setup(props, ctx) {
    /**
     * @type {import("vue").Ref<import("./WordPropertiesSelector.vue").WordProperties>}
     */
    const wordTypeProperties = ref({
      wordType: props.modelValue.wordType,
      properties: props.modelValue.wordProperties,
    });
    const definitions = ref(props.modelValue.definitions);
    const pronunciations = ref(props.modelValue.pronunciations || []);

    function isEmpty() {
      return (
        definitions.value.every((def) => def.empty) &&
        pronunciations.value.every((p) => p.empty)
      );
    }

    function fireUpdateEvent() {
      /**
       * @type {import("../types.js").FormEntryUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        entry: {
          id: props.modelValue.id,
          wordType: wordTypeProperties.value.wordType,
          wordProperties: wordTypeProperties.value.properties,
          definitions: definitions.value,
          pronunciations: pronunciations.value,
          empty: isEmpty(),
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /**
     * Deletion dialog
     */

    const openDeletionDialog = ref(false);

    /**
     * @type {import("@wikimedia/codex").PrimaryModalAction}
     */
    const dialogPrimaryAction = {
      label: "Supprimer",
      actionType: "destructive",
    };
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const dialogDefaultAction = {
      label: "Annuler",
    };

    function onDelete() {
      if (isEmpty()) deleteEntry();
      else openDeletionDialog.value = true;
    }

    function deleteEntry() {
      openDeletionDialog.value = false;
      ctx.emit("delete", props.index);
    }

    /*
     * Word type properties
     */

    /**
     * Update the word type properties.
     * @param {import("./WordPropertiesSelector.vue").WordProperties} newWordTypeProperties The new word type properties.
     */
    function onWordTypePropertiesUpdate(newWordTypeProperties) {
      wordTypeProperties.value = newWordTypeProperties;
      fireUpdateEvent();
    }

    /*
     * Definitions
     */

    /**
     * Add a new empty definition at the end of the array.
     */
    function onAddDefinition() {
      definitions.value.push({
        id: utils.getNextId(definitions.value),
        text: "",
        examples: [],
        empty: true,
      });
      fireUpdateEvent();
    }

    /**
     * Delete the definition at the given index.
     * @param {number} definitionIndex The index of the definition to delete.
     */
    function onDeleteDefinition(definitionIndex) {
      if (definitionIndex < 0 || definitionIndex >= definitions.value.length)
        return;
      definitions.value.splice(definitionIndex, 1);
      fireUpdateEvent();
    }

    /**
     * Update a definition.
     * @param {import("../types.js").DefinitionUpdateEvent} event The event.
     */
    function onDefinitionUpdate(event) {
      definitions.value[event.index] = event.definition;
      fireUpdateEvent();
    }

    /**
     * Move the given definition one position upwards.
     * @param {number} definitionIndex The index of the definition to move.
     */
    function onMoveDefinitionUp(definitionIndex) {
      if (definitionIndex === 0) return;
      const definition = definitions.value.splice(definitionIndex, 1)[0];
      definitions.value.splice(definitionIndex - 1, 0, definition);
      fireUpdateEvent();
    }

    /**
     * Move the given definition one position downwards.
     * @param {number} definitionIndex The index of the definition to move.
     */
    function onMoveDefinitionDown(definitionIndex) {
      if (definitionIndex === definitions.value.length - 1) return;
      const definition = definitions.value.splice(definitionIndex, 1)[0];
      definitions.value.splice(definitionIndex + 1, 0, definition);
      fireUpdateEvent();
    }

    /*
     * Pronunciations
     */

    /**
     * Add a new empty pronunciation at the end of the array.
     */
    function onAddPronunciation() {
      pronunciations.value.push({
        id: utils.getNextId(pronunciations.value),
        pronunciation: "",
        empty: true,
      });
      fireUpdateEvent();
    }

    /**
     * Delete the pronunciation at the given index.
     * @param {number} pronunciationIndex The index of the pronunciation to delete.
     */
    function onDeletePronunciation(pronunciationIndex) {
      if (
        pronunciationIndex < 0 ||
        pronunciationIndex >= pronunciations.value.length
      )
        return;
      pronunciations.value.splice(pronunciationIndex, 1);
      fireUpdateEvent();
    }

    /**
     * Update a pronunciation.
     * @param {import("../types.js").PronunciationUpdateEvent} event The event.
     */
    function onPronunciationUpdate(event) {
      pronunciations.value[event.index] = event.pronunciation;
      fireUpdateEvent();
    }

    /**
     * Move the given pronunciation one position upwards.
     * @param {number} pronunciationIndex The index of the pronunciation to move.
     */
    function onMovePronunciationUp(pronunciationIndex) {
      if (pronunciationIndex === 0) return;
      const pronunciation = pronunciations.value.splice(
        pronunciationIndex,
        1
      )[0];
      pronunciations.value.splice(pronunciationIndex - 1, 0, pronunciation);
      fireUpdateEvent();
    }

    /**
     * Move the given pronunciation one position downwards.
     * @param {number} pronunciationIndex The index of the pronunciation to move.
     */
    function onMovePronunciationDown(pronunciationIndex) {
      if (pronunciationIndex === pronunciations.value.length - 1) return;
      const pronunciation = pronunciations.value.splice(
        pronunciationIndex,
        1
      )[0];
      pronunciations.value.splice(pronunciationIndex + 1, 0, pronunciation);
      fireUpdateEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      wordTypeProperties,
      definitions,
      pronunciations,
      // Deletion dialog
      dialogPrimaryAction,
      dialogDefaultAction,
      openDeletionDialog,
      // Other
      utils,
      config,
      // Icons
      cdxIconClose,
      cdxIconArrowPrevious,
      cdxIconArrowNext,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconAdd,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deleteEntry,
      onWordTypePropertiesUpdate,
      onDefinitionUpdate,
      onAddDefinition,
      onDeleteDefinition,
      onMoveDefinitionUp,
      onMoveDefinitionDown,
      onPronunciationUpdate,
      onAddPronunciation,
      onDeletePronunciation,
      onMovePronunciationUp,
      onMovePronunciationDown,
    };
  },
});
</script>

<template>
  <div class="cne-entry-action-btns">
    <cdx-button
      v-show="$props.enableDeleteBtn"
      type="button"
      class="delete-entry-btn"
      action="destructive"
      :disabled="!$props.enableDeleteBtn"
      @click="onDelete"
    >
      <cdx-icon :icon="cdxIconClose"></cdx-icon>
      Supprimer l’entrée
    </cdx-button>

    <cdx-button
      v-show="$props.canMoveBefore || $props.canMoveAfter"
      type="button"
      aria-label="Déplacer à gauche"
      title="Déplacer à gauche"
      :disabled="!$props.canMoveBefore"
      @click="$emit('move:before', $props.index)"
    >
      <cdx-icon :icon="cdxIconArrowPrevious"></cdx-icon>
    </cdx-button>

    <cdx-button
      v-show="$props.canMoveBefore || $props.canMoveAfter"
      type="button"
      aria-label="Déplacer à droite"
      title="Déplacer à droite"
      :disabled="!$props.canMoveAfter"
      @click="$emit('move:after', $props.index)"
    >
      <cdx-icon :icon="cdxIconArrowNext"></cdx-icon>
    </cdx-button>
  </div>

  <word-properties-selector
    v-model="wordTypeProperties"
    :language="$props.language"
    @update:model-value="onWordTypePropertiesUpdate"
  ></word-properties-selector>

  <cdx-tabs class="cne-entry-tabs" framed>
    <cdx-tab name="definitions" label="Définitions & exemples">
      <definition-form
        v-for="(definition, i) in definitions"
        :key="definition.id"
        :index="i"
        :enable-delete-btn="definitions.length > 1"
        :can-move-before="i > 0"
        :can-move-after="i < definitions.length - 1"
        :model-value="definition"
        @update:model-value="onDefinitionUpdate"
        @delete="onDeleteDefinition"
        @move:before="onMoveDefinitionUp"
        @move:after="onMoveDefinitionDown"
      ></definition-form>
      <cdx-button type="button" action="progressive" @click="onAddDefinition">
        <cdx-icon :icon="cdxIconAdd"></cdx-icon>
        Ajouter une définition
      </cdx-button>
    </cdx-tab>

    <cdx-tab name="other-sections" label="Synonymes, dérivés, etc.">
      🚧 En construction 🏗️
    </cdx-tab>

    <cdx-tab name="pronunciation" label="Prononciation">
      <p>Les prononciations suivantes seront affichées après le mot.</p>
      <p>Les caractères suivants seront automatiquement remplacés&nbsp;:</p>
      <ul style="margin-bottom: 1em">
        <li>
          g (lettre latine G minuscule) en ɡ (consonne occlusive vélaire voisée)
        </li>
        <li>' (apostrophe droite) en ˈ (accent tonique)</li>
        <li>: (deux-points) en ː (allongement)</li>
        <li>! (point d’exclamation) en ǃ (clic post-alvéolaire)</li>
        <li>| (barre verticale) en ǀ (clic dental)</li>
      </ul>
      <pronunciation-form
        v-for="(pronunciation, i) in pronunciations"
        :key="pronunciation.id"
        :index="i"
        :language="$props.language"
        enable-delete-btn
        :can-move-before="i > 0"
        :can-move-after="i < pronunciations.length - 1"
        :model-value="pronunciation"
        @update:model-value="onPronunciationUpdate"
        @delete="onDeletePronunciation"
        @move:before="onMovePronunciationUp"
        @move:after="onMovePronunciationDown"
      ></pronunciation-form>
      <cdx-button
        type="button"
        action="progressive"
        @click="onAddPronunciation"
      >
        <cdx-icon :icon="cdxIconAdd"></cdx-icon>
        Ajouter une prononciation
      </cdx-button>
    </cdx-tab>
  </cdx-tabs>

  <cdx-dialog
    v-model:open="openDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteEntry"
    @default="openDeletionDialog = false"
  >
    Êtes-vous
    {{ utils.userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cette entrée&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-entry-action-btns {
  display: flex;
  gap: 0.5em;
  margin: 0.5em 0;
}

.cne-entry-tabs .cdx-tabs__content {
  margin-top: 1em;
}
</style>
<!-- </nowiki> -->
