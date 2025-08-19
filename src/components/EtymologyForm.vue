<!-- <nowiki» -->
<script>
import { defineComponent, ref } from "vue";
import { CdxField, CdxIcon } from "@wikimedia/codex";
import { cdxIconHelpNotice, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import T from "../types.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxField,
    CdxIcon,
    InputWithToolbar,
    WikiLink,
  },

  props: {
    language: { type: T.Language, required: true },
    modelValue: { type: String, required: true },
  },

  emits: ["update:model-value"],

  setup(props) {
    const text = ref(props.modelValue);

    /**
     * @type {import("./EditTools.vue").CustomAction[]}
     */
    const actions = [
      {
        name: "Date",
        title: "Insérer le modèle {{date}}",
        action: (selection) =>
          `{{date|${selection}|lang=${props.language.code}}}`,
      },
      {
        name: "Siècle",
        title: "Insérer le modèle {{siècle}}",
        action: (selection) =>
          `{{siècle|${selection}|lang=${props.language.code}}}`,
      },
      {
        name: "Composition",
        title: "Insérer le modèle {{composé de}}",
        action: (selection) =>
          `{{composé de|${selection}|<!-- mot 2 -->|lang=${props.language.code}}}`,
      },
      {
        name: "Étyl",
        title: "Insérer le modèle {{étyl}}",
        action: (selection) =>
          `{{étyl|<!-- langue d’origine -->|${props.language.code}|${selection}}}`,
      },
    ];

    return {
      // Data
      text,
      actions,
      // Icons
      cdxIconHelpNotice,
      cdxIconInfoFilled,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-box" is-fieldset>
    <template #label>
      <span class="cne-fieldset-btns">
        <wiki-link page-title="Aide:Étymologies">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>

        <wiki-link page-title="Convention:Étymologie">
          <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
        </wiki-link>
      </span>
    </template>
    <input-with-toolbar
      v-model="text"
      :custom-actions="actions"
      text-area
      @update:model-value="$emit('update:model-value', $event)"
    ></input-with-toolbar>
  </cdx-field>
</template>
<!-- </nowiki> -->
