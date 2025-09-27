<script>
// <nowiki>
import { defineComponent } from "vue";
import { CdxIcon } from "@wikimedia/codex";
import { cdxIconEllipsis } from "@wikimedia/codex-icons";

// </nowiki>
/**
 * A component that shows some text. Meant to be used to show a preview of a collapsed component.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/CollapsedPreview.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxIcon,
  },

  props: {
    /**
     * The text to show.
     */
    text: { type: String, default: "" },
  },

  setup() {
    return {
      // Icons
      cdxIconEllipsis,
    };
  },
});
</script>

<template>
  <div class="cne-collapsed-preview">
    <cdx-icon :icon="cdxIconEllipsis" title="Contenu caché"></cdx-icon>
    <span class="cne-collapsed-preview-text">{{ $props.text }}</span>
    <slot></slot>
  </div>
</template>

<style>
.cne-collapsed-preview {
  display: flex;
  gap: 1em;
  align-items: center;
}

.cne-collapsed-preview-text {
  color: gray;
}
/* </nowiki> */
</style>
