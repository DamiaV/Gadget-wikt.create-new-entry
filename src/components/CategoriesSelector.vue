<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import PageLookup from "./PageLookup.vue";
import WikiLink from "./WikiLink.vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconTrash } from "@wikimedia/codex-icons";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    PageLookup,
    WikiLink,
  },

  props: {
    /**
     * @type {import("vue").PropType<string[]>}
     */
    modelValue: { type: Array, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    const categories = ref(props.modelValue || []);
    const selectedCategory = ref("");

    /**
     * Insert the given category name in the list.
     * @param {string} name The name of the category to insert.
     */
    function insertCategory(name) {
      if (!name) return;
      categories.value.push(name);
      categories.value.sort();
      ctx.emit("update:model-value", categories.value);
    }

    /**
     * Remove the category at the given index.
     * @param {number} i The index to delete.
     */
    function removeCategory(i) {
      categories.value.splice(i, 1);
      ctx.emit("update:model-value", categories.value);
    }

    return {
      // Data
      categories,
      selectedCategory,
      // Icons
      cdxIconTrash,
      // Callbacks
      insertCategory,
      removeCategory,
    };
  },
});
</script>

<template>
  <div class="cne-category-selector">
    <page-lookup
      v-model="selectedCategory"
      :namespaces="[14]"
      page-type="une catégorie"
      strip-namespace
      report-only-selection
      erase-on-selection
      @update:model-value="insertCategory"
    ></page-lookup>
    <template v-if="categories.length">
      <span class="cne-categories-list-title">
        Catégories sélectionnées&nbsp;:
      </span>
      <ul>
        <li v-for="(category, i) in categories" :key="category">
          <cdx-button
            title="Retirer"
            aria-label="Retirer"
            size="small"
            action="destructive"
            type="button"
            @click="removeCategory(i)"
          >
            <cdx-icon :icon="cdxIconTrash"></cdx-icon>
          </cdx-button>
          <wiki-link :page-title="`Catégorie:${category}`">{{
            category
          }}</wiki-link>
        </li>
      </ul>
    </template>
  </div>
</template>

<style>
.cne-category-selector ul {
  list-style-type: none;
  margin: 0;
  padding-left: 1em;
}

.cne-categories-list-title {
  display: block;
  margin-top: 2em;
}

.cne-category-selector ul li {
  margin-top: 0.5em;
  display: flex;
  gap: 0.5em;
  align-items: center;
}
</style>
<!-- </nowiki> -->
