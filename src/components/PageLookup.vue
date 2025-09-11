<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import { CdxField, CdxLookup } from "@wikimedia/codex";
import { cdxIconSearch } from "@wikimedia/codex-icons";
import pages from "../pages.js";

export default defineComponent({
  components: {
    CdxField,
    CdxLookup,
  },

  props: {
    /**
     * @type {import("vue").PropType<number[]>}
     */
    namespaces: { type: Array, default: () => [] },
    pageType: { type: String, default: "une page" },
    allowSubpages: { type: Boolean, default: false },
    stripNamespace: { type: Boolean, default: false },
    reportOnlySelection: { type: Boolean, default: false },
    eraseOnSelection: { type: Boolean, default: false },
    modelValue: { type: String, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const selection = ref(props.modelValue);
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
        value = value.trim();
        if (value) {
          if (props.stripNamespace)
            value = pages.stripNamespace(value, config.namespaces);
          searchPages(value);
        } else lookupItems.value = [];
        if (!props.reportOnlySelection) ctx.emit("update:model-value", value);
      }, 300);
    }

    /**
     * Search pages based on the given title.
     * @param {string} query The title of the page to search.
     */
    function searchPages(query) {
      pages
        .searchPages(query, props.namespaces)
        .then((results) => {
          /**
           * @type {[string, import("../types.js").Namespace][]}
           */
          let titles = results.map((title) => {
            const namespace = pages.extractNamespace(title, config.namespaces);
            if (props.stripNamespace && namespace.id !== 0)
              title = pages.stripNamespace(title, config.namespaces);
            return [title, namespace];
          });

          if (!props.allowSubpages)
            titles = titles.filter(
              ([title, namespace]) =>
                !namespace.allowsSubpages || !title.includes("/")
            );

          query = query.toLocaleLowerCase();
          titles.sort(([title1], [title2]) => {
            if (title1.startsWith(query) && !title2.startsWith(query))
              return -1;
            if (!title1.startsWith(query) && title2.startsWith(query)) return 1;
            return title1.localeCompare(title2);
          });

          lookupItems.value = titles.map(([title]) => ({
            value: title,
          }));
        })
        .catch((error) => {
          console.warn(error);
          lookupItems.value = [];
        });
    }

    /**
     * Propagate the selected value to the parent component.
     * @param {string | null} selectedValue The selected value.
     */
    function onSelect(selectedValue) {
      if (props.eraseOnSelection) selection.value = ""; // FIXME does nothing
      ctx.emit("update:model-value", selectedValue || "");
    }

    return {
      // Data
      selection,
      lookupItems,
      // Visual
      lookupConfig,
      // Icons
      cdxIconSearch,
      // Callbacks
      onInput,
      onSelect,
    };
  },
});
</script>

<template>
  <cdx-field>
    <template #label>Rechercher {{ $props.pageType }}</template>
    <cdx-lookup
      v-model:selected.trim="selection"
      :menu-items="lookupItems"
      :menu-config="lookupConfig"
      :start-icon="cdxIconSearch"
      :placeholder="`Saisissez le nom d’${$props.pageType}`"
      clearable
      @input="onInput"
      @update:selected="onSelect"
    >
      <template #no-results>Aucun résultat.</template>
    </cdx-lookup>
  </cdx-field>
</template>
<!-- </nowiki> -->
