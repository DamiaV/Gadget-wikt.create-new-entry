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
  cdxIconCollapse,
  cdxIconEllipsis,
  cdxIconExpand,
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

    const showTranscription = ref(false); // FIXME reset when component is refreshed

    const showFields = ref(true); // FIXME reset when component is refreshed

    function fireEvent() {
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
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    return {
      text,
      translation,
      transcription,
      source,
      link,
      disableTranslation,
      showTranscription,
      showFields,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconArrowDown,
      cdxIconArrowUp,
      cdxIconClose,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconEllipsis,
      fireEvent,
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
        @change="fireEvent"
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
          original doivent l’être aussi dans l’exemple.
        </template>
      </input-with-toolbar>

      <cdx-field>
        <cdx-toggle-switch v-model="disableTranslation" @change="fireEvent">
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
        @change="fireEvent"
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
        @change="fireEvent"
      >
        <template #label>Transcription ou translittération</template>
        <template #description>
          Transcription/translittération en alphabet latin pour les textes dans
          un système d’écriture autre que l’alphabet latin.
        </template>
      </input-with-toolbar>

      <input-with-toolbar v-model.trim="source" @change="fireEvent">
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
          @change="fireEvent"
        ></cdx-text-input>
      </cdx-field>
    </div>
    <cdx-icon v-else :icon="cdxIconEllipsis" title="Contenu caché"></cdx-icon>
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
