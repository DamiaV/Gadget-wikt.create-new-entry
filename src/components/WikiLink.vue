<!-- <nowiki> -->
<script>
import { computed, defineComponent } from "vue";
import L from "../wiki_deps/wikt.core.languages.js";
import T from "../types.js";

export default defineComponent({
  props: {
    /**
     * @type {import("vue").PropType<import("../types.js").Wiki>}
     */
    wiki: { type: Object, default: () => T.wikis.wiktionary },
    wikiLanguage: { type: String, default: "fr" },
    pageTitle: { type: String, required: true },
    /**
     * @type {import("vue").PropType<Record<string, any> | null>}
     */
    urlParams: { type: Object, default: null },
    anchor: { type: String, default: "" },
    openInNewTab: { type: Boolean, default: true },
  },

  setup(props) {
    const language = computed(() => L.getLanguage(props.wikiLanguage, true));

    return {
      // Data
      language,
      // Functions
      getWikiUrl: T.getWikiUrl,
    };
  },
});
</script>

<template>
  <a
    :title="
      ($props.wiki.interwikiCode !== 'wikt'
        ? `${$props.wiki.interwikiCode}:`
        : '') +
      ($props.wikiLanguage !== 'fr'
        ? `${(language && language.wikimediaCode) || $props.wikiLanguage}:`
        : '') +
      $props.pageTitle +
      ($props.openInNewTab ? ' (S’ouvre dans un nouvel onglet)' : '')
    "
    :href="
      getWikiUrl(
        $props.wiki,
        (language && language.wikimediaCode) || $props.wikiLanguage,
        $props.pageTitle,
        $props.urlParams,
        $props.anchor
      )
    "
    :target="$props.openInNewTab ? '_blank' : '_self'"
    ><slot>{{ $props.pageTitle }}</slot></a
  >
</template>
<!-- </nowiki> -->
