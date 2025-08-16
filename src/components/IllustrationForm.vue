<!-- <nowiki> -->
<script>
import { computed, defineComponent, inject, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxRadio,
  CdxTextInput,
} from "@wikimedia/codex";
import {
  cdxIconClose,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
} from "@wikimedia/codex-icons";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxField,
    CdxTextInput,
    CdxIcon,
    CdxRadio,
    CdxButton,
    CdxDialog,
    WikiLink,
    InputWithToolbar,
  },
  props: {
    /**
     * @type {import("vue").PropType<import("../types.js").Illustration>}
     */
    modelValue: { type: Object, required: true },
  },
  emits: ["update:model-value", "delete"],
  setup(props, ctx) {
    const type = ref(props.modelValue.type);
    const description = ref(props.modelValue.description || "");
    /**
     * @type {import("vue").Ref<string>}
     */
    const rawFileName = ref(props.modelValue.fileName || "");
    /**
     * @type {import("vue").Ref<string>}
     */
    const text = ref(props.modelValue.text || "");
    /**
     * @type {import("vue").Ref<string>}
     */
    const color = ref(props.modelValue.color || "");
    /**
     * @type {import("vue").Ref<string>}
     */
    const alt = ref(props.modelValue.alt || "");

    const fileName = computed(() => {
      const lowerFileName = rawFileName.value.toLocaleLowerCase();
      if (lowerFileName.startsWith("file:"))
        return rawFileName.value.substring(5);
      if (lowerFileName.startsWith("image:"))
        return rawFileName.value.substring(6);
      return rawFileName.value;
    });
    const fileUrl = ref("");

    const status = ref("default");
    const messages = ref({
      error: "",
    });

    const types = [
      { label: "Image", value: "image" },
      { label: "Fichier vidéo", value: "video" },
      { label: "Fichier audio", value: "audio" },
      { label: "Texte", value: "text" },
      { label: "Couleur", value: "color" },
    ];

    function isEmpty() {
      return (
        !fileName.value &&
        !text.value &&
        !color.value &&
        !alt.value &&
        !description.value
      );
    }

    function fireEvent() {
      /**
       * @type {import("../types.js").Illustration}
       */
      const firedEvent = {
        type: type.value,
        description: description.value,
        empty: isEmpty(),
      };
      switch (type.value) {
        case "image":
        case "video":
        case "audio":
          firedEvent.fileName = fileName.value;
          firedEvent.alt = alt.value;
          break;
        case "text":
          firedEvent.text = text.value;
          break;
        case "color":
          firedEvent.color = color.value;
          break;
      }
      ctx.emit("update:model-value", firedEvent);
    }

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
      // Delete without confirmation if form is empty
      if (isEmpty()) deleteIllustration();
      else openDeletionDialog.value = true;
    }

    function deleteIllustration() {
      openDeletionDialog.value = false;
      ctx.emit("delete");
    }

    /**
     * Called when the any of the file name, text, or color input is updated.
     */
    function onInput() {
      status.value = "default";
      messages.value.error = "";
    }

    /**
     * @param {Event} event
     */
    function onInvalid(event) {
      status.value = "error";
      if (event.target) messages.value.error = event.target.validationMessage;
    }

    /**
     * Called when the file name is updated.
     */
    function onFileNameUpdate() {
      // FIXME try to make it work in local testing
      utils.getFileUrl(fileName.value).then((url) => (fileUrl.value = url));
      fireEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      type,
      description,
      fileName,
      rawFileName,
      text,
      color,
      alt,
      fileUrl,
      status,
      messages,
      dialogPrimaryAction,
      dialogDefaultAction,
      openDeletionDialog,
      types,
      config,
      utils,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconClose,
      fireEvent,
      onDelete,
      deleteIllustration,
      onInput,
      onInvalid,
      onFileNameUpdate,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-illustration-form cne-box" is-fieldset>
    <template #label>
      Illustration

      <span class="cne-illustration-btns">
        <wiki-link page-title="Aide:Illustrations">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>

        <wiki-link page-title="Convention:Illustrations">
          <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
        </wiki-link>

        <cdx-button
          type="button"
          size="small"
          action="destructive"
          aria-label="Supprimer"
          title="Supprimer"
          @click="onDelete"
        >
          <cdx-icon :icon="cdxIconClose"></cdx-icon>
        </cdx-button>
      </span>
    </template>

    <div
      v-show="
        ((type === 'image' || type === 'video' || type === 'audio') &&
          !!fileName) ||
        (type === 'color' && !!color)
      "
      class="cne-preview-box"
    >
      Aperçu
      <a
        v-if="type === 'image' && !!fileName"
        :href="`https://commons.wikimedia.org/wiki/File:${fileName}`"
        target="_blank"
        title="Voir l’image sur Commons (S’ouvre dans un nouvel onglet)"
      >
        <img class="cne-image-preview" :src="fileUrl" />
      </a>
      <div
        v-else-if="type === 'color' && !!color"
        class="cne-color-preview"
        :style="{ backgroundColor: color }"
      ></div>
    </div>

    <cdx-radio
      v-for="(type_, i) in types"
      :key="i"
      v-model="type"
      :input-value="type_.value"
      name="type"
      @change="fireEvent"
    >
      {{ type_.label }}
    </cdx-radio>

    <cdx-field
      v-if="type === 'image' || type === 'video' || type === 'audio'"
      :status="status"
      :messages="messages"
    >
      <template #label>
        Nom du fichier sur
        <a
          :href="`https://commons.wikimedia.org/wiki/Special:MediaSearch?search=${encodeURIComponent(config.word)}&type=${type}`"
          target="_blank"
          title="Chercher sur Commons (S’ouvre dans un nouvel onglet)"
          >Commons</a
        >
      </template>
      <cdx-text-input
        v-model.trim="rawFileName"
        clearable
        required
        @change="onFileNameUpdate"
        @update:model-value="onInput"
        @invalid="onInvalid"
      ></cdx-text-input>
    </cdx-field>

    <cdx-field
      v-else-if="type === 'text'"
      :status="status"
      :messages="messages"
    >
      <template #label>Texte</template>
      <cdx-text-input
        v-model.trim="text"
        clearable
        required
        @change="fireEvent"
        @update:model-value="onInput"
        @invalid="onInvalid"
      ></cdx-text-input>
    </cdx-field>

    <cdx-field
      v-else-if="type === 'color'"
      :status="status"
      :messages="messages"
    >
      <template #label>Code de la couleur</template>
      <template #description>Un code couleur CSS.</template>
      <cdx-text-input
        v-model.trim="color"
        clearable
        required
        @change="fireEvent"
        @update:model-value="onInput"
        @invalid="onInvalid"
      ></cdx-text-input>
    </cdx-field>

    <input-with-toolbar
      v-model="description"
      clearable
      required
      @change="fireEvent"
    >
      <template #label>Légende</template>
      <template #description>
        Une courte description de l’illustration.
      </template>
      <template #help-text>
        Si le mot illustré est présent dans la légende, il doit être en
        <strong>gras</strong>.
      </template>
    </input-with-toolbar>

    <cdx-field v-if="type === 'image' || type === 'video' || type === 'audio'">
      <template #label>Texte alternatif</template>
      <template #description>
        Texte qui sera affiché si le fichier ne peut pas être chargé.
      </template>
      <cdx-text-input
        v-model.trim="alt"
        clearable
        @change="fireEvent"
      ></cdx-text-input>
      <template #help-text>
        Il est fortement recommandé de renseigner un texte alternatif pour une
        meilleure accessibilité.
      </template>
    </cdx-field>
  </cdx-field>

  <cdx-dialog
    v-model:open="openDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteIllustration"
    @default="openDeletionDialog = false"
  >
    Êtes-vous
    {{ utils.userGenderSwitch(config.gender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cette illustration&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-illustration-btns {
  display: inline-flex;
  gap: 0.5em;
}

.cne-preview-box {
  float: right;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.5em;
}

.cne-image-preview {
  max-width: 10em;
  max-height: 10em;
}

.cne-color-preview {
  width: 3em;
  height: 3em;
}
</style>
<!-- </nowiki> -->
