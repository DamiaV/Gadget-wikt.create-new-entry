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
  cdxIconReload,
  cdxIconSearch,
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
    const imageUrl = ref("");
    /**
     * @type {import("vue").Ref<import("../utils.js").VideoFileSources>}
     */
    const videoSources = ref({});
    /**
     * @type {import("vue").Ref<import("../utils.js").MediaFileSource[]>}
     */
    const audioSources = ref([]);

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

    function fireUpdateEvent() {
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
      if (isEmpty()) deleteIllustration();
      else openDeletionDialog.value = true;
    }

    function deleteIllustration() {
      openDeletionDialog.value = false;
      ctx.emit("delete");
    }

    /**
     * Inputs
     */

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

    function onTypeUpdate() {
      imageUrl.value = "";
      videoSources.value = {};
      audioSources.value = [];

      if (["image", "video", "audio"].includes(type.value)) onFileNameUpdate();
      else fireUpdateEvent();
    }

    /**
     * Called when the file name is updated.
     */
    function onFileNameUpdate() {
      if (fileName.value) {
        switch (type.value) {
          case "image":
            utils
              .getImageFileUrl(fileName.value)
              .then((url) => (imageUrl.value = url));
            break;
          case "video":
            utils
              .getVideoFileUrls(fileName.value)
              .then((sources) => (videoSources.value = sources || {}));
            break;
          case "audio":
            utils
              .getAudioFileUrls(fileName.value)
              .then((sources) => (audioSources.value = sources || []));
            break;
        }
      }
      fireUpdateEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      types,
      type,
      description,
      fileName,
      rawFileName,
      text,
      color,
      alt,
      imageUrl,
      videoSources,
      audioSources,
      // Visual
      status,
      messages,
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
      cdxIconClose,
      cdxIconSearch,
      cdxIconReload,
      // Callbacks
      fireUpdateEvent,
      onDelete,
      deleteIllustration,
      onInput,
      onInvalid,
      onTypeUpdate,
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
        (type === 'image' && imageUrl) ||
        (type === 'video' && videoSources.sources) ||
        (type === 'audio' && audioSources.length) ||
        (type === 'color' && color)
      "
      class="cne-preview-box"
    >
      Aperçu

      <img
        v-if="type === 'image'"
        class="cne-image-preview"
        :src="imageUrl"
        :alt="alt"
      />

      <video
        v-else-if="type === 'video'"
        :key="videoSources"
        :poster="videoSources.thumbUrl"
        class="cne-image-preview"
        controls
      >
        <source
          v-for="(source, i) in videoSources.sources"
          :key="i"
          :src="source.src"
          :type="source.type"
        />
        Impossible de lire la vidéo
      </video>

      <audio v-else-if="type === 'audio'" :key="audioSources" controls>
        <source
          v-for="(source, i) in audioSources"
          :key="i"
          :src="source.src"
          :type="source.type"
        />
        Impossible de lire le fichier
      </audio>

      <div
        v-else-if="type === 'color'"
        class="cne-color-preview"
        :style="{ backgroundColor: color }"
      ></div>

      <a
        v-show="
          (type === 'image' || type === 'video' || type === 'audio') && fileName
        "
        :href="`https://commons.wikimedia.org/wiki/File:${fileName}`"
        target="_blank"
        title="Voir le fichier sur Commons (S’ouvre dans un nouvel onglet)"
        >Fichier</a
      >
    </div>

    <cdx-radio
      v-for="(type_, i) in types"
      :key="i"
      v-model="type"
      :input-value="type_.value"
      name="type"
      @change="onTypeUpdate"
    >
      {{ type_.label }}
    </cdx-radio>

    <cdx-field
      v-if="type === 'image' || type === 'video' || type === 'audio'"
      :status="status"
      :messages="messages"
    >
      <template #label>
        Nom du fichier sur Commons
        <a
          :href="`https://commons.wikimedia.org/wiki/Special:MediaSearch?search=${encodeURIComponent(config.word)}&type=${type}`"
          target="_blank"
          title="Chercher sur Commons (S’ouvre dans un nouvel onglet)"
          ><cdx-icon :icon="cdxIconSearch"></cdx-icon
        ></a>
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
        @change="fireUpdateEvent"
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
        @change="fireUpdateEvent"
        @update:model-value="onInput"
        @invalid="onInvalid"
      ></cdx-text-input>
    </cdx-field>

    <input-with-toolbar
      v-model="description"
      clearable
      required
      @change="fireUpdateEvent"
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
        @change="fireUpdateEvent"
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
    {{ utils.userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de
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
  margin: 0 0 1em 1em;
}

.cne-image-preview {
  max-width: 20em;
  max-height: 20em;
}

.cne-color-preview {
  width: 3em;
  height: 3em;
}
</style>
<!-- </nowiki> -->
