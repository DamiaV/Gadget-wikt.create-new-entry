<script>
// <nowiki>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxField, CdxIcon, CdxLookup } from "@wikimedia/codex";
import lex from "../wiki_deps/wikt.core.lexicons.js";
import { cdxIconTrash } from "@wikimedia/codex-icons";

// </nowiki>
/**
 * A form component to the edit an array of lexicons.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/LexiconForm.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxButton,
    CdxField,
    CdxIcon,
    CdxLookup,
  },

  props: {
    /**
     * The Definition object to manage.
     * @type {import("vue").PropType<string[]>}
     */
    modelValue: { type: Array, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const lexiconCodes = lex.getLexiconCodes();

    const lexicons = ref(props.modelValue);

    /**
     * @type {import("@wikimedia/codex").MenuItemData[]}
     */
    const lexiconItems = [];
    for (const code of lexiconCodes) {
      const lexiconData = lex.getLexiconData(code);
      lexiconItems.push({
        label: code,
        value: code,
        description: lexiconData.description,
      });
    }

    const menuSelection = ref("");
    /**
     * @type {import("vue").Ref<import("@wikimedia/codex").MenuItemData[]>}
     */
    const menuItems = ref([]);

    function fireUpdateEvent() {
      ctx.emit("update:model-value", lexicons.value);
    }

    /**
     * Called when the collapsible menu selection changes.
     * @param {string | null} code The selected code.
     */
    function onMenuSelection(code) {
      if (!code) return;
      lexicons.value.push(code);
      menuSelection.value = ""; // Reset lookup selection
      fireUpdateEvent();
    }

    /**
     * Filter items on input.
     * @param {string} value
     */
    function onInput(value) {
      if (value) {
        value = value.toLocaleLowerCase();
        menuItems.value = lexiconItems
          .filter(
            (item) =>
              !lexicons.value.includes(item.value) &&
              item.label.toLocaleLowerCase().includes(value)
          )
          .sort((i1, i2) => {
            const name1 = i1.label.toLocaleLowerCase();
            const name2 = i2.label.toLocaleLowerCase();
            if (name1.startsWith(value) && !name2.startsWith(value)) return -1;
            if (!name1.startsWith(value) && name2.startsWith(value)) return 1;
            return name1.localeCompare(name2);
          })
          .slice(0, 20);
      }
    }

    /**
     * Delete the given lexicon.
     * @param {number} index The index of the lexicon to delete.
     */
    function onDelete(index) {
      lexicons.value.splice(index, 1);
      fireUpdateEvent();
    }

    return {
      // Data
      lexicons,
      menuItems,
      menuSelection,
      // Icons
      cdxIconTrash,
      // Callbacks
      onMenuSelection,
      onInput,
      onDelete,
    };
  },
});
</script>

<template>
  <cdx-field class="cne-lexicon-form">
    <template #label>Lexiques</template>
    <cdx-lookup
      v-model:selected="menuSelection"
      :menu-items="menuItems"
      clearable
      @input="onInput"
      @update:selected="onMenuSelection"
    ></cdx-lookup>
    <ul class="cne-lexicons-list">
      <li v-for="(lexicon, i) in lexicons" :key="i">
        {{ lexicon }}
        <cdx-button
          type="button"
          size="small"
          action="destructive"
          aria-label="Supprimer"
          title="Supprimer"
          @click="onDelete"
        >
          <cdx-icon :icon="cdxIconTrash"></cdx-icon>
        </cdx-button>
      </li>
    </ul>
  </cdx-field>
</template>

<style>
.cne-lexicon-form-container {
  display: flex;
}

.cne-lexicons-list {
  list-style-type: none;
  padding-left: 1em;
}

.cne-lexicons-list > li {
  display: flex;
  gap: 0.5em;
  align-items: center;
  margin-bottom: 0.2em;
}

/* </nowiki> */
</style>
