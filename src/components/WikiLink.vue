<script>
// <nowiki>
import { computed, defineComponent } from "vue";
import languages from "../wiki_deps/wikt.core/languages.js";
import types from "../types.js";

// </nowiki>
/**
 * A component that create a link to a wiki page.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/WikiLink.vue]]
 */
// <nowiki>
export default defineComponent({
  props: {
    /**
     * The target wiki’s data.
     * Defaults to `wiktionary`.
     * @type {import("vue").PropType<import("../types.js").Wiki>}
     */
    wiki: { type: Object, default: () => types.wikis.wiktionary },
    /**
     * The target wikis’ MediaWiki language code.
     * Defaults to `"fr"`.
     */
    wikiLanguage: { type: String, default: "fr" },
    /**
     * The title of the target page.
     */
    pageTitle: { type: String, required: true },
    /**
     * Optional URL GET parameters to append to the link’s URL.
     * @type {import("vue").PropType<Record<string, any> | null>}
     */
    urlParams: { type: Object, default: null },
    /**
     * Optional anchor to append to the link’s URL.
     */
    anchor: { type: String, default: "" },
    /**
     * Whether to open the link in a new tab.
     * Defaults to true.
     */
    openInNewTab: { type: Boolean, default: true },
  },

  setup(props) {
    const language = computed(() =>
      languages.getLanguage(props.wikiLanguage, true)
    );

    return {
      // Data
      language,
      // Functions
      getWikiUrl: types.getWikiUrl,
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

<style>
/* </nowiki> */
</style>
