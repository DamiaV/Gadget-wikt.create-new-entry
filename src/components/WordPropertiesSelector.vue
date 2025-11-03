<script>
// <nowiki>
import { CdxField, CdxIcon, CdxSelect, CdxTextInput } from "@wikimedia/codex";
import { computed, defineComponent, ref, watch } from "vue";
import { cdxIconHelpNotice, cdxIconSettings } from "@wikimedia/codex-icons";
import languages from "../languages.js";
import strings from "../strings.js";
import types from "../types.js";
import WikiLink from "./WikiLink.vue";

/**
 * @typedef {{
 *  wordType: string,
 *  properties: Record<string, string>,
 *  plural: string,
 * }} WordProperties
 */

// </nowiki>
/**
 * A component to select grammatical properties in a given language.
 * It features a dropdown selector to choose a grammatical class and
 * dynamic dropdown selectors to choose the properties of the selected class.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/WordPropertiesSelector.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxField,
    CdxIcon,
    CdxSelect,
    CdxTextInput,
    WikiLink,
  },

  props: {
    /**
     * The currently selected language.
     */
    language: { type: types.Language, required: true },
    /**
     * The WordProperties object to manage.
     * @type {import("vue").PropType<WordProperties>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const wordType = ref(props.modelValue.wordType);
    const wordProperties = ref(props.modelValue.properties);
    const plural = ref(props.modelValue.plural);

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
     * @type {import("vue").Ref<Record<string, string>>}
     */
    const wordPropertiesStatuses = ref({});

    function fireUpdateEvent() {
      /**
       * @type {WordProperties}
       */
      const firedEvent = {
        wordType: wordType.value,
        properties: wordProperties.value,
        plural: plural.value.trim(),
      };
      ctx.emit("update:model-value", firedEvent);
    }

    function onWordTypeSelection() {
      wordTypeStatus.value = "default";
      wordPropertiesStatuses.value = {};
      wordProperties.value = {};
      plural.value = "";

      const propertiesLists = props.language.getGrammarItem(
        wordType.value
      ).properties;
      Object.entries(propertiesLists).forEach(([propertyType, properties]) => {
        if (properties.length === 1) {
          wordProperties.value[propertyType] = properties[0].label;
          wordPropertiesStatuses.value[propertyType] = "default";
        } else wordPropertiesStatuses.value[propertyType] = "error";
      });

      fireUpdateEvent();
    }

    /**
     * @param {number} propertyType Type of the CdxSelect that fired the event.
     * @param {string} value The selected value.
     */
    function onWordPropertySelection(propertyType, value) {
      wordPropertiesStatuses.value[propertyType] = "default";
      wordProperties.value[propertyType] = value;
      fireUpdateEvent();
    }

    return {
      // Data
      wordTypesData,
      wordTypePropertiesData,
      wordType,
      wordProperties,
      plural,
      // Visual
      wordTypeStatus,
      wordPropertiesStatuses,
      // Other
      NUMBERS: languages.NUMBERS,
      GRAMMATICAL_CLASSES: languages.GRAMMATICAL_CLASSES,
      GENDERS: languages.GENDERS,
      // Icons
      cdxIconHelpNotice,
      cdxIconSettings,
      // Callbacks
      onWordTypeSelection,
      onWordPropertySelection,
      fireUpdateEvent,
      capitalize: strings.capitalize,
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
        <template
          v-for="(key, i) in Object.keys(
            $props.language.getGrammarItem(wordType).properties
          )"
          :key="key"
        >
          <cdx-field
            v-show="wordTypePropertiesData[wordType][i].length > 1"
            :status="wordPropertiesStatuses[key]"
          >
            <template #label>{{ capitalize(key) }}</template>
            <cdx-select
              :selected="wordProperties[key] || ''"
              :menu-items="wordTypePropertiesData[wordType][i]"
              default-label="Choisissez une option"
              @update:selected="onWordPropertySelection(key, $event)"
            ></cdx-select>
          </cdx-field>

          <cdx-field v-if="key === 'nombre' || key === 'accord'">
            <template #label>
              {{
                [
                  NUMBERS.COLLECTIVE_SINGULATIVE.label,
                  NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL.label,
                ].includes(wordProperties[key])
                  ? "Singulatif du mot"
                  : wordProperties[key] ===
                      NUMBERS.SINGULATIVE_DUAL_PLURAL.label
                    ? "Duel du mot"
                    : key === "accord"
                      ? "Autre forme du mot"
                      : "Pluriel du mot (si nécessaire)"
              }}
            </template>
            <cdx-text-input
              v-model="plural"
              :disabled="
                ![
                  NUMBERS.DIFF_SINGULAR_PLURAL.label,
                  NUMBERS.COLLECTIVE_SINGULATIVE.label,
                  NUMBERS.COLLECTIVE_SINGULATIVE_PLURAL.label,
                  NUMBERS.SINGULATIVE_DUAL_PLURAL.label,
                  GENDERS.FEMININE_MASCULINE_DIFF.label,
                ].includes(wordProperties[key])
              "
              @update:model-value="fireUpdateEvent()"
            ></cdx-text-input>
          </cdx-field>
        </template>

        <cdx-field
          v-if="
            $props.language.code === 'br' &&
            wordType === GRAMMATICAL_CLASSES.PREPOSITION.label
          "
        >
          <template #label>Type de conjugaison</template>
          <cdx-text-input
            v-model="plural"
            @update:model-value="fireUpdateEvent()"
          ></cdx-text-input>
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
/* </nowiki> */
</style>
