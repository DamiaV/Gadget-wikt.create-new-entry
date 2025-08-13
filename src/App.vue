<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconDownload } from "@wikimedia/codex-icons";
import C from "./wiki_deps/wikt.core.cookies.js";
import EntriesForm from "./components/EntriesForm.vue";
import LanguageSelector from "./components/LanguageSelector.vue";
import L from "./languages.js";

const COOKIE_NAME = "cne_lang";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    LanguageSelector,
    EntriesForm,
  },
  setup() {
    const languages = ref(L.loadLanguages());
    const previousLangCode = C.getCookie(COOKIE_NAME);
    let startLanguage;
    for (const lang of languages.value) {
      if (lang.code === previousLangCode) {
        startLanguage = lang;
        break;
      }
    }
    if (!startLanguage) {
      startLanguage = L.getDefaultLanguage(previousLangCode);
      if (startLanguage) languages.value.push(startLanguage);
      else startLanguage = languages.value[0];
    }
    const language = ref(startLanguage);

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
      if (!languages.value.some((lang) => lang.code === language.code))
        languages.value.push(language);
      const newLocal = COOKIE_NAME;
      C.setCookie(newLocal, language.code, 30);
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

    <p>
      Ce gadget permet de créer une section de langue complète.
      <strong
        >Assurez-vous de bien cliquer sur le bouton «&nbsp;Insérer le
        code&nbsp;» avant de publier la page, sinon les informations que vous
        avez entrées seront perdues.</strong
      >
      Vous pouvez créer plusieurs sections de types de mots en même temps en
      cliquant sur le bouton «&nbsp;Ajouter une entrée&nbsp;».
    </p>

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
