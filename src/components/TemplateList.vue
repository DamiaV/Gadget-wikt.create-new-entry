<!-- <nowiki> -->
<script>
import { CdxMenuItem } from "@wikimedia/codex";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    CdxMenuItem,
  },

  props: {
    /**
     * @type {import("vue").PropType<import("../templates.js").TemplateData[]>}
     */
    templates: { type: Array, required: true },
  },

  emits: ["select"],
});
</script>

<template>
  <ul class="cne-templates-list">
    <cdx-menu-item
      v-for="template in $props.templates"
      :id="`template-${template.name}`"
      :key="template.name"
      :value="template.name"
      :description="template.description || ''"
      @click="$emit('select', template)"
    ></cdx-menu-item>
  </ul>
</template>

<style>
.cne-templates-list {
  margin: 0;
  padding: 0;
}

.cne-templates-list .cdx-menu-item {
  cursor: pointer;
}
.cne-templates-list .cdx-menu-item:hover {
  background-color: var(--background-color-interactive-subtle--hover, #eaecf0);
}
</style>
<!-- </nowiki> -->
