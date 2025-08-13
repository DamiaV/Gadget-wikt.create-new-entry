<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconDownload } from "@wikimedia/codex-icons";
import C from "./wiki_deps/wikt.core.cookies.js";
import EntriesForm from "./components/EntriesForm.vue";
import LanguageSelector from "./components/LanguageSelector.vue";
import L from "./languages.js";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    LanguageSelector,
    EntriesForm,
  },
  setup() {
    const previousLangCode = C.getCookie("cne_lang");
    console.log(previousLangCode);
    const languages = L.loadLanguages();
    const language = ref(languages[0]); // TODO check for cookie first

    /**
     * @type {Readonly<import("vue").ShallowRef<HTMLFormElement>>}
     */
    const form = useTemplateRef("form");

    /**
     * @type {import("./types.js").FormData}
     */
    const initialFormData = {
      language: language.value,
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

    /**
     * @param {import("./types.js").Language} language The selected language.
     */
    function onLanguageSelection(language) {
      formData.value.language = language;
    }

    function onSubmit() {
      if (!form.value.checkValidity()) return;
      console.log(formData.value);
    }

    return {
      showForm,
      formData,
      language,
      languages,
      cdxIconDownload,
      onEntriesUpdate,
      onLanguageSelection,
      onSubmit,
    };
  },
});
</script>

<template>
  <div v-if="!showForm" id="cne-start-btn">
    <cdx-button action="progressive" weight="quiet" @click="showForm = true">
      Ouvrir le gadget de création d’entrée
    </cdx-button>
  </div>

  <form v-if="showForm" id="cne-form" ref="form" @submit.prevent="onSubmit">
    <h1>
      Création d’une section en <em>{{ language.name }}</em>
    </h1>

    <language-selector
      v-model="language"
      :languages="languages"
      @update:model-value="onLanguageSelection"
    ></language-selector>
    <entries-form
      v-model="formData.entries"
      :language="formData.language"
      @update:model-value="onEntriesUpdate"
    ></entries-form>
    <cdx-button
      class="submit-btn"
      type="submit"
      action="progressive"
      weight="primary"
    >
      <cdx-icon :icon="cdxIconDownload"></cdx-icon>
      Insérer le code
    </cdx-button>
  </form>
</template>

<style>
#cne-form h1,
#cne-start-btn {
  text-align: center;
}

#cne-form .submit-btn {
  margin: 1em auto;
  display: block;
}
</style>
<!-- </nowiki> -->
