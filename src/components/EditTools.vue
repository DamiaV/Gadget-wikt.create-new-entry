<!-- <nowiki> -->
<script>
import { defineComponent } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconBold,
  cdxIconItalic,
  cdxIconPuzzle,
} from "@wikimedia/codex-icons";
import W from "../wikitext.js";

/**
 * @typedef {{
 *  name: string,
 *  title: string,
 *  icon?: string,
 *  iconOnly?: boolean,
 *  action: (selectedText: string) => string,
 * }} CustomAction
 */

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
  },

  props: {
    showFormatButtons: { type: Boolean, default: true },
    showTemplateButton: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<CustomAction[]>}
     */
    customActions: { type: Array, default: () => [] },
    /**
     * @type {import("vue").PropType<string[][]>}
     */
    characters: { type: Array, default: () => [W.specialCharacters] },
  },

  emits: [
    "style:bold",
    "style:italic",
    "insert-char",
    "insert-template",
    "custom-action",
  ],

  setup() {
    return {
      // Icons
      cdxIconBold,
      cdxIconItalic,
      cdxIconPuzzle,
    };
  },
});
</script>

<template>
  <div class="cne-edit-tools">
    <template v-if="$props.showFormatButtons">
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Mettre en gras"
        title="Mettre en gras"
        size="small"
        @click="$emit('style:bold')"
      >
        <cdx-icon :icon="cdxIconBold"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Mettre en italique"
        title="Mettre en italique"
        size="small"
        @click="$emit('style:italic')"
      >
        <cdx-icon :icon="cdxIconItalic"></cdx-icon>
      </cdx-button>
      <cdx-button
        v-if="$props.showTemplateButton"
        class="format-btn"
        type="button"
        aria-label="Insérer un modèle"
        title="Insérer un modèle"
        size="small"
        @click="$emit('insert-template')"
      >
        <cdx-icon :icon="cdxIconPuzzle"></cdx-icon>
      </cdx-button>
      <cdx-button
        v-for="customAction in $props.customActions"
        :key="customAction.name"
        :title="customAction.title || customAction.name"
        :aria-label="customAction.title || customAction.name"
        class="format-btn"
        type="button"
        size="small"
        @click="$emit('custom-action', customAction.action)"
      >
        <cdx-icon v-if="customAction.icon" :icon="customAction.icon"></cdx-icon>
        <span v-if="!customAction.iconOnly">{{ customAction.name }}</span>
      </cdx-button>
    </template>
    <template v-for="(chars, i) in $props.characters" :key="i">
      <span v-if="i > 0" class="separator">—</span>
      <a
        v-for="(char, j) in chars"
        :key="j"
        href="#"
        :aria-label="`Insérer un ${char}`"
        title="Cliquer pour insérer le caractère"
        @click.prevent="$emit('insert-char', char)"
      >
        {{ char }}
      </a>
    </template>
  </div>
</template>

<style>
.cne-edit-tools {
  display: flex;
  gap: 0.15em;
  margin-bottom: 0.25em;
}
</style>
<!-- </nowiki> -->
