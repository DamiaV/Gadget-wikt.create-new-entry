<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxDialog,
  CdxField,
  CdxIcon,
} from "@wikimedia/codex";
import {
  cdxIconArrowDown,
  cdxIconArrowUp,
  cdxIconCollapse,
  cdxIconExpand,
  cdxIconFeedback,
  cdxIconHelp,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import T from "../types.js";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";
import CollapsedPreview from "./CollapsedPreview.vue";

export default defineComponent({
  components: {
    CdxIcon,
    CdxField,
    CdxButton,
    CdxDialog,
    CdxCheckbox,
    InputWithToolbar,
    CollapsedPreview,
    WikiLink,
  },

  props: {
    language: { type: T.Language, required: true },
    index: { type: Number, required: true },
    enableDeleteBtn: { type: Boolean, default: false },
    canMoveBefore: { type: Boolean, default: true },
    canMoveAfter: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<import("../types.js").Pronunciation>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value", "delete", "move:before", "move:after"],

  setup(props, ctx) {
    const pronunciation = ref(props.modelValue.pronunciation);
    const isReconstructed = ref(props.modelValue.isReconstructed);

    const showFields = ref(true);

    function isEmpty() {
      return !pronunciation.value;
    }

    function fireUpdateEvent() {
      /**
       * @type {import("../types.js").PronunciationUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        pronunciation: {
          id: props.modelValue.id,
          pronunciation: pronunciation.value,
          isReconstructed: isReconstructed.value,
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
      if (isEmpty()) deletePronunciation();
      else openDeletionDialog.value = true;
    }

    function deletePronunciation() {
      openDeletionDialog.value = false;
      ctx.emit("delete", props.index);
    }

    /**
     * @type {[string, string][]}
     */
    const autoSwaps = [
      ["g", "ɡ"],
      ["'", "ˈ"],
      [":", "ː"],
      ["!", "ǃ"],
      ["|", "ǀ"],
      ["\u00a0", " "],
      ["\u202f", " "],
    ];

    const invalidCharacters = "()[]{}";

    /**
     * @type {[string, string, string, string][]}
     */
    const suspiciousCharacters = [
      ["’", "ʼ", "apostrophe courbe", "consonne éjective"],
      [",", "ˌ", "virgule", "accent tonique secondaire"],
      ["?", "ʔ", "point d’interrogation", "coup de glotte"],
      [";", "ː", "point-virgule", "allongement"],
    ];

    /**
     * Replace characters in the given text.
     * @param {string} text The text to transform.
     * @returns {string} The transformed input.
     */
    function pronunciationTransformer(text) {
      for (const [c1, c2] of autoSwaps) text = text.replaceAll(c1, c2);
      return text;
    }

    /**
     * Check that the given pronunciation does not contain any suspicious characters.
     * @param {string} text The text to check.
     * @returns {string | null} An error message if the argument contains any suspicious characters, false otherwise.
     */
    function pronunciationValidator(text) {
      for (const char of invalidCharacters)
        if (text.includes(char))
          return `Caractère invalide détecté\u00a0: «\u00a0${char}\u00a0»`;

      for (const [char, repl, name1, name2] of suspiciousCharacters)
        if (text.includes(char))
          return (
            `Caractère invalide détecté\u00a0: «\u00a0${char}\u00a0» (${name1}). ` +
            `Peut-être vouliez-vous plutôt écrire «\u00a0${repl}\u00a0» (${name2})\u00a0?`
          );

      return null;
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      pronunciation,
      isReconstructed,
      // Visual
      showFields,
      // Deletion dialog
      openDeletionDialog,
      dialogPrimaryAction,
      dialogDefaultAction,
      // Other
      utils,
      config,
      // Icons
      cdxIconHelp,
      cdxIconFeedback,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconTrash,
      cdxIconArrowUp,
      cdxIconArrowDown,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deletePronunciation,
      pronunciationValidator,
      pronunciationTransformer,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-pronunciation-form cne-box" is-fieldset>
    <template #label>
      <cdx-icon :icon="cdxIconFeedback"></cdx-icon>
      Prononciation {{ $props.index + 1 }}
      <span class="cne-fieldset-btns">
        <wiki-link
          v-if="language.hasPronunciationAppendix"
          :page-title="`Annexe:Prononciation/${language.name}`"
        >
          <cdx-icon :icon="cdxIconHelp"></cdx-icon>
        </wiki-link>
        <wiki-link page-title="Aide:Prononciation écrite">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>
        <wiki-link page-title="Convention:Prononciation écrite">
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

    <div v-show="showFields">
      <input-with-toolbar
        v-model.trim="pronunciation"
        required
        clearable
        :show-format-buttons="false"
        :special-characters="$props.language.ipaSymbols"
        :validator="pronunciationValidator"
        :transformer="pronunciationTransformer"
        @change="fireUpdateEvent"
      ></input-with-toolbar>
      <cdx-checkbox
        v-model="isReconstructed"
        @update:model-value="fireUpdateEvent"
      >
        Prononciation reconstruite
        <template #description>
          Cochez dans le cas d’une langue morte (ancien français, moyen anglais,
          chinois archaïque, etc.).
        </template>
      </cdx-checkbox>
    </div>
    <collapsed-preview
      v-show="!showFields"
      :text="pronunciation"
    ></collapsed-preview>
  </cdx-field>

  <cdx-dialog
    v-model:open="openDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deletePronunciation"
    @default="openDeletionDialog = false"
  >
    Êtes-vous
    {{ utils.userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cette prononciation&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-pronunciation-form {
  margin-bottom: 1em;
}
</style>
<!-- </nowiki> -->
