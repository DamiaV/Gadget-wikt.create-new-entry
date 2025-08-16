<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import { CdxField, CdxIcon, CdxRadio, CdxTextInput } from "@wikimedia/codex";
import { cdxIconHelpNotice, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxField,
    CdxTextInput,
    CdxIcon,
    CdxRadio,
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
    const fileName = ref(props.modelValue.fileName || "");
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

    const fileUrl = ref("");

    const types = [
      { label: "Image", value: "image" },
      { label: "Fichier vidéo", value: "video" },
      { label: "Fichier audio", value: "audio" },
      { label: "Texte", value: "text" },
      { label: "Couleur", value: "color" },
    ];

    function fireEvent() {
      /**
       * @type {import("../types.js").Illustration}
       */
      const firedEvent = {
        type: type.value,
        description: description.value,
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
     * Called when the file name is updated.
     */
    function onFileNameUpdate() {
      utils.getFileUrl(fileName.value).then((url) => {
        console.log(url);
        fileUrl.value = url;
      });
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
      text,
      color,
      alt,
      fileUrl,
      types,
      config,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      fireEvent,
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
      </span>
    </template>

    <div
      v-if="
        ((type === 'image' || type === 'video' || type === 'audio') &&
          !!fileName) ||
        (type === 'color' && !!color)
      "
      class="cne-preview-box"
    >
      Aperçu
      <img
        v-if="type === 'image' && !!fileName"
        class="cne-image-preview"
        :src="fileUrl"
      />
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

    <cdx-field v-if="type === 'image' || type === 'video' || type === 'audio'">
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
        v-model.trim.lazy="fileName"
        clearable
        @change="onFileNameUpdate"
      ></cdx-text-input>
    </cdx-field>

    <cdx-field v-else-if="type === 'text'">
      <template #label>Texte</template>
      <cdx-text-input
        v-model.trim.lazy="text"
        clearable
        @change="fireEvent"
      ></cdx-text-input>
    </cdx-field>

    <cdx-field v-else-if="type === 'color'">
      <template #label>Code de la couleur</template>
      <template #description>Un code couleur CSS.</template>
      <cdx-text-input
        v-model.trim.lazy="color"
        clearable
        @change="fireEvent"
      ></cdx-text-input>
    </cdx-field>

    <input-with-toolbar
      v-model="description"
      :required="
        ((type === 'image' || type === 'video' || type === 'audio') &&
          !!fileName) ||
        (type === 'text' && !!text) ||
        (type === 'color' && !!color)
      "
      clearable
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
        v-model.trim.lazy="alt"
        clearable
        @change="fireEvent"
      ></cdx-text-input>
      <template #help-text>
        Il est fortement recommandé de renseigner un texte alternatif pour une
        meilleure accessibilité.
      </template>
    </cdx-field>
  </cdx-field>
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
  max-width: 5em;
  max-height: 5em;
}

.cne-color-preview {
  width: 3em;
  height: 3em;
}
</style>
<!-- </nowiki> -->
