<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxTab,
  CdxTabs,
} from "@wikimedia/codex";
import {
  cdxIconHelpNotice,
  cdxIconAdd,
  cdxIconArrowPrevious,
  cdxIconArrowNext,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import DefinitionForm from "./DefinitionForm.vue";
import T from "../types.js";
import utils from "../utils.js";
import WordPropertiesSelector from "./WordPropertiesSelector.vue";
import PronunciationForm from "./PronunciationForm.vue";
import RelatedWordsLists from "./RelatedWordsLists.vue";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";
import RelatedWordsList from "./RelatedWordsList.vue";

export default defineComponent({
  components: {
    CdxField,
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    CdxDialog,
    InputWithToolbar,
    WordPropertiesSelector,
    DefinitionForm,
    PronunciationForm,
    RelatedWordsList,
    RelatedWordsLists,
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
    /**
     * @type {import("vue").Ref<import("./WordPropertiesSelector.vue").WordProperties>}
     */
    const wordTypeProperties = ref({
      wordType: props.modelValue.wordType,
      properties: props.modelValue.wordProperties,
    });
    const definitions = ref(props.modelValue.definitions);
    const relatedWords = ref(props.modelValue.relatedWords);
    const pronunciations = ref(props.modelValue.pronunciations || []);
    const homophones = ref(props.modelValue.homophones);
    const nearHomophones = ref(props.modelValue.nearHomophones);
    const notes = ref(props.modelValue.notes);

    function isEmpty() {
      return (
        definitions.value.every((def) => def.empty) &&
        pronunciations.value.every((p) => p.empty) &&
        Object.values(relatedWords.value).every((relatedWords) =>
          relatedWords.every((relatedWord) => relatedWord.empty)
        ) &&
        homophones.value.every((relatedWords) =>
          relatedWords.every((relatedWord) => relatedWord.empty)
        ) &&
        nearHomophones.value.every((relatedWords) =>
          relatedWords.every((relatedWord) => relatedWord.empty)
        ) &&
        !notes.value
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
          relatedWords: relatedWords.value,
          pronunciations: pronunciations.value,
          homophones: homophones.value,
          nearHomophones: nearHomophones.value,
          notes: notes.value,
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
     * Definitions
     */

    /**
     * Add a new empty definition at the end of the array.
     */
    function onAddDefinition() {
      const id = utils.getNextId(definitions.value);
      definitions.value.push(T.createEmptyDefinition(id));
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
      const id = utils.getNextId(pronunciations.value);
      pronunciations.value.push(T.createEmptyPronunciation(id));
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
      relatedWords,
      pronunciations,
      homophones,
      nearHomophones,
      notes,
      // Deletion dialog
      dialogPrimaryAction,
      dialogDefaultAction,
      openDeletionDialog,
      // Other
      utils,
      config,
      sectionsData: T.entrySectionsData,
      otherSectionsData: T.otherSectionsData,
      // Icons
      cdxIconTrash,
      cdxIconArrowPrevious,
      cdxIconArrowNext,
      cdxIconHelpNotice,
      cdxIconAdd,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deleteEntry,
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
      <cdx-icon :icon="cdxIconTrash"></cdx-icon>
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
    @update:model-value="fireUpdateEvent"
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

    <cdx-tab name="other-sections" label="Notes, variantes, dérivés, etc.">
      <cdx-field class="cne-box" is-fieldset>
        <template #label>
          Notes
          <span class="cne-fieldset-btns">
            <wiki-link page-title="Convention:Notes">
              <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
            </wiki-link>
          </span>
        </template>
        <input-with-toolbar
          v-model="notes"
          text-area
          @update:model-value="fireUpdateEvent()"
        ></input-with-toolbar>
      </cdx-field>

      <hr class="cne-horizontal-separator" />

      <related-words-lists
        v-model="relatedWords"
        :sections="sectionsData"
        @update:model-value="fireUpdateEvent()"
      ></related-words-lists>
    </cdx-tab>

    <cdx-tab
      name="pronunciation"
      :disabled="$props.language.code === 'conv'"
      :label="
        $props.language.code !== 'conv' && pronunciations.length
          ? `Prononciation${pronunciations.length > 1 ? 's' : ''} (${pronunciations.length})`
          : 'Prononciation'
      "
    >
      <p>Les prononciations suivantes seront affichées après le mot.</p>
      <p>Les caractères suivants seront automatiquement remplacés&nbsp;:</p>
      <ul style="margin-bottom: 1em">
        <li>
          <strong>g</strong> (lettre latine G minuscule) en
          <strong>ɡ</strong> (consonne occlusive vélaire voisée)
        </li>
        <li>
          <strong>'</strong> (apostrophe droite) en <strong>ˈ</strong> (accent
          tonique)
        </li>
        <li>
          <strong>:</strong> (deux-points) en <strong>ː</strong> (allongement)
        </li>
        <li>
          <strong>!</strong> (point d’exclamation) en <strong>ǃ</strong> (clic
          post-alvéolaire)
        </li>
        <li>
          <strong>|</strong> (barre verticale) en <strong>ǀ</strong> (clic
          dental)
        </li>
        <li>
          <strong>espace insécable</strong> et
          <strong>espace insécable fine</strong> en <strong>espace</strong>
        </li>
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

      <hr class="cne-horizontal-separator" />

      <related-words-list
        v-model="homophones"
        section-type="homophones"
        :section-data="otherSectionsData['homophones']"
        disable-delete
      ></related-words-list>
      <related-words-list
        v-model="nearHomophones"
        section-type="paronymes"
        :section-data="otherSectionsData['paronymes']"
        disable-delete
      ></related-words-list>
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
  margin-bottom: 0.5em;
}

.cne-entry-tabs .cdx-tabs__content section {
  margin-top: 1em;
}
</style>
<!-- </nowiki> -->
