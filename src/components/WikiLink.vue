<!-- <nowiki> -->
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    pageTitle: { type: String, required: true },
    anchor: { type: String, default: "" },
    openInNewTab: { type: Boolean, default: true },
  },
});
</script>

<template>
  <a
    :title="
      $props.pageTitle +
      ($props.openInNewTab ? ' (S’ouvre dans un nouvel onglet)' : '')
    "
    :href="
      '/wiki/' +
      encodeURIComponent($props.pageTitle.replaceAll(' ', '_')) +
      ($props.anchor ? '#' + $props.anchor : '')
    "
    :target="$props.openInNewTab ? '_blank' : '_self'"
    ><slot>{{ $props.pageTitle }}</slot></a
  >
</template>
<!-- </nowiki> -->
