<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxTextInput,
  CdxToggleSwitch,
} from "@wikimedia/codex";
import {
  cdxIconArrowDown,
  cdxIconArrowUp,
  cdxIconCollapse,
  cdxIconEllipsis,
  cdxIconExpand,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import CollapsedPreview from "./CollapsedPreview.vue";

export default defineComponent({
  components: {
    CdxIcon,
    CdxButton,
    CdxField,
    CdxTextInput,
    CdxToggleSwitch,
    CdxDialog,
    InputWithToolbar,
    CollapsedPreview,
  },

  props: {
    index: { type: Number, required: true },
    enableDeleteBtn: { type: Boolean, default: false },
    canMoveBefore: { type: Boolean, default: true },
    canMoveAfter: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<import("../types").Example>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value", "delete", "move:before", "move:after"],

  setup(props, ctx) {
    const text = ref(props.modelValue.text);
    const translation = ref(props.modelValue.translation || "");
    const transcription = ref(props.modelValue.transcription || "");
    const source = ref(props.modelValue.source || "");
    const link = ref(props.modelValue.link || "");
    const disableTranslation = ref(!!props.modelValue.disableTranslation);

    const showTranscription = ref(false);

    const showFields = ref(true);

    function isEmpty() {
      return (
        !text.value &&
        !translation.value &&
        !transcription.value &&
        !source.value &&
        !link.value
      );
    }

    function fireUpdateEvent() {
      /**
       * @type {import("../types.js").ExampleUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        example: {
          id: props.modelValue.id,
          text: text.value,
          translation: disableTranslation.value ? null : translation.value,
          transcription: showTranscription.value ? transcription.value : null,
          source: source.value,
          link: link.value,
          disableTranslation: disableTranslation.value,
          empty: isEmpty(),
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /*
     * Deletion Dialog
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
      if (isEmpty()) deleteExample();
      else openDeletionDialog.value = true;
    }

    function deleteExample() {
      openDeletionDialog.value = false;
      ctx.emit("delete", props.index);
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      text,
      translation,
      transcription,
      source,
      link,
      disableTranslation,
      // Visual
      showTranscription,
      showFields,
      // Deletion dialog
      dialogPrimaryAction,
      dialogDefaultAction,
      openDeletionDialog,
      // Other
      utils,
      config,
      // Icons
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconArrowDown,
      cdxIconArrowUp,
      cdxIconTrash,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconEllipsis,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deleteExample,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-example-form cne-box" is-fieldset>
    <template #label>
      Exemple {{ $props.index + 1 }}
      <span class="cne-fieldset-btns">
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
        v-model.trim="text"
        required
        text-area
        @change="fireUpdateEvent"
      >
        <template #label>Texte</template>
        <template #description>
          Un court exemple d’utilisation du mot défini, tiré de la littérature,
          du web, etc. Le mot défini doit être mis en <strong>gras</strong>.
        </template>
        <template #help-text>
          L’orthographe et la typographie originales doivent être conservées,
          fautes d’orthographe incluses (pas besoin de mettre
          «&nbsp;sic&nbsp;»). Les mots en <em>italique</em> dans le texte
          original doivent l’être aussi dans l’exemple. Il ne doit pas y avoir
          de liens dans le texte.
        </template>
      </input-with-toolbar>

      <cdx-field>
        <cdx-toggle-switch
          v-model="disableTranslation"
          @change="fireUpdateEvent"
        >
          Désactiver la traduction
        </cdx-toggle-switch>
        <template #help-text>
          Ne cochez que dans le cas d’un texte en moyen français qui est
          facilement lisible.
        </template>
      </cdx-field>

      <input-with-toolbar
        v-show="!disableTranslation"
        v-model.trim="translation"
        text-area
        @change="fireUpdateEvent"
      >
        <template #label>Traduction</template>
        <template #description>
          Pour les textes qui ne sont pas en français.
        </template>
      </input-with-toolbar>

      <cdx-field>
        <cdx-toggle-switch v-model="showTranscription">
          Afficher la transcription
        </cdx-toggle-switch>
      </cdx-field>

      <input-with-toolbar
        v-show="showTranscription"
        v-model.trim="transcription"
        text-area
        @change="fireUpdateEvent"
      >
        <template #label>Transcription ou translittération</template>
        <template #description>
          Transcription/translittération en alphabet latin pour les textes dans
          un système d’écriture autre que l’alphabet latin.
        </template>
      </input-with-toolbar>

      <input-with-toolbar v-model.trim="source" @change="fireUpdateEvent">
        <template #label>Source</template>
        <template #description>
          La référence de l’ouvrage ou du site web d’où provient l’exemple.
        </template>
      </input-with-toolbar>

      <cdx-field>
        <template #label>Lien de la source</template>
        <template #description>
          Le lien de la source si absente du champ ci-dessus.
        </template>
        <cdx-text-input
          v-model.trim="link"
          @change="fireUpdateEvent"
        ></cdx-text-input>
      </cdx-field>
    </div>
    <collapsed-preview v-show="!showFields" :text="text"></collapsed-preview>
  </cdx-field>

  <cdx-dialog
    v-model:open="openDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteExample"
    @default="openDeletionDialog = false"
  >
    Êtes-vous
    {{ utils.userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cet exemple&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-example-form {
  margin-bottom: 1em;
}
</style>
<!-- </nowiki> -->
