<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconDownload } from "@wikimedia/codex-icons";
import EntriesForm from "./components/EntriesForm.vue";
import L from "./languages.js";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    EntriesForm,
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
     * @param {import("./types.js").FormEntriesUpdateEvent} event
     */
    function onEntriesUpdate(event) {
      formData.value.entries = event.entries;
    }

    function onSubmit() {
      if (!form.value.checkValidity()) return;
      console.log(formData.value);
    }

    return {
      showForm,
      formData,
      cdxIconDownload,
      onEntriesUpdate,
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
    <entries-form
      v-model="formData.entries"
      :language="formData.language"
      @update:model-value="onEntriesUpdate"
    ></entries-form>
    <cdx-button type="submit" action="progressive" weight="primary">
      <cdx-icon :icon="cdxIconDownload"></cdx-icon>
      Insérer le code
    </cdx-button>
  </form>
</template>
<!-- </nowiki> -->
