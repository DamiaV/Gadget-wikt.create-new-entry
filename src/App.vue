<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
import { CdxButton, CdxCheckbox, CdxIcon, CdxMessage } from "@wikimedia/codex";
import {
  cdxIconCollapse,
  cdxIconDownload,
  cdxIconExpand,
} from "@wikimedia/codex-icons";
import C from "./wiki_deps/wikt.core.cookies.js";
import EntriesForm from "./components/EntriesForm.vue";
import LanguageSelector from "./components/LanguageSelector.vue";
import L from "./languages.js";

const COOKIE_NAME = "cne_lang";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    CdxCheckbox,
    CdxMessage,
    LanguageSelector,
    EntriesForm,
  },
  inject: ["config"],
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

    const isStub = ref(false);

    /**
     * @type {Readonly<import("vue").ShallowRef<HTMLFormElement>>}
     */
    const form = useTemplateRef("form");

    /**
     * @type {import("./types.js").FormData}
     */
    const initialFormData = {
      language: language.value,
      stub: isStub.value,
      entries: [
        // Create an empty initial entry
        {
          id: 1,
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
    const showFormFields = ref(false);
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

    /**
     * @param {boolean} checked Whether the stub checkbox is checked.
     */
    function onStubUpdate(checked) {
      isStub.value = checked;
      formData.value.stub = checked;
    }

    function onSubmit() {
      if (!form.value.checkValidity()) return;
      console.log(formData.value);
    }

    return {
      showForm,
      showFormFields,
      formData,
      language,
      languages,
      isStub,
      cdxIconCollapse,
      cdxIconExpand,
      cdxIconDownload,
      onEntriesUpdate,
      onLanguageSelection,
      onStubUpdate,
      onSubmit,
    };
  },
});
</script>

<template>
  <div id="cne">
    <div v-if="!showForm" class="cne-start-btn">
      <cdx-button
        action="progressive"
        weight="quiet"
        type="button"
        @click="
          showForm = true;
          showFormFields = true;
        "
      >
        Ouvrir le gadget de création d’entrée
      </cdx-button>
    </div>

    <form v-if="showForm" ref="form" class="cne-box" @submit.prevent="onSubmit">
      <div class="cne-form-toolbar">
        <cdx-button
          type="button"
          :title="showFormFields ? 'Enrouler' : 'Dérouler'"
          @click="showFormFields = !showFormFields"
        >
          <cdx-icon
            :icon="showFormFields ? cdxIconCollapse : cdxIconExpand"
          ></cdx-icon>
        </cdx-button>
      </div>

      <h1>
        Création d’une section en <em>{{ language.name }}</em>
      </h1>

      <div v-show="showFormFields">
        <cdx-message type="notice">
          <p>
            Ce gadget permet de créer une section de langue complète en écrivant
            le moins de code possible.
          </p>
          <p>
            Le code sera directement inséré au bon endroit dans la zone
            d’édition. Vérifiez bien que le code généré est correct avant de
            publier votre modification.
          </p>
          <p>
            Vous pouvez créer plusieurs sections de types de mots en même temps
            en cliquant sur le bouton «&nbsp;Ajouter une entrée&nbsp;».
          </p>
        </cdx-message>
        <cdx-message type="warning">
          Assurez-vous de bien cliquer sur le bouton «&nbsp;Insérer le
          code&nbsp;» avant de publier la page, sinon les informations que vous
          avez entrées seront perdues.
        </cdx-message>

        <language-selector
          v-model="language"
          :languages="languages"
          @update:model-value="onLanguageSelection"
        ></language-selector>
        <cdx-checkbox v-model="isStub" @update:model-value="onStubUpdate">
          Ébauche
          <template #description>
            Cochez cette case pour insérer un bandeau d’ébauche.
          </template>
        </cdx-checkbox>
        <entries-form
          v-model="formData.entries"
          :language="formData.language"
          @update:model-value="onEntriesUpdate"
        ></entries-form>

        <hr />
        <div class="bottom-btns">
          <cdx-button type="submit" action="progressive" weight="primary">
            <cdx-icon :icon="cdxIconDownload"></cdx-icon>
            Insérer le code
          </cdx-button>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
#cne .cne-box {
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 3px;
  padding: 0 0.5em;
}

#cne h1,
#cne .cne-start-btn {
  text-align: center;
}

#cne .cne-form-toolbar {
  float: left;
  margin-top: 1em;
}

#cne .cne-language-selector {
  margin-bottom: 1em;
}

#cne .bottom-btns {
  display: flex;
  justify-content: center;
  margin: 0.5em 0;
}

/*
 * Ruleset used by child components
 */
#cne .help-icon {
  margin-right: 0.5em;
}
</style>
<!-- </nowiki> -->
