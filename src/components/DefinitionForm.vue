<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import { CdxButton, CdxDialog, CdxField, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconArrowDown,
  cdxIconArrowUp,
  cdxIconClose,
  cdxIconCollapse,
  cdxIconEllipsis,
  cdxIconExpand,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
} from "@wikimedia/codex-icons";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";
import ExampleForm from "./ExampleForm.vue";

export default defineComponent({
  components: {
    CdxIcon,
    CdxButton,
    CdxField,
    CdxDialog,
    InputWithToolbar,
    WikiLink,
    ExampleForm,
  },
  props: {
    index: { type: Number, required: true },
    enableDeleteBtn: { type: Boolean, default: false },
    canMoveBefore: { type: Boolean, default: true },
    canMoveAfter: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<import("../types").Definition>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value", "delete", "move:before", "move:after"],
  setup(props, ctx) {
    const text = ref(props.modelValue.text);
    const examples = ref(props.modelValue.examples);

    const showFields = ref(true);

    function fireEvent() {
      /**
       * @type {import("../types.js").DefinitionUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        definition: {
          id: props.modelValue.id,
          text: text.value,
          examples: examples.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /*
     * Definition
     */

    /**
     * Called when the definition is updated.
     * @param {string} newText The new definition.
     */
    function onDefinitionUpdate(newText) {
      text.value = newText;
      fireEvent();
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
      fireEvent();
    }

    function onAddExample() {
      examples.value.push({
        id: utils.getNextId(examples.value),
        text: "",
      });
      fireEvent();
    }

    const openExampleDeletionDialog = ref(false);
    const exampleIndexToDelete = ref(-1);

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
     * Called when the "delete" button is clicked in an example form.
     * @param {number} exampleIndex The index of the example to delete.
     */
    function onDeleteExample(exampleIndex) {
      exampleIndexToDelete.value = exampleIndex;
      const example = examples.value[exampleIndex];
      if (
        !example.text &&
        !example.transcription &&
        !example.transcription &&
        !example.source &&
        !example.link
      )
        deleteExample(); // Delete without confirmation if form is empty
      else openExampleDeletionDialog.value = true;
    }

    /**
     * Delete the example at the selected index.
     */
    function deleteExample() {
      openExampleDeletionDialog.value = false;
      const index = exampleIndexToDelete.value;
      if (index < 0 || index >= examples.value.length) return;

      examples.value.splice(index, 1);
      fireEvent();
    }

    /**
     * Move the given example one position upwards.
     * @param {number} exampleIndex The index of the example to move.
     */
    function onMoveExampleUp(exampleIndex) {
      if (exampleIndex === 0) return;
      const example = examples.value.splice(exampleIndex, 1)[0];
      console.log(example);
      examples.value.splice(exampleIndex - 1, 0, example);
      fireEvent();
    }

    /**
     * Move the given example one position downwards.
     * @param {number} examplesIndex The index of the example to move.
     */
    function onMoveExampleDown(examplesIndex) {
      if (examplesIndex === examples.value.length - 1) return;
      const example = examples.value.splice(examplesIndex, 1)[0];
      examples.value.splice(examplesIndex + 1, 0, example);
      fireEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");
    const gender = config.userGender;

    return {
      text,
      examples,
      showFields,
      openExampleDeletionDialog,
      exampleIndexToDelete,
      dialogPrimaryAction,
      dialogDefaultAction,
      gender,
      utils,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconArrowUp,
      cdxIconArrowDown,
      cdxIconClose,
      cdxIconAdd,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconEllipsis,
      onDefinitionUpdate,
      onExampleUpdate,
      onAddExample,
      onDeleteExample,
      deleteExample,
      onMoveExampleUp,
      onMoveExampleDown,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-definition-form cne-box" is-fieldset>
    <template #label>
      Définition {{ $props.index + 1 }}
      <span class="cne-definition-btns">
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
          @click="$emit('delete', $props.index)"
        >
          <cdx-icon :icon="cdxIconClose"></cdx-icon>
        </cdx-button>
      </span>
    </template>

    <div v-if="showFields">
      <input-with-toolbar
        v-model.trim="text"
        required
        text-area
        @update:model-value="onDefinitionUpdate"
      >
        <template #label>Texte</template>
        <template #description>
          Une courte définition, pas plus d’une ou deux phrases si possible.
        </template>
        <template #help-text>
          Pour des raisons de
          <wiki-link
            page-title="Aide:Définitions"
            anchor="Astuces_pour_rédiger_une_définition"
            >droit d’auteur</wiki-link
          >, la définition ne doit pas être recopiée depuis un autre
          dictionnaire.
        </template>
      </input-with-toolbar>

      <div class="cne-examples">
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
    </div>
    <cdx-icon v-else :icon="cdxIconEllipsis" title="Contenu caché"></cdx-icon>
  </cdx-field>

  <cdx-dialog
    v-model:open="openExampleDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteExample"
    @default="openExampleDeletionDialog = false"
  >
    Êtes-vous {{ utils.userGenderSwitch(gender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cet exemple&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-definition-form {
  margin-bottom: 1em;
}

.cne-definition-btns {
  display: inline-flex;
  gap: 0.5em;
}

.cne-examples {
  margin-top: 1em;
  padding-left: 2em;
}
</style>
<!-- </nowiki> -->
