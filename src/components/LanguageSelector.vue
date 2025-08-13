<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxCombobox, CdxField } from "@wikimedia/codex";
import T from "../types.js";
import L from "../languages.js";

export default defineComponent({
  components: {
    CdxField,
    CdxCombobox,
  },
  props: {
    /**
     * @type {import("vue").PropType<import("../types.js").Language[]>}
     */
    languages: { type: Array, required: true },
    modelValue: { type: T.Language, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const languages = {};
    /**
     * @type {import("vue").Ref<import("@wikimedia/codex").MenuItemData[]>}
     */
    const languageItems = ref([]);

    for (const language of props.languages) {
      languages[language.code] = language;
      languageItems.value.push({
        label: language.name,
        value: language.code,
        description: `code\u00a0: ${language.code}${!language.isSupported ? " (support minimal)" : ""}`,
      });
    }

    const langCode = ref(props.modelValue.code);

    /**
     * @param {string} code The selected language code.
     */
    function onLanguageSelection(code) {
      if (!code || !languages[code]) {
        const language = L.getDefaultLanguage(code, code);
        console.log(language);
        languages[code] = language;
        languageItems.value.push({
          label: language.name,
          value: language.code,
          description: `code\u00a0: ${language.code}${!language.isSupported ? " (support minimal)" : ""}`,
        });
      }
      langCode.value = code;
      ctx.emit("update:model-value", languages[code]);
    }

    return {
      languageItems,
      langCode,
      onLanguageSelection,
    };
  },
});
</script>

<template>
  <cdx-field>
    <template #label>Langue</template>
    <template #description>La langue de l’entrée</template>
    <template #help-text>
      Si une langue n’est pas disponible dans la liste, tapez son code pour
      l’ajouter.
    </template>
    <cdx-combobox
      v-model:selected.trim="langCode"
      required
      :menu-items="languageItems"
      @update:selected="onLanguageSelection"
    ></cdx-combobox>
  </cdx-field>
</template>
<!-- </nowiki>-->
