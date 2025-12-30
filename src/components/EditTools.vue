<script>
// <nowiki>
import { defineComponent } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconBold,
  cdxIconCode,
  cdxIconItalic,
  cdxIconLink,
  cdxIconLinkExternal,
  cdxIconNoWikitext,
  cdxIconPuzzle,
  cdxIconQuotes,
  cdxIconReference,
  cdxIconSubscript,
  cdxIconSuperscript,
  cdxIconWikitext,
} from "@wikimedia/codex-icons";
import wikitext from "../wikitext.js";

/**
 * @typedef {{
 *  name: string,
 *  title: string,
 *  icon?: string,
 *  iconOnly?: boolean,
 *  action: (selectedText: string) => string,
 * }} CustomAction
 */

// </nowiki>
/**
 * A toolbar with buttons to format the text of an associated text input or insert wikitext/characters into it.
 *
 * @see [[MediaWiki:Gadget-wikt.create-new-entry/components/InputWithToolbar.vue]]
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/EditTools.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
  },

  props: {
    /**
     * Whether to show the text-formatting buttons. If set to false, the template button will be hidden as well.
     * Defaults to true.
     */
    showFormatButtons: { type: Boolean, default: true },
    /**
     * Whether to show the template button. The showFormatButtons property needs to be set to true for this setting to work.
     * Defaults to true.
     */
    showTemplateButton: { type: Boolean, default: true },
    /**
     * An optional array of custom actions. Each action will be associated to a button.
     * @type {import("vue").PropType<CustomAction[]>}
     */
    customActions: { type: Array, default: () => [] },
    /**
     * A list of insertable characters to show after the buttons.
     * Defaults to a list of useful French characters.
     * @type {import("vue").PropType<string[][]>}
     */
    characters: { type: Array, default: () => [wikitext.specialCharacters] },
  },

  emits: [
    "style:bold",
    "style:italic",
    "insert:char",
    "insert:superscript",
    "insert:subscript",
    "insert:link",
    "insert:ext-link",
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
      cdxIconLink,
      cdxIconLinkExternal,
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
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
        @click="$emit('insert:subscript')"
      >
        <cdx-icon :icon="cdxIconSubscript"></cdx-icon>
      </cdx-button>
      &nbsp;
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer un lien wiki"
        title="Insérer un lien wiki"
        size="small"
        tabindex="-1"
        @click="$emit('insert:link')"
      >
        <cdx-icon :icon="cdxIconLink"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer un lien externe"
        title="Insérer un lien externe"
        size="small"
        tabindex="-1"
        @click="$emit('insert:ext-link')"
      >
        <cdx-icon :icon="cdxIconLinkExternal"></cdx-icon>
      </cdx-button>
      <cdx-button
        class="format-btn"
        type="button"
        aria-label="Insérer des balises <nowiki>"
        title="Insérer des balises <nowiki>"
        size="small"
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
/* </nowiki> */
</style>
