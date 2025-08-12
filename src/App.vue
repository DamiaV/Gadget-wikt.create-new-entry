<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
import { CdxButton, CdxIcon, CdxTabs, CdxTab } from "@wikimedia/codex";
import { cdxIconDownload } from "../icons.json";
import EntryForm from "./components/EntryForm.vue";
import L from "./languages.js";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    CdxTabs,
    CdxTab,
    EntryForm,
  },
  setup() {
    const languages = L.loadLanguages();
    /**
     * @type {Readonly<import("vue").ShallowRef<HTMLFormElement>>}
     */
    const form = useTemplateRef("form");

    /**
     * @type {import("./types.js").FormData}
     */
    const initialFormData = {
      language: languages[0],
      entries: [
        // Create an empty initial entry
        {
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

    /**
     * @param {import("./types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      formData.value.entries[event.index] = event.entry;
    }

    function onSubmit() {
      if (!form.value.checkValidity()) return;
      console.log(formData.value);
    }

    return {
      form,
      showForm,
      formData,
      cdxIconDownload,
      onEntryUpdate,
      onSubmit,
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

  <form v-if="showForm" ref="form" @submit.prevent="onSubmit">
    <cdx-button type="submit" action="progressive" weight="primary">
      <cdx-icon :icon="cdxIconDownload"></cdx-icon>
      Insérer le code
    </cdx-button>
    <cdx-tabs>
      <cdx-tab
        v-for="(entry, i) in formData.entries"
        :key="i"
        :name="`tab-${i}`"
        :label="`Entrée ${i + 1}`"
      >
        <entry-form
          :index="i"
          :language="formData.language"
          :model-value="entry"
          @update:model-value="onEntryUpdate"
        ></entry-form>
      </cdx-tab>
    </cdx-tabs>
  </form>
</template>
<!-- </nowiki> -->
