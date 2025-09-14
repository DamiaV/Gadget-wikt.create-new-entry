<script>
import { defineComponent, inject, reactive } from "vue";
import {
  CdxField,
  CdxIcon,
  CdxTextInput,
  CdxToggleSwitch,
} from "@wikimedia/codex";
import { cdxIconSearch } from "@wikimedia/codex-icons";
import T from "../types.js";

export default defineComponent({
  components: {
    CdxIcon,
    CdxField,
    CdxTextInput,
    CdxToggleSwitch,
  },

  props: {
    /**
     * @type {import("vue").PropType<{ [wikiName: string]: import("../types.js").ExternalWikiLink }>}
     */
    modelValue: { type: Object, required: true },
    language: { type: T.Language, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const wikiLinks = reactive(props.modelValue);

    /**
     * Update the wiki link with the given ID.
     * @param {string} wikiId The ID of the wiki link to update.
     * @param {string} propertyName The name of the property to update.
     * @param {string} text The value to assign to the property.
     */
    function onWikiLinkUpdate(wikiId, propertyName, text) {
      wikiLinks[wikiId][propertyName] = text.trim();
      ctx.emit("update:model-value", wikiLinks);
    }

    /**
     * Enable/disable the wiki link with the given ID.
     * @param {string} wikiId The ID of the wiki link to update.
     * @param {string} enabled Whether to enable the link.
     */
    function onWikiLinkToggle(wikiId, enabled) {
      wikiLinks[wikiId].enabled = enabled;
      ctx.emit("update:model-value", wikiLinks);
    }

    /**
     * @type {import("./types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      wikiLinks,
      // Other
      config,
      wikis: T.wikis,
      // Icons
      cdxIconSearch,
      // Callbacks
      onWikiLinkUpdate,
      onWikiLinkToggle,
    };
  },
});
</script>

<template>
  <div class="cne-wiki-links">
    <template v-for="(wiki, key) in wikis" :key="key">
      <cdx-field
        v-if="
          key !== 'wiktionary' &&
          (!wiki.showOnlyForLangs ||
            wiki.showOnlyForLangs.includes(
              $props.language.wikimediaCode || $props.language.code
            ))
        "
      >
        <template #label>
          <cdx-icon :icon="wiki.icon"></cdx-icon>
          {{ wiki.label }}
          <span class="cne-fieldset-btns">
            <a
              :href="`https://${wiki.urlDomain.replace('{}', $props.language.wikimediaCode || $props.language.code)}/${wiki.urlBase}/Special:Search/${encodeURIComponent(config.word)}`"
              :title="`Rechercher «\u00a0${config.word}\u00a0» sur ${wiki.label} (S’ouvre dans un nouvel onglet)`"
              target="_blank"
            >
              <cdx-icon :icon="cdxIconSearch"></cdx-icon>
            </a>
          </span>
        </template>
        <div class="cne-wiki-link-fields">
          <cdx-toggle-switch
            :model-value="wikiLinks[key].enabled"
            :aria-label="wikiLinks[key].enabled ? 'Désactiver' : 'Activer'"
            :title="wikiLinks[key].enabled ? 'Désactiver' : 'Activer'"
            @update:model-value="onWikiLinkToggle(key, $event)"
          ></cdx-toggle-switch>
          <cdx-text-input
            :model-value="wikiLinks[key].pageTitle"
            :disabled="!wikiLinks[key].enabled"
            :placeholder="
              wiki.placeholder || 'Titre de la page cible si différent du mot'
            "
            :aria-label="
              wiki.placeholder || 'Titre de la page cible si différent du mot'
            "
            @update:model-value="onWikiLinkUpdate(key, 'pageTitle', $event)"
          ></cdx-text-input>
          <cdx-text-input
            v-if="!wiki.noText"
            :model-value="wikiLinks[key].text"
            :disabled="!wikiLinks[key].enabled"
            placeholder="Texte à afficher à la place du titre"
            aria-label="Texte à afficher à la place du titre"
            @update:model-value="onWikiLinkUpdate(key, 'text', $event)"
          ></cdx-text-input>
        </div>
      </cdx-field>
    </template>
  </div>
</template>
