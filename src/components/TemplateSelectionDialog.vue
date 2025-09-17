<!-- <nowiki> -->
<script>
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
} from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxLookup,
  CdxSelect,
  CdxTab,
  CdxTabs,
  CdxTextArea,
  CdxTextInput,
} from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconLink,
  cdxIconPrevious,
  cdxIconSearch,
} from "@wikimedia/codex-icons";
import templates from "../templates.js";
import WikiLink from "./WikiLink.vue";
import PageLookup from "./PageLookup.vue";
import pages from "../pages.js";
import TemplateList from "./TemplateList.vue";

export default defineComponent({
  components: {
    CdxDialog,
    CdxLookup,
    CdxField,
    CdxIcon,
    CdxButton,
    CdxTextInput,
    CdxTextArea,
    CdxCheckbox,
    CdxSelect,
    CdxTabs,
    CdxTab,
    WikiLink,
    PageLookup,
    TemplateList,
  },

  props: {
    open: { type: Boolean, default: false },
  },

  emits: ["update:open", "insert"],

  setup() {
    /**
     * @type {import("vue").Reactive<import("../templates.js").FilledTemplate>}
     */
    const selectedTemplate = reactive({
      name: "",
      format: "",
      paramOrder: [],
      params: {},
    });

    /**
     * @type {Record<string, import("../templates.js").TemplateData>}
     */
    let templateDatas = {};
    /**
     * @type {import("vue").Ref<import("../templates.js").TemplateData | null>}
     */
    const selectedTemplateData = ref(null);

    const lookupSelection = ref("");
    /**
     * @type {import("vue").Ref<import("@wikimedia/codex").MenuItemData[]>}
     */
    const lookupItems = ref([]);

    /**
     * @type {import("@wikimedia/codex").MenuConfig}
     */
    const lookupConfig = {
      boldLabel: true,
      visibleItemLimit: 10,
    };

    const sortedParamNames = computed(() => {
      /**
       * @type {string[]}
       */
      const required = [];
      /**
       * @type {string[]}
       */
      const suggested = [];
      /**
       * @type {string[]}
       */
      const optional = [];
      /**
       * @type {string[]}
       */
      const deprecated = [];

      const paramOrder = selectedTemplateData.value.paramOrder;
      const keys = Object.keys(selectedTemplateData.value.params);
      keys.sort((k1, k2) => paramOrder.indexOf(k1) - paramOrder.indexOf(k2));

      for (const key of keys) {
        const def = selectedTemplateData.value.params[key];
        if (def.required) required.push(key);
        else if (def.suggested) suggested.push(key);
        else if (def.deprecated) deprecated.push(key);
        else optional.push(key);
      }

      return {
        required: {
          label: "Paramètres requis",
          keys: required,
        },
        suggested: {
          label: "Paramètres suggérés",
          keys: suggested,
        },
        optional: {
          label: "Paramètres optionels",
          keys: optional,
        },
        deprecated: {
          label: "Paramètres obsolètes",
          keys: deprecated,
        },
      };
    });
    const sortedSelectedParams = computed(() => {
      const keys = [];

      for (const [name, value] of Object.entries(selectedTemplate.params)) {
        keys.push({
          name,
          value,
          definition: selectedTemplateData.value.params[name],
        });
      }

      const paramOrder = selectedTemplate.paramOrder;
      keys.sort(
        (e1, e2) => paramOrder.indexOf(e1.name) - paramOrder.indexOf(e2.name)
      );

      return keys;
    });

    /**
     * @type {import("vue").Ref<import("../templates.js").TemplateData[]>}
     */
    const favoriteTemplates = ref([]);
    /**
     * @type {import("vue").Ref<import("../templates.js").TemplateData[]>}
     */
    const featuredTemplates = ref([]);

    const statuses = reactive({});
    const errorMessages = reactive({});

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    // Debounce timer
    let timer;

    /**
     * Filter items on input.
     * @param {string} value
     */
    function onInput(value) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (value) searchTemplates(value);
        else lookupItems.value = [];
      }, 300);
    }

    /**
     * Search for templates matching the query.
     * @param {string} query
     */
    function searchTemplates(query) {
      templates
        .searchTemplates(query, "fr")
        .then((results) => {
          templateDatas = {};
          /**
           * @type {import("@wikimedia/codex").MenuItemData[]}
           */
          const items = [];
          for (const result of results) {
            templateDatas[result.title] = result;
            items.push({
              label: result.name,
              value: result.title,
              description: result.description,
            });
          }
          query = query.toLocaleLowerCase();
          items.sort((i1, i2) => {
            const name1 = i1.label.toLocaleLowerCase();
            const name2 = i2.label.toLocaleLowerCase();
            if (name1.startsWith(query) && !name2.startsWith(query)) return -1;
            if (!name1.startsWith(query) && name2.startsWith(query)) return 1;
            return name1.localeCompare(name2);
          });
          lookupItems.value = items;
        })
        .catch((error) => {
          console.warn(error);
          lookupItems.value = [];
        });
    }

    /**
     * Called when the collapsible menu selection changes.
     * @param {string | null} templateName The selected code.
     */
    function onLookupSelection(templateName) {
      if (!templateName) return;
      selectTemplate(templateDatas[templateName]);
    }

    /**
     * Select the given template data and show the template form.
     * @param {import("../templates.js").TemplateData} templateData The template data.
     */
    function selectTemplate(templateData) {
      for (const key of Object.keys(selectedTemplate.params))
        delete selectedTemplate.params[key];

      selectedTemplateData.value = templateData;

      selectedTemplate.name = templateData.name;
      selectedTemplate.format = templates.parseTemplateFormat(
        templateData.format
      );
      selectedTemplate.paramOrder = templateData.paramOrder;

      for (const [paramName, paramDef] of Object.entries(templateData.params))
        if (paramDef.required) onToggleParam(paramName);
    }

    /**
     *
     * @param {string} name
     */
    function onToggleParam(name) {
      if (name in selectedTemplate.params) delete selectedTemplate.params[name];
      else {
        const param = selectedTemplateData.value.params[name];
        const autoValue = param.autoValue;
        let defaultValue;
        switch (param.type) {
          case "unknown":
          case "string":
          case "line":
          case "url":
          case "wiki-page-name":
          case "wiki-file-name":
          case "wiki-template-name":
          case "wiki-user-name":
          case "content":
          case "unbalanced-wikitext":
            defaultValue = autoValue || "";
            break;
          case "number":
            defaultValue = /^\d+(\.\d+)?$/.test(autoValue)
              ? Number(autoValue)
              : null;
            break;
          case "boolean":
            defaultValue = ![
              null,
              "",
              "0",
              "no",
              "non",
              "faux",
              "false",
            ].includes(autoValue);
            break;
          case "date":
            defaultValue =
              autoValue && /^\d{4}-\d\d-\d\d$/.test(autoValue) ? autoValue : "";
            break;
        }
        onParamValueChange(name, defaultValue, true);
      }
    }

    function resetSelection() {
      selectedTemplate.name = ""; // To disable submit button
      selectedTemplateData.value = null;
      lookupSelection.value = "";
      lookupItems.value = [];
      refreshFavoriteTemplates();
    }

    function refreshFavoriteTemplates() {
      templates
        .fetchFavoriteTemplates()
        .then((favTemplates) => (favoriteTemplates.value = favTemplates))
        .catch((error) => {
          console.warn(error);
        });
      templates
        .fetchFeaturedTemplates()
        .then((featTemplates) => (featuredTemplates.value = featTemplates))
        .catch((error) => {
          console.warn(error);
        });
    }

    /**
     * Set the value of the given parameter when the associated form input changes.
     * @param {string} name The parameter’s name.
     * @param {any} value The parameter’s new value.
     * @param {boolean?} errorAsWarning If true and the value is invalid, a warning will be shown instead of an error.
     */
    function onParamValueChange(name, value, errorAsWarning = false) {
      errorMessages[name] = { warning: "", error: "" };

      const paramStatus = isParamValueValid(name, value);
      const errorKey = errorAsWarning ? "warning" : "error";
      if (paramStatus === PARAM_VALID) {
        statuses[name] = "default";
      } else if (paramStatus === PARAM_INVALID) {
        statuses[name] = errorKey;
        errorMessages[name][errorKey] = "Valeur incorrecte";
      } else if (paramStatus === PARAM_EMPTY) {
        statuses[name] = errorKey;
        errorMessages[name][errorKey] = "Veuillez renseigner une valeur";
      }

      if (
        selectedTemplateData.value.params[name].type === "wiki-file-name" &&
        typeof value === "string"
      )
        value = pages.stripNamespace(value.trim(), config.namespaces);
      selectedTemplate.params[name] =
        typeof value === "string" ? value.trim() : value;
    }

    const PARAM_VALID = 0;
    const PARAM_INVALID = 1;
    const PARAM_EMPTY = 2;

    /**
     * Set the value of the given parameter when the associated form input changes.
     * @param {string} name The parameter’s name.
     * @param {any} value The parameter’s new value.
     * @returns {numben} True if the value is valid, false otherwise.
     */
    function isParamValueValid(name, value) {
      const paramData = selectedTemplateData.value.params[name];
      if (paramData.required && [undefined, null, ""].includes(value))
        return PARAM_EMPTY;

      let valid = true;
      switch (paramData.type) {
        case "number":
          valid = !value || /^\d+(\.\d+)?$/.test(value);
          break;
        case "date":
          valid = !value || /^\d{4}-\d\d-\d\d$/.test(value);
          break;
        case "url":
          valid = !value || /^https?:\/\/[^/]/.test(value);
          break;
      }
      return valid ? PARAM_VALID : PARAM_INVALID;
    }

    /**
     * Convert an array of values into menu items.
     * @param {(string | number)[]} values The values to convert into menu items.
     * @returns {import("@wikimedia/codex").MenuItemData[]}
     */
    function getMenuItems(values) {
      return values.map((value) => ({ value }));
    }

    const isTemplateValid = computed(
      () =>
        !!selectedTemplate.name &&
        Object.entries(selectedTemplate.params).every(
          ([name, value]) => isParamValueValid(name, value) === PARAM_VALID
        )
    );

    onMounted(() => {
      refreshFavoriteTemplates();
    });

    /**
     * @type {import("@wikimedia/codex").PrimaryModalAction}
     */
    const dialogPrimaryAction = computed(() => ({
      label: "Insérer",
      actionType: "progressive",
      disabled: !isTemplateValid.value,
    }));
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const dialogDefaultAction = {
      label: "Annuler",
    };

    return {
      // Data
      selectedTemplateData,
      selectedTemplate,
      sortedParamNames,
      sortedSelectedParams,
      lookupSelection,
      lookupItems,
      lookupConfig,
      isTemplateValid,
      favoriteTemplates,
      featuredTemplates,
      // Visual
      dialogPrimaryAction,
      dialogDefaultAction,
      statuses,
      errorMessages,
      // Icons
      cdxIconSearch,
      cdxIconLink,
      cdxIconAdd,
      cdxIconPrevious,
      // Callbacks
      resetSelection,
      onInput,
      onLookupSelection,
      selectTemplate,
      onToggleParam,
      onParamValueChange,
      getMenuItems,
    };
  },
});
</script>

<template>
  <cdx-dialog
    :open="$props.open"
    title="Sélectionner un modèle"
    class="cne-template-dialog"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @update:open="
      $emit('update:open', $event);
      resetSelection();
    "
    @primary="
      $emit('insert', selectedTemplate);
      $emit('update:open', false);
      resetSelection();
    "
    @default="
      $emit('update:open', false);
      resetSelection();
    "
  >
    <div v-show="!selectedTemplateData">
      <cdx-field>
        <template #label>Rechercher un modèle</template>
        <cdx-lookup
          v-model:selected.trim="lookupSelection"
          :menu-items="lookupItems"
          :menu-config="lookupConfig"
          :start-icon="cdxIconSearch"
          clearable
          placeholder="Saisissez le nom d’un modèle"
          @input="onInput"
          @update:selected="onLookupSelection"
        >
          <template #no-results>Aucun résultat.</template>
        </cdx-lookup>
      </cdx-field>

      <cdx-tabs class="cne-templates-tabs">
        <cdx-tab name="favorites" label="Favoris">
          Vous avez {{ favoriteTemplates.length }}/50 modèle{{
            favoriteTemplates.length > 1 ? "s" : ""
          }}
          en favoris.
          <template-list
            :templates="favoriteTemplates"
            @select="selectTemplate"
          ></template-list>
        </cdx-tab>
        <cdx-tab name="featured" label="En vedette">
          Modèles importants sélectionnés par la communauté
          <template-list
            :templates="featuredTemplates"
            @select="selectTemplate"
          ></template-list>
        </cdx-tab>
      </cdx-tabs>
    </div>

    <div v-if="selectedTemplateData" class="cne-template-form">
      <div class="cne-template-form-header">
        <wiki-link
          :page-title="selectedTemplateData.title"
          class="cne-template-link"
        >
          <cdx-icon :icon="cdxIconLink"></cdx-icon>
        </wiki-link>
        <h1>
          <cdx-button
            size="small"
            aria-label="Retour à la recherche"
            title="Retour à la recherche"
            @click="resetSelection"
          >
            <cdx-icon :icon="cdxIconPrevious"></cdx-icon>
          </cdx-button>
          {{ selectedTemplateData.name }}
        </h1>
        <p v-if="selectedTemplateData.description">
          {{ selectedTemplateData.description }}
        </p>
        <p
          v-else-if="selectedTemplateData.autoGenerated"
          class="no-template-data"
        >
          Puisque les
          <a
            href="https://www.mediawiki.org/wiki/Special:MyLanguage/Help:TemplateData"
            target="_blank"
            >données de modèle</a
          >
          sont absentes, les paramètres de ce modèle ont été générés
          automatiquement. Notez bien qu’ils peuvent ne pas correspondre
          exactement.
        </p>
        <p v-else class="no-template-data">Pas de description disponible.</p>
      </div>

      <div class="cne-template-form-body">
        <div class="cne-template-args">
          <span
            v-if="!Object.keys(selectedTemplateData.params).length"
            class="cne-template-arg-section"
          >
            Aucun paramètre
          </span>
          <template
            v-for="(section, sectionName) in sortedParamNames"
            :key="sectionName"
          >
            <template v-if="section.keys.length">
              <span class="cne-template-arg-section">{{ section.label }}</span>
              <ul>
                <template v-for="(key, i) in section.keys" :key="i">
                  <li
                    v-if="sectionName !== 'required'"
                    :class="[
                      'cne-template-arg',
                      key in selectedTemplate.params ? 'arg-added' : '',
                    ]"
                    :title="
                      key in selectedTemplate.params
                        ? 'Cliquer pour retirer'
                        : 'Cliquer pour ajouter'
                    "
                    @click="onToggleParam(key)"
                  >
                    {{ selectedTemplateData.params[key].label || key }}
                  </li>
                  <li v-else class="cne-template-arg arg-required">
                    {{ selectedTemplateData.params[key].label || key }}
                  </li>
                </template>
              </ul>
            </template>
          </template>
        </div>

        <div class="cne-template-fields">
          <cdx-field
            v-for="param in sortedSelectedParams"
            :key="param.name"
            :status="statuses[param.name]"
            :messages="errorMessages[param.name]"
          >
            <template #label>
              {{ param.definition.label || param.name }}
              <span
                v-if="param.definition.type === 'wiki-file-name'"
                class="cne-fieldset-btns"
              >
                <a
                  :href="`https://commons.wikimedia.org/wiki/Special:MediaSearch?search=${encodeURIComponent(param.value)}`"
                  target="_blank"
                  :title="`Chercher «\u00a0${param.value}\u00a0» un fichier sur Commons (S’ouvre dans un nouvel onglet)`"
                >
                  <cdx-icon :icon="cdxIconSearch"></cdx-icon>
                </a>
              </span>
            </template>
            <template v-if="param.definition.description" #description>
              {{ param.definition.description }}
            </template>
            <template v-if="param.definition.default" #help-text>
              Valeur par défaut&nbsp;: {{ param.definition.default }}
            </template>

            <cdx-select
              v-if="
                param.definition.suggestedValues.length &&
                [
                  'unknown',
                  'string',
                  'line',
                  'url',
                  'number',
                  'content',
                  'unbalanced-wikitext',
                ].includes(param.definition.type)
              "
              :selected="param.value"
              :menu-items="getMenuItems(param.definition.suggestedValues)"
              @update:selected="onParamValueChange(param.name, $event)"
            ></cdx-select>

            <cdx-text-input
              v-else-if="
                [
                  'unknown',
                  'string',
                  'line',
                  'url',
                  'number',
                  'wiki-file-name',
                ].includes(param.definition.type)
              "
              :model-value="param.value"
              :required="param.definition.required"
              :placeholder="
                param.definition.example
                  ? `Par ex.\u00a0: ${param.definition.example}`
                  : ''
              "
              clearable
              @update:model-value="onParamValueChange(param.name, $event)"
            ></cdx-text-input>

            <cdx-text-area
              v-else-if="
                ['content', 'unbalanced-wikitext'].includes(
                  param.definition.type
                )
              "
              :model-value="param.value"
              :required="param.definition.required"
              :placeholder="
                param.definition.example
                  ? `Par ex.\u00a0: ${param.definition.example}`
                  : ''
              "
              @update:model-value="onParamValueChange(param.name, $event)"
            ></cdx-text-area>

            <cdx-text-input
              v-else-if="param.definition.type === 'date'"
              :model-value="param.value"
              :required="param.definition.required"
              input-type="date"
              :placeholder="
                param.definition.example
                  ? `Par ex.\u00a0: ${param.definition.example}`
                  : ''
              "
              clearable
              @update:model-value="onParamValueChange(param.name, $event)"
            ></cdx-text-input>

            <cdx-checkbox
              v-else-if="param.definition.type === 'boolean'"
              :model-value="param.value"
              :aria-label="param.name"
              @update:model-value="onParamValueChange(param.name, $event)"
            ></cdx-checkbox>

            <page-lookup
              v-else-if="param.definition.type === 'wiki-user-name'"
              :model-value="param.value || ''"
              :namespaces="[2]"
              strip-namespace
              page-type="un·e utilisateurice"
              @update:model-value="onParamValueChange(param.name, $event)"
            ></page-lookup>

            <page-lookup
              v-else-if="param.definition.type === 'wiki-template-name'"
              :model-value="param.value || ''"
              :namespaces="[10]"
              allow-subpages
              strip-namespace
              page-type="un modèle"
              @update:model-value="onParamValueChange(param.name, $event)"
            ></page-lookup>

            <page-lookup
              v-else-if="param.definition.type === 'wiki-page-name'"
              :model-value="param.value || ''"
              allow-subpages
              page-type="une page"
              @update:model-value="onParamValueChange(param.name, $event)"
            ></page-lookup>

            <div v-else>
              Paramètres de type "{{ param.definition.type }}" non supportés.
              Ceci est un bug, vous pouvez le signaler sur
              <wiki-link
                page-title="Projet:Gadget de création d’entrées/Suggestions"
                >cette page</wiki-link
              >.
            </div>
          </cdx-field>
        </div>
      </div>
    </div>
  </cdx-dialog>
</template>

<style>
.cne-template-dialog {
  max-width: 50em;
  height: 40em;
}

.cne-templates-tabs .cdx-tab {
  padding: 0.5em;
}

.cne-template-form {
  height: 100%;
}

.cne-template-form-header {
  height: 6em;
  border-bottom: 1px solid var(--border-color-divider, gray);
}

.cne-template-form-header h1 {
  font-size: 1em;
  margin: 0 0 0.5em;
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.cne-template-form-header p {
  font-size: 0.8em;
  margin: 0 0 0.5rem;
  line-height: 1;
  max-height: 3rem;
  overflow-y: auto;
}

.cne-template-form-header p.no-template-data {
  color: var(--color-destructive, #bf3c2c);
}

.cne-template-link {
  float: right;
}

.cne-template-form-body {
  display: flex;
  height: calc(100% - 6em);
  border-bottom: 1px solid var(--border-color-divider, gray);
}

.cne-template-args {
  padding: 0.5em;
  width: 15em;
  overflow: auto;
  border-right: 1px solid var(--border-color-divider, gray);
}

.cne-template-args ul {
  padding: 0;
  margin: 0.5em 0;
}

.cne-template-arg-section {
  font-weight: bold;
}

.cne-template-arg {
  line-height: 1;
  margin-bottom: 0.5em;
  display: flex;
  align-items: center;
  user-select: none;
}
.cne-template-arg:not(.arg-required) {
  cursor: pointer;
}
.cne-template-arg::before {
  content: "+";
  color: var(--color-progressive, #36c);
  font-weight: bold;
  margin-right: 0.3em;
  font-size: 1.2em;
}
.cne-template-arg.arg-added::before {
  content: "−";
  color: var(--color-destructive, #bf3c2c);
}
.cne-template-arg.arg-required::before {
  content: "✓";
  color: gray;
}

.cne-template-fields {
  padding: 0.5em;
  overflow: auto;
  width: calc(100% - 15em);
}
</style>
<!-- </nowiki> -->
