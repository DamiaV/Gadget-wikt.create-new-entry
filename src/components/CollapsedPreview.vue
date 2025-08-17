<!-- <nowiki» -->
<script>
import { CdxIcon } from "@wikimedia/codex";
import { cdxIconEllipsis } from "@wikimedia/codex-icons";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    CdxIcon,
  },

  props: {
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
</style>
<!-- </nowiki> -->
