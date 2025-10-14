<script>
// <nowiki>
import { computed, defineComponent, inject, ref } from "vue";
import { CdxButton, CdxDialog, CdxField, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconArrowDown,
  cdxIconArrowUp,
  cdxIconArticle,
  cdxIconCollapse,
  cdxIconExpand,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconLink,
  cdxIconQuotes,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import T from "../types.js";
import strings from "../strings.js";
import utils from "../utils.js";
import CollapsedPreview from "./CollapsedPreview.vue";
import ExampleForm from "./ExampleForm.vue";
import IllustrationForm from "./IllustrationForm.vue";
import InputWithToolbar from "./InputWithToolbar.vue";
import RelatedWordsLists from "./RelatedWordsLists.vue";
import WikiLink from "./WikiLink.vue";

// </nowiki>
/**
 * A form component to edit a Definition object.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/DefinitionForm.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxIcon,
    CdxButton,
    CdxField,
    CdxDialog,
    CollapsedPreview,
    ExampleForm,
    IllustrationForm,
    InputWithToolbar,
    RelatedWordsLists,
    WikiLink,
  },

  props: {
    /**
     * The index of this form in the parent component.
     */
    index: { type: Number, required: true },
    /**
     * Whether to enable the button to delete this form.
     * Defaults to false.
     */
    enableDeleteBtn: { type: Boolean, default: false },
    /**
     * Whether to enable the button to move this form before its preceding neighbor.
     * Defaults to true.
     */
    canMoveBefore: { type: Boolean, default: true },
    /**
     * Whether to enable the button to move this form after its following neighbor.
     * Defaults to true.
     */
    canMoveAfter: { type: Boolean, default: true },
    /**
     * The Definition object to manage.
     * @type {import("vue").PropType<import("../types").Definition>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value", "delete", "move:before", "move:after"],

  setup(props, ctx) {
    const text = ref(props.modelValue.text);
    const examples = ref(props.modelValue.examples);
    const illustration = ref(props.modelValue.illustration);
    const relatedWords = ref(props.modelValue.relatedWords);
    const relatedWordsNumber = computed(() =>
      Object.values(relatedWords.value).reduce(
        (acc, relatedWords) =>
          acc +
          relatedWords.reduce(
            (acc2, relatedWord) =>
              acc2 + ("words" in relatedWord ? relatedWord.words.length : 1),
            0
          ),
        0
      )
    );

    const showFields = ref(true);
    const showExamples = ref(true);
    const showRelatedWords = ref(true);

    function isEmpty() {
      return (
        !text.value &&
        examples.value.every((ex) => ex.empty) &&
        (!illustration.value || illustration.value.empty) &&
        Object.values(relatedWords.value).every((relatedWords) =>
          relatedWords.every((relatedWord) => relatedWord.empty)
        )
      );
    }

    function fireUpdateEvent() {
      /**
       * @type {import("../types.js").DefinitionUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        definition: {
          id: props.modelValue.id,
          text: text.value,
          examples: examples.value,
          relatedWords: relatedWords.value,
          illustration: illustration.value,
          empty: isEmpty(),
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    const collapsedPreviewText = computed(() => {
      const examplesText =
        examples.value.length === 0
          ? "aucun exemple"
          : `${examples.value.length} exemple${examples.value.length > 1 ? "s" : ""}`;
      const illustrationText = illustration.value
        ? "illustration"
        : "pas d’illustration";
      return `${text.value} (${examplesText}, ${illustrationText})`;
    });

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
      if (isEmpty()) deleteDefinition();
      else openDeletionDialog.value = true;
    }

    function deleteDefinition() {
      openDeletionDialog.value = false;
      ctx.emit("delete", props.index);
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
      examples.value.push(T.createEmptyExample(id));
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

    /*
     * Illustration
     */

    /**
     * Add a new empty image illustration.
     */
    function onAddIllustration() {
      illustration.value = T.createEmptyIllustration();
      fireUpdateEvent();
    }

    /**
     * Delete the illustration.
     */
    function onDeleteIllustration() {
      illustration.value = null;
      fireUpdateEvent();
    }

    /**
     * Update the illustration
     * @param {import("../types.js").Illustration} newIllustration The new illustration.
     */
    function onIllustrationUpdate(newIllustration) {
      illustration.value = newIllustration;
      fireUpdateEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      text,
      examples,
      illustration,
      relatedWords,
      // Visuals
      showFields,
      showExamples,
      showRelatedWords,
      collapsedPreviewText,
      relatedWordsNumber,
      // Deletion dialog
      dialogPrimaryAction,
      dialogDefaultAction,
      openDeletionDialog,
      // Other
      config,
      sectionsData: T.definitionSectionsData,
      // Icons
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconArrowUp,
      cdxIconArrowDown,
      cdxIconTrash,
      cdxIconAdd,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconQuotes,
      cdxIconArticle,
      cdxIconLink,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deleteDefinition,
      onExampleUpdate,
      onAddExample,
      onDeleteExample,
      onMoveExampleUp,
      onMoveExampleDown,
      onAddIllustration,
      onIllustrationUpdate,
      onDeleteIllustration,
      userGenderSwitch: strings.userGenderSwitch,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-definition-form cne-box" is-fieldset>
    <template #label>
      <cdx-icon :icon="cdxIconArticle"></cdx-icon>
      Définition {{ $props.index + 1 }}
      <span class="cne-fieldset-btns">
        <wiki-link page-title="Aide:Définitions">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>

        <wiki-link page-title="Convention:Définitions">
          <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
        </wiki-link>

        <cdx-button
          type="button"
          size="small"
          :aria-label="showFields ? 'Enrouler' : 'Dérouler'"
          :title="showFields ? 'Enrouler' : 'Dérouler'"
          @click="showFields = !showFields"
        >
          <cdx-icon
            :icon="showFields ? cdxIconCollapse : cdxIconExpand"
          ></cdx-icon>
        </cdx-button>

        <cdx-button
          v-show="$props.canMoveBefore || $props.canMoveAfter"
          type="button"
          size="small"
          aria-label="Monter"
          title="Monter"
          :disabled="!$props.canMoveBefore"
          @click="$emit('move:before', $props.index)"
        >
          <cdx-icon :icon="cdxIconArrowUp"></cdx-icon>
        </cdx-button>

        <cdx-button
          v-show="$props.canMoveBefore || $props.canMoveAfter"
          type="button"
          size="small"
          aria-label="Descendre"
          title="Descendre"
          :disabled="!$props.canMoveAfter"
          @click="$emit('move:after', $props.index)"
        >
          <cdx-icon :icon="cdxIconArrowDown"></cdx-icon>
        </cdx-button>

        <cdx-button
          v-show="$props.enableDeleteBtn"
          type="button"
          size="small"
          action="destructive"
          aria-label="Supprimer"
          title="Supprimer"
          :disabled="!$props.enableDeleteBtn"
          @click="onDelete"
        >
          <cdx-icon :icon="cdxIconTrash"></cdx-icon>
        </cdx-button>
      </span>
    </template>

    <div v-show="showFields" class="cne-definition-grid">
      <div class="cne-definition-form-fields">
        <input-with-toolbar
          v-model="text"
          required
          text-area
          @change="fireUpdateEvent"
        >
          <template #description>
            Une courte définition, pas plus d’une ou deux phrases si possible.
          </template>
          <template #help-text>
            Pour des raisons de
            <wiki-link
              page-title="Aide:Définitions"
              anchor="Astuces_pour_rédiger_une_définition"
              >droit d’auteur</wiki-link
            >,
            <strong
              >la définition ne doit pas être recopiée depuis un autre
              dictionnaire, sauf s’il est libre de droit</strong
            >.
          </template>
        </input-with-toolbar>

        <cdx-field class="cne-examples cne-box" is-fieldset>
          <template #label>
            <cdx-icon :icon="cdxIconQuotes"></cdx-icon>
            Exemples
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

        <cdx-field class="cne-related-words cne-box" is-fieldset>
          <template #label>
            <cdx-icon :icon="cdxIconLink"></cdx-icon>
            Mots liés
            <span class="cne-fieldset-btns">
              <cdx-button
                type="button"
                size="small"
                :aria-label="showRelatedWords ? 'Enrouler' : 'Dérouler'"
                :title="showRelatedWords ? 'Enrouler' : 'Dérouler'"
                @click="showRelatedWords = !showRelatedWords"
              >
                <cdx-icon
                  :icon="showRelatedWords ? cdxIconCollapse : cdxIconExpand"
                ></cdx-icon>
              </cdx-button>
            </span>
          </template>

          <related-words-lists
            v-show="showRelatedWords"
            v-model="relatedWords"
            :sections="sectionsData"
          ></related-words-lists>
          <collapsed-preview
            v-show="!showRelatedWords"
            :text="
              relatedWordsNumber === 0
                ? 'Aucun mot lié'
                : `${relatedWordsNumber} mot${relatedWordsNumber > 1 ? 's' : ''}`
            "
          ></collapsed-preview>
        </cdx-field>

        <div v-if="!illustration">
          <cdx-button
            type="button"
            action="progressive"
            @click="onAddIllustration"
          >
            <cdx-icon :icon="cdxIconAdd"></cdx-icon>
            Ajouter une illustration
          </cdx-button>
        </div>
        <illustration-form
          v-else
          v-model="illustration"
          @update:model-value="onIllustrationUpdate"
          @delete="onDeleteIllustration"
        ></illustration-form>
      </div>
    </div>
    <collapsed-preview
      v-show="!showFields"
      :text="collapsedPreviewText"
    ></collapsed-preview>
  </cdx-field>

  <cdx-dialog
    v-model:open="openDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteDefinition"
    @default="openDeletionDialog = false"
  >
    Êtes-vous
    {{ userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de vouloir
    supprimer cette définition&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-definition-form {
  margin-bottom: 4em;
}

.cne-definition-form-fields {
  flex-grow: 1;
}

.cne-examples,
.cne-related-words {
  margin-top: 2em;
  margin-bottom: 2em;
}
/* </nowiki> */
</style>
