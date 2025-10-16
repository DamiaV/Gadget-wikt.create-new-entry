<script>
// <nowiki>
import { defineComponent, inject, onUnmounted, ref } from "vue";
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
  cdxIconHelp,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconSpeechBubble,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import strings from "../strings.js";
import types from "../types.js";
import wikitext from "../wikitext.js";
import CollapsedPreview from "./CollapsedPreview.vue";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

// </nowiki>
/**
 * A form component to edit a Pronunciation object.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/PronunciationForm.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxButton,
    CdxCheckbox,
    CdxDialog,
    CdxField,
    CdxIcon,
    CollapsedPreview,
    InputWithToolbar,
    WikiLink,
  },

  props: {
    /**
     * The current user’s preferences.
     * @type {import("vue").PropType<import("./types.js").UserPreferences>}
     */
    userPreferences: { type: Object, required: true },
    /**
     * The currently selected language.
     */
    language: { type: types.Language, required: true },
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
     * The Pronunciation object to manage.
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
     * @type {import("../types.js").ValidationLock}
     */
    const validationLock = inject("validationLock");
    const lockKey = validationLock.register("pronForm");
    onUnmounted(() => {
      validationLock.unregister(lockKey);
    });

    /**
     * Check that the given pronunciation does not contain any suspicious characters.
     * @param {string} text The text to check.
     * @returns {string | null} An error message if the argument contains any suspicious characters, false otherwise.
     */
    function pronunciationValidator(text) {
      const invalidChar = wikitext.findWikitextSpecialChars(text, "|");
      if (invalidChar) {
        validationLock.setError(lockKey, true);
        return `Caractère invalide détecté\u00a0: «\u00a0${invalidChar}\u00a0»`;
      }

      for (const [char, repl, name1, name2] of suspiciousCharacters)
        if (text.includes(char)) {
          validationLock.setError(lockKey, true);
          return (
            `Caractère invalide détecté\u00a0: «\u00a0${char}\u00a0» (${name1}). ` +
            `Peut-être vouliez-vous plutôt écrire «\u00a0${repl}\u00a0» (${name2})\u00a0?`
          );
        }

      validationLock.setError(lockKey, false);
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
      config,
      // Icons
      cdxIconHelp,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconTrash,
      cdxIconArrowUp,
      cdxIconArrowDown,
      cdxIconSpeechBubble,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deletePronunciation,
      pronunciationValidator,
      pronunciationTransformer,
      userGenderSwitch: strings.userGenderSwitch,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-pronunciation-form cne-box" is-fieldset>
    <template #label>
      <cdx-icon :icon="cdxIconSpeechBubble"></cdx-icon>
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
        v-model="pronunciation"
        input-class="API"
        :required="!$props.userPreferences.formValidityCheckingDisabled"
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
    {{ userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de vouloir
    supprimer cette prononciation&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-pronunciation-form {
  margin-bottom: 1em;
}
/* </nowiki> */
</style>
