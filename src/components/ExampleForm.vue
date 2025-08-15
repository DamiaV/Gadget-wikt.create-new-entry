<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import {
  CdxButton,
  CdxField,
  CdxIcon,
  CdxTextInput,
  CdxToggleSwitch,
} from "@wikimedia/codex";
import {
  cdxIconArrowDown,
  cdxIconArrowUp,
  cdxIconClose,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
} from "@wikimedia/codex-icons";
import WikiLink from "./WikiLink.vue";
import InputWithToolbar from "./InputWithToolbar.vue";

export default defineComponent({
  components: {
    CdxIcon,
    CdxButton,
    CdxField,
    CdxTextInput,
    CdxToggleSwitch,
    InputWithToolbar,
    WikiLink,
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

    function fireEvent() {
      /**
       * @type {import("../types.js").ExampleUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        example: {
          id: props.modelValue.id,
          text: text.value,
          translation: translation.value,
          transcription: transcription.value,
          source: source.value,
          link: link.value,
          disableTranslation: disableTranslation.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /**
     * Called when the text is updated.
     * @param {string} newText The new text.
     */
    function onExampleTextUpdate(newText) {
      text.value = newText;
      fireEvent();
    }

    /**
     * Called when the translation is updated.
     * @param {string} newTranslation The new translation.
     */
    function onExampleTranslationUpdate(newTranslation) {
      translation.value = newTranslation;
      fireEvent();
    }

    /**
     * Called when the transcription is updated.
     * @param {string} newTranscription The new transcription.
     */
    function onExampleTranscriptionUpdate(newTranscription) {
      transcription.value = newTranscription;
      fireEvent();
    }

    /**
     * Called when the source is updated.
     * @param {string} newSource The new source.
     */
    function onExampleSourceUpdate(newSource) {
      source.value = newSource;
      fireEvent();
    }

    /**
     * Called when the link is updated.
     * @param {string} newLink The new link.
     */
    function onExampleLinkUpdate(newLink) {
      link.value = newLink;
      fireEvent();
    }

    /**
     * Called when the switch for disable the translation is updated.
     * @param {boolean} disable The new disabled state.
     */
    function onDisableTranslationUpdate(disable) {
      disableTranslation.value = disable;
      fireEvent();
    }

    return {
      text,
      translation,
      transcription,
      source,
      link,
      disableTranslation,
      showTranscription,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconArrowDown,
      cdxIconArrowUp,
      cdxIconClose,
      onExampleTextUpdate,
      onExampleTranslationUpdate,
      onExampleTranscriptionUpdate,
      onExampleSourceUpdate,
      onExampleLinkUpdate,
      onDisableTranslationUpdate,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-example-form cne-box" is-fieldset>
    <template #label>
      Exemple {{ $props.index + 1 }}
      <span class="cne-example-btns">
        <wiki-link page-title="Aide:Exemples">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>
        <wiki-link page-title="Convention:Exemples">
          <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
        </wiki-link>
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

    <input-with-toolbar
      v-model.trim="text"
      required
      text-area
      @update:model-value="onExampleTextUpdate"
    >
      <template #label>Texte</template>
      <template #description>
        Un court exemple d’utilisation du mot défini, tiré de la littérature, du
        web, etc. Le mot défini doit être mis en <strong>gras</strong>.
      </template>
      <template #help-text>
        L’orthographe et la typographie originales doivent être conservées,
        fautes d’orthographe incluses (pas besoin de mettre «&nbsp;sic&nbsp;»).
        Les mots en <em>italique</em> dans le texte original doivent l’être
        aussi dans l’exemple.
      </template>
    </input-with-toolbar>

    <cdx-field>
      <cdx-toggle-switch
        v-model="disableTranslation"
        @update:model-value="onDisableTranslationUpdate"
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
      @update:model-value="onExampleTranslationUpdate"
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
      @update:model-value="onExampleTranscriptionUpdate"
    >
      <template #label>Transcription ou translittération</template>
      <template #description>
        Transcription/translittération en alphabet latin pour les textes dans un
        système d’écriture autre que l’alphabet latin.
      </template>
    </input-with-toolbar>

    <input-with-toolbar
      v-model.trim.lazy="source"
      @update:model-value="onExampleSourceUpdate"
    >
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
        @update:model-value="onExampleLinkUpdate"
      ></cdx-text-input>
    </cdx-field>
  </cdx-field>
</template>

<style>
.cne-example-form {
  margin-bottom: 1em;
}

.cne-example-btns {
  display: inline-flex;
  gap: 0.5em;
}
</style>
<!-- </nowiki> -->
