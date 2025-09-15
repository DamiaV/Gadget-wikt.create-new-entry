<!-- <nowiki> -->
<script>
import { CdxField, CdxIcon, CdxSelect } from "@wikimedia/codex";
import { computed, defineComponent, ref, watch } from "vue";
import { cdxIconHelpNotice, cdxIconSettings } from "@wikimedia/codex-icons";
import T from "../types.js";
import utils from "../utils.js";
import WikiLink from "./WikiLink.vue";

/**
 * @typedef {{
 *  wordType: string,
 *  properties: string[],
 * }} WordProperties
 */

export default defineComponent({
  components: {
    CdxField,
    CdxSelect,
    CdxIcon,
    WikiLink,
  },

  props: {
    language: { type: T.Language, required: true },
    /**
     * @type {import("vue").PropType<WordProperties>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const wordType = ref(props.modelValue.wordType);
    const wordProperties = ref(props.modelValue.properties);

    const wordTypesData = computed(() => {
      /**
       * @type {import("@wikimedia/codex").MenuItemData[]}
       */
      const items = [];
      for (const [code, data] of Object.entries(props.language.grammarItems)) {
        items.push({
          label: data.grammaticalClass.label,
          value: code,
        });
      }
      return items;
    });

    const wordTypePropertiesData = computed(() => {
      /**
       * @type {Record<string, import("@wikimedia/codex").MenuItemData[][]>}
       */
      const items = {};
      for (const [code, item] of Object.entries(props.language.grammarItems)) {
        /**
         * @type {import("@wikimedia/codex").MenuItemData[][]}
         */
        const props_ = [];
        for (const properties of Object.values(item.properties)) {
          /**
           * @type {import("@wikimedia/codex").MenuItemData[]}
           */
          const props__ = [];
          for (const property of properties) {
            props__.push({
              value: property.label,
            });
          }
          props_.push(props__);
        }
        items[code] = props_;
      }
      return items;
    });

    watch(wordTypesData, () => {
      wordType.value = "";
      wordTypeStatus.value = "error";
      fireUpdateEvent();
    });

    const wordTypeStatus = ref("error");

    /**
     * @type {import("vue").Ref<string[]>}
     */
    const wordPropertiesStatuses = ref([]);

    function fireUpdateEvent() {
      /**
       * @type {WordProperties}
       */
      const firedEvent = {
        wordType: wordType.value,
        properties: wordProperties.value,
      };
      ctx.emit("update:model-value", firedEvent);
    }

    function onWordTypeSelection() {
      wordTypeStatus.value = "default";

      wordProperties.value.length = 0;

      const propertiesLists = props.language.getGrammarItem(
        wordType.value
      ).properties;
      const selectedIndices = [];
      Object.values(propertiesLists).forEach((properties, i) => {
        if (properties.length === 1) {
          wordProperties.value[i] = properties[0].label;
          selectedIndices.push(i);
        }
      });

      const newLength = wordTypePropertiesData.value[wordType.value].length;
      wordPropertiesStatuses.value.length = newLength;
      for (let i = 0; i < wordPropertiesStatuses.value.length; i++) {
        wordPropertiesStatuses.value[i] = selectedIndices.includes(i)
          ? "default"
          : "error";
      }
      fireUpdateEvent();
    }

    /**
     * @param {number} index Index of the CdxSelect that fired the event.
     * @param {string} value The selected value.
     */
    function onWordPropertySelection(index, value) {
      wordPropertiesStatuses.value[index] = "default";
      wordProperties.value[index] = value;
      fireUpdateEvent();
    }

    return {
      // Data
      wordTypesData,
      wordTypePropertiesData,
      wordType,
      wordProperties,
      // Visual
      wordTypeStatus,
      wordPropertiesStatuses,
      // Icons
      cdxIconHelpNotice,
      cdxIconSettings,
      // Other
      utils,
      // Callbacks
      onWordTypeSelection,
      onWordPropertySelection,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-word-type-form cne-box" is-fieldset>
    <template #label>
      <cdx-icon :icon="cdxIconSettings"></cdx-icon>
      Type de mot
      <span class="cne-fieldset-btns">
        <wiki-link page-title="Aide:Catégories grammaticales">
          <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
        </wiki-link>
      </span>
    </template>

    <div class="cne-word-type-selects">
      <cdx-field :status="wordTypeStatus">
        <template #label>Classe grammaticale</template>
        <cdx-select
          v-model:selected="wordType"
          :menu-items="wordTypesData"
          default-label="Choisissez une option"
          @update:selected="onWordTypeSelection"
        ></cdx-select>
      </cdx-field>

      <template v-if="wordType && $props.language.getGrammarItem(wordType)">
        <cdx-field
          v-for="(key, i) in Object.keys(
            $props.language.getGrammarItem(wordType).properties
          )"
          v-show="wordTypePropertiesData[wordType][i].length > 1"
          :key="key"
          :status="wordPropertiesStatuses[i]"
        >
          <template #label>{{ utils.capitalize(key) }}</template>
          <cdx-select
            :selected="wordProperties[i] || ''"
            :menu-items="wordTypePropertiesData[wordType][i]"
            default-label="Choisissez une option"
            @update:selected="onWordPropertySelection(i, $event)"
          ></cdx-select>
        </cdx-field>
      </template>
    </div>
  </cdx-field>
</template>

<style>
.cne-word-type-form {
  margin-bottom: 1em;
}

.cne-word-type-selects {
  display: flex;
  gap: 1em;
}

.cne-word-type-selects .cdx-field {
  margin-top: 0;
}
</style>
<!-- </nowiki> -->
