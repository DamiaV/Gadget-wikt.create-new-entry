<script>
// <nowiki>
import {
  CdxButton,
  CdxField,
  CdxIcon,
  CdxSelect,
  CdxTextInput,
} from "@wikimedia/codex";
import { computed, defineComponent, ref, watch } from "vue";
import {
  cdxIconAdd,
  cdxIconHelpNotice,
  cdxIconSettings,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import languages from "../languages.js";
import strings from "../strings.js";
import types from "../types.js";
import WikiLink from "./WikiLink.vue";

/**
 * @typedef {{
 *  wordType: string,
 *  properties: Record<string, string>,
 *  plural: string,
 *  genderEquivalents: [string, string[]][],
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
    CdxButton,
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
    const genderEquivalents = ref(props.modelValue.genderEquivalents);

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

    const showGenderEquivForm = computed(
      () => wordType.value === languages.GRAMMATICAL_CLASSES.NOUN.sectionCode
    );

    function fireUpdateEvent() {
      /**
       * @type {WordProperties}
       */
      const firedEvent = {
        wordType: wordType.value,
        properties: wordProperties.value,
        plural: plural.value.trim(),
        genderEquivalents: genderEquivalents.value,
      };
      ctx.emit("update:model-value", firedEvent);
    }

    /*
     * Word properties
     */

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

    /*
     * Gender equivalents
     */

    function onAddGenderEquiv() {
      genderEquivalents.value.push(["", [""]]);
      fireUpdateEvent();
    }

    function onDeleteGenderEquiv(genderIndex) {
      genderEquivalents.value.splice(genderIndex, 1);
      fireUpdateEvent();
    }

    function onAddEquiv(genderIndex) {
      genderEquivalents.value[genderIndex][1].push("");
      fireUpdateEvent();
    }

    function onDeleteEquiv(genderIndex, valueIndex) {
      genderEquivalents.value[genderIndex][1].splice(valueIndex, 1);
      fireUpdateEvent();
    }

    return {
      // Data
      wordTypesData,
      wordTypePropertiesData,
      wordType,
      wordProperties,
      plural,
      genderEquivalents,
      // Visual
      wordTypeStatus,
      wordPropertiesStatuses,
      showGenderEquivForm,
      // Other
      NUMBERS: languages.NUMBERS,
      GRAMMATICAL_CLASSES: languages.GRAMMATICAL_CLASSES,
      GENDERS: languages.GENDERS,
      // Icons
      cdxIconAdd,
      cdxIconHelpNotice,
      cdxIconSettings,
      cdxIconTrash,
      // Callbacks
      onWordTypeSelection,
      onWordPropertySelection,
      onAddGenderEquiv,
      onDeleteGenderEquiv,
      onAddEquiv,
      onDeleteEquiv,
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
            wordType === GRAMMATICAL_CLASSES.PREPOSITION.sectionCode
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

    <cdx-field v-show="showGenderEquivForm" is-fieldset class="cne-box">
      <template #label>Équivalents pour d’autres genres/sexes</template>
      <div class="cdx-label">
        <div class="cdx-label__description">
          Si ce mot désigne une personne ou un animal, donnez l’équivalent dans
          d’autres genres et/ou sexes s’il y en a.
        </div>
      </div>
      <div class="cne-gender-equiv-forms">
        <div
          v-for="([text, values], i) in genderEquivalents"
          :key="i"
          class="cne-gender-equiv-form"
        >
          <cdx-field class="gender-text">
            <template #label>Genre ou sexe concerné</template>
            <template #description>
              Le texte doit être de la forme <em>déterminant + nom</em>, comme
              «&nbsp;une femme&nbsp;» ou «&nbsp;un chien&nbsp;».
            </template>
            <cdx-text-input
              :model-value="text"
              placeholder="Ex.&nbsp;: une femme"
              @update:model-value="
                genderEquivalents[i][0] = $event;
                fireUpdateEvent();
              "
            ></cdx-text-input>
            <cdx-button
              type="button"
              action="destructive"
              aria-label="Supprimer"
              title="Supprimer"
              @click="onDeleteGenderEquiv(i)"
            >
              <cdx-icon :icon="cdxIconTrash"></cdx-icon>
            </cdx-button>
          </cdx-field>
          <ul>
            <li v-for="(value, j) in values" :key="j">
              <cdx-field>
                <template #label>
                  Mot équivalent <abbr title="numéro">n<sup>o</sup></abbr>
                  {{ j + 1 }}
                </template>
                <cdx-text-input
                  :model-value="value"
                  @update:model-value="
                    genderEquivalents[i][1][j] = $event;
                    fireUpdateEvent();
                  "
                ></cdx-text-input>
                <cdx-button
                  type="button"
                  action="destructive"
                  aria-label="Supprimer"
                  title="Supprimer"
                  :disabled="values.length === 1"
                  @click="onDeleteEquiv(i, j)"
                >
                  <cdx-icon :icon="cdxIconTrash"></cdx-icon>
                </cdx-button>
              </cdx-field>
            </li>
            <li>
              <cdx-button
                type="button"
                action="progressive"
                :disabled="genderEquivalents[i][1].length >= 6"
                @click="onAddEquiv(i)"
              >
                <cdx-icon :icon="cdxIconAdd"></cdx-icon>
                Ajouter un autre équivalent
              </cdx-button>
            </li>
          </ul>
        </div>
      </div>
      <cdx-button
        type="button"
        action="progressive"
        :disabled="genderEquivalents.length >= 2"
        @click="onAddGenderEquiv"
      >
        <cdx-icon :icon="cdxIconAdd"></cdx-icon>
        Ajouter un {{ genderEquivalents.length >= 1 ? "autre" : "" }} genre
      </cdx-button>
    </cdx-field>
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

.cne-gender-equiv-forms {
  display: flex;
  gap: 1em;
  flex-direction: row;
}

.cne-gender-equiv-form {
  flex-grow: 1;
}

.cne-gender-equiv-form .gender-text .cdx-field__control,
.cne-gender-equiv-form ul li .cdx-field__control {
  display: flex;
  gap: 0.5em;
  margin: 0.5em 0;
}

.cne-gender-equiv-form ul {
  margin-top: 0;
  list-style-type: none;
}

/* </nowiki> */
</style>
