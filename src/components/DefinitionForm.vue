<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconArrowDown,
  cdxIconArrowUp,
  cdxIconClose,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
} from "@wikimedia/codex-icons";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxIcon,
    CdxButton,
    InputWithToolbar,
    WikiLink,
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
    const definition = ref(props.modelValue.text);
    const examples = ref(props.modelValue.examples);

    function fireEvent() {
      /**
       * @type {import("../types.js").DefinitionUpdateEvent}
       */
      const firedEvent = {
        index: props.index,
        definition: {
          id: props.modelValue.id,
          text: definition.value,
          examples: examples.value,
        },
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /**
     * Called when the definition is updated.
     * @param {string} text The new definition.
     */
    function onDefinitionUpdate(text) {
      definition.value = text;
      fireEvent();
    }

    return {
      definition,
      examples,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconArrowUp,
      cdxIconArrowDown,
      cdxIconClose,
      onDefinitionUpdate,
    };
  },
});
</script>

<template>
  <div class="cne-definition-form cne-box">
    <input-with-toolbar
      v-model.trim="definition"
      required
      text-area
      @update:model-value="onDefinitionUpdate"
    >
      <template #label>
        Définition {{ index + 1 }}
        <span class="cne-definition-btns">
          <wiki-link page-title="Aide:Définitions">
            <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
          </wiki-link>
          <wiki-link page-title="Convention:Définitions">
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
      <template #description>
        Une courte définition, pas plus d’une ou deux phrases si possible
      </template>
      <template #help-text>
        Pour des raisons de
        <wiki-link
          page-title="Aide:Définitions"
          anchor="Astuces_pour_rédiger_une_définition"
          >droit d’auteur</wiki-link
        >, la définition ne doit pas être recopiée depuis un autre dictionnaire.
      </template>
    </input-with-toolbar>
  </div>
</template>

<style>
.cne-definition-form {
  margin-bottom: 1em;
}

.cne-definition-btns {
  display: inline-flex;
  gap: 0.5em;
}
</style>
<!-- </nowiki> -->
