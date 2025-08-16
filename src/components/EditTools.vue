<!-- <nowiki> -->
<script>
import { defineComponent } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconBold, cdxIconItalic } from "@wikimedia/codex-icons";
import W from "../wikitext.js";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
  },

  props: {
    showFormatButtons: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<string[][]>}
     */
    characters: { type: Array, default: () => [W.specialCharacters] },
  },

  emits: ["style:bold", "style:italic", "insert-char"],

  setup() {
    return {
      cdxIconBold,
      cdxIconItalic,
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
  margin-bottom: 0.25em;
}

.cne-edit-tools .format-btn,
.cne-edit-tools .separator,
.cne-edit-tools a {
  margin-right: 0.25em;
}
</style>
<!-- </nowiki> -->
