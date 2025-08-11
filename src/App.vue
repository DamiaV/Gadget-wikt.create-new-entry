<!-- <nowiki> -->
<script>
import { defineComponent, ref } from "vue";
import { CdxButton, CdxTabs, CdxTab } from "@wikimedia/codex";
import EntryForm from "./components/EntryForm.vue";
import L from "./languages.js";

export default defineComponent({
  components: {
    CdxButton,
    CdxTabs,
    CdxTab,
    EntryForm,
  },
  setup() {
    const languages = L.loadLanguages();

    /**
     * @type {import("./types.js").FormData}
     */
    const initialFormData = {
      entries: [
        // Create an empty initial entry
        {
          language: languages[0],
          definitions: [
            {
              text: "",
              examples: [],
            },
          ],
        },
      ],
    };

    const showForm = ref(false);
    const formData = ref(initialFormData);

    function onInsertWikitext() {
      console.log(formData.value);
    }

    /**
     * @param {import("./types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      const entry = formData.value.entries[event.index];
      entry.language = event.entry.language;
      entry.definitions = event.entry.definitions;
    }

    return {
      showForm,
      formData,
      onEntryUpdate,
      onInsertWikitext,
    };
  },
});
</script>

<template>
  <div v-if="!showForm">
    <cdx-button action="progressive" weight="quiet" @click="showForm = true">
      Ouvrir le gadget de création d’entrée
    </cdx-button>
  </div>

  <template v-if="showForm">
    <cdx-button action="progressive" weight="primary" @click="onInsertWikitext">
      Insérer le code
    </cdx-button>
    <cdx-tabs>
      <cdx-tab
        v-for="(entry, i) in formData.entries"
        :key="i"
        :name="`tab-${i}`"
        :label="`Entrée en ${entry.language.name}`"
      >
        <entry-form
          :index="i"
          :model-value="entry"
          @update:model-value="onEntryUpdate"
        ></entry-form>
      </cdx-tab>
    </cdx-tabs>
  </template>
</template>
<!-- </nowiki> -->
