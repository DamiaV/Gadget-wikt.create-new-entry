<!-- <nowiki> -->
<script>
import { defineComponent } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconBold,
  cdxIconCode,
  cdxIconItalic,
  cdxIconNoWikitext,
  cdxIconPuzzle,
  cdxIconQuotes,
  cdxIconReference,
  cdxIconSubscript,
  cdxIconSuperscript,
  cdxIconWikitext,
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
    "insert:char",
    "insert:superscript",
    "insert:subscript",
    "insert:link",
    "insert:nowiki",
    "insert:code",
    "insert:quotes",
    "insert:ref",
    "insert:template",
    "custom-action",
  ],

  setup() {
    return {
      // Icons
      cdxIconBold,
      cdxIconCode,
      cdxIconItalic,
      cdxIconNoWikitext,
      cdxIconPuzzle,
      cdxIconQuotes,
      cdxIconReference,
      cdxIconSubscript,
      cdxIconSuperscript,
      cdxIconWikitext,
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
      &nbsp;
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Mettre en exposant"
        title="Mettre en exposant"
        size="small"
        @click="$emit('insert:superscript')"
      >
        <cdx-icon :icon="cdxIconSuperscript"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Mettre en indice"
        title="Mettre en indice"
        size="small"
        @click="$emit('insert:subscript')"
      >
        <cdx-icon :icon="cdxIconSubscript"></cdx-icon>
      </cdx-button>
      &nbsp;
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer un lien"
        title="Insérer un lien"
        size="small"
        @click="$emit('insert:link')"
      >
        <cdx-icon :icon="cdxIconWikitext"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer des balises <nowiki>"
        title="Insérer des balises <nowiki>"
        size="small"
        @click="$emit('insert:nowiki')"
      >
        <cdx-icon :icon="cdxIconNoWikitext"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer des balises <code>"
        title="Insérer des balises <code>"
        size="small"
        @click="$emit('insert:code')"
      >
        <cdx-icon :icon="cdxIconCode"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer des guillemets"
        title="Insérer des guillemets"
        size="small"
        @click="$emit('insert:quotes')"
      >
        <cdx-icon :icon="cdxIconQuotes"></cdx-icon>
      </cdx-button>
      &nbsp;
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer une référence"
        title="Insérer une référence"
        size="small"
        @click="$emit('insert:ref')"
      >
        <cdx-icon :icon="cdxIconReference"></cdx-icon>
      </cdx-button>
      <cdx-button
        v-if="$props.showTemplateButton"
        class="format-btn"
        type="button"
        aria-label="Insérer un modèle"
        title="Insérer un modèle"
        size="small"
        @click="$emit('insert:template')"
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
      &nbsp;
    </template>
    <template v-for="(chars, i) in $props.characters" :key="i">
      <span v-if="i > 0" class="separator">—</span>
      <a
        v-for="(char, j) in chars"
        :key="j"
        href="#"
        :aria-label="`Insérer un ${char}`"
        title="Cliquer pour insérer le caractère"
        @click.prevent="$emit('insert:char', char)"
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
