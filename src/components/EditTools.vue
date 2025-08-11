<script>
import { defineComponent } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconBold, cdxIconItalic } from "../../icons.json";
import T from "../types.js";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
  },
  props: {
    language: { type: T.Language, required: true },
  },
  emits: ["style:bold", "style:italic", "insert-char"],
  setup(props) {
    console.log(props.language.ipaSymbols);
    return {
      cdxIconBold,
      cdxIconItalic,
    };
  },
});
</script>

<template>
  <div class="cne-edit-tools">
    <cdx-button aria-label="Gras" size="small" @click="$emit('style:bold')">
      <cdx-icon :icon="cdxIconBold"></cdx-icon>
    </cdx-button>
    <cdx-button
      aria-label="Italique"
      size="small"
      @click="$emit('style:italic')"
    >
      <cdx-icon :icon="cdxIconItalic"></cdx-icon>
    </cdx-button>
    <template v-if="$props.language.ipaSymbols.length != 0">
      <template v-for="(chars, i) in $props.language.ipaSymbols" :key="i">
        <template v-if="i > 0">—</template>
        <cdx-button
          v-for="(char, j) in chars"
          :key="j"
          size="small"
          weight="quiet"
          @click="$emit('insert-char', char)"
        >
          {{ char }}
        </cdx-button>
      </template>
    </template>
  </div>
</template>
