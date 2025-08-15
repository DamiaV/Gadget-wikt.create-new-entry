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
import InputWithToolbar from "./InputWithToolbar.vue";
import T from "../types.js";
import utils from "../utils.js";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    CdxDialog,
    DefinitionForm,
    InputWithToolbar,
    WikiLink,
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

    /*
     * Definitions
     */

    /**
     * Called when the definition component is updated.
     * @param {import("../types.js").DefinitionUpdateEvent} event The event.
     */
    function onDefinitionUpdate(event) {
      definitions.value[event.index] = event.definition;
      fireEvent();
    }

    function onAddDefinition() {
      definitions.value.push({
        id: utils.getNextId(definitions.value),
        text: "",
        examples: [],
      });
      fireEvent();
    }

    const openDefinitionDeletionDialog = ref(false);
    const definitionIndexToDelete = ref(-1);

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

    /**
     * Called when the "delete" button is clicked in a definition form.
     * @param {number} definitionIndex The index of the definition to delete.
     */
    function onDeleteDefinition(definitionIndex) {
      definitionIndexToDelete.value = definitionIndex;
      const definition = definitions.value[definitionIndex];
      if (!definition.text && definition.examples.length === 0)
        deleteDefinition(); // Delete without confirmation if form is empty
      else openDefinitionDeletionDialog.value = true;
    }

    /**
     * Delete the definition at the selected index.
     */
    function deleteDefinition() {
      openDefinitionDeletionDialog.value = false;
      const index = definitionIndexToDelete.value;
      if (index < 0 || index >= definitions.value.length) return;

      definitions.value.splice(index, 1);
      fireEvent();
    }

    /**
     * Move the given definition one position upwards.
     * @param {number} definitionIndex The index of the definition to move.
     */
    function onMoveDefinitionUp(definitionIndex) {
      if (definitionIndex === 0) return;
      const definition = definitions.value.splice(definitionIndex, 1)[0];
      definitions.value.splice(definitionIndex - 1, 0, definition);
      fireEvent();
    }

    /**
     * Move the given definition one position downwards.
     * @param {number} definitionIndex The index of the definition to move.
     */
    function onMoveDefinitionDown(definitionIndex) {
      if (definitionIndex === definitions.value.length - 1) return;
      const definition = definitions.value.splice(definitionIndex, 1)[0];
      definitions.value.splice(definitionIndex + 1, 0, definition);
      fireEvent();
    }

    /*
     * Pronunciations
     */

    /**
     * Called when the pronunciation field is updated.
     * @param {string} text The new pronunciation.
     */
    function onPronunciationUpdate(text) {
      pronunciation.value = text;
      fireEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");
    const gender = config.userGender;

    return {
      definitions,
      pronunciation,
      openDefinitionDeletionDialog,
      definitionIndexToDelete,
      dialogPrimaryAction,
      dialogDefaultAction,
      gender,
      utils,
      cdxIconClose,
      cdxIconArrowPrevious,
      cdxIconArrowNext,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconAdd,
      onDefinitionUpdate,
      onAddDefinition,
      onDeleteDefinition,
      deleteDefinition,
      onMoveDefinitionUp,
      onMoveDefinitionDown,
      onPronunciationUpdate,
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
      @click="$emit('delete', $props.index)"
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

  <cdx-tabs class="cne-entry-tabs" framed>
    <cdx-tab name="definitions" label="Définitions & exemples">
      <div class="cne-definitions">
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
      </div>
      <cdx-button type="button" action="progressive" @click="onAddDefinition">
        <cdx-icon :icon="cdxIconAdd"></cdx-icon>
        Ajouter une définition
      </cdx-button>
    </cdx-tab>
    <cdx-tab name="other-sections" label="Synonymes, dérivés, etc.">
      🚧 En construction 🏗️
    </cdx-tab>
    <cdx-tab name="pronunciation" label="Prononciation">
      <input-with-toolbar
        v-model.trim="pronunciation"
        :show-format-buttons="false"
        :special-characters="$props.language.ipaSymbols"
        @update:model-value="onPronunciationUpdate"
      >
        <template #label>
          Prononciation
          <span class="cne-pronunciation-btns">
            <wiki-link page-title="Aide:Prononciation écrite">
              <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
            </wiki-link>
            <wiki-link page-title="Convention:Définitions">
              <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
            </wiki-link>
          </span>
        </template>
        <template #help-text>
          Si vous ne maitrisez pas l’<wiki-link
            page-title="alphabet phonétique international"
          ></wiki-link
          >, ne remplissez pas ce champ.
        </template>
      </input-with-toolbar>
    </cdx-tab>
  </cdx-tabs>

  <cdx-dialog
    v-model:open="openDefinitionDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteDefinition"
    @default="openDefinitionDeletionDialog = false"
  >
    Êtes-vous {{ utils.userGenderSwitch(gender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cette définition&nbsp;?
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

.cne-pronunciation-btns {
  display: inline-flex;
  gap: 0.5em;
}
</style>
<!-- </nowiki> -->
