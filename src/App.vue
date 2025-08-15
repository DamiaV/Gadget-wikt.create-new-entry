<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref, useTemplateRef } from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxDialog,
  CdxIcon,
  CdxMessage,
} from "@wikimedia/codex";
import { cdxIconDownload } from "@wikimedia/codex-icons";
import C from "./wiki_deps/wikt.core.cookies.js";
import EntriesForm from "./components/EntriesForm.vue";
import LanguageSelector from "./components/LanguageSelector.vue";
import L from "./languages.js";
import utils from "./utils.js";

const COOKIE_NAME = "cne_lang";

export default defineComponent({
  components: {
    CdxButton,
    CdxIcon,
    CdxCheckbox,
    CdxMessage,
    CdxDialog,
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

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");
    const gender = config.userGender;

    return {
      showForm,
      formData,
      language,
      languages,
      isStub,
      gender,
      utils,
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
  <div id="cne-form">
    <div v-if="!showForm" class="cne-start-btn">
      <cdx-button action="progressive" weight="quiet" @click="showForm = true">
        Ouvrir le gadget de création d’entrée
      </cdx-button>
    </div>

    <form v-if="showForm" ref="form" class="cne-box" @submit.prevent="onSubmit">
      <h1>
        Création d’une section en <em>{{ language.name }}</em>
      </h1>

      <cdx-message type="notice">
        <p>
          Ce gadget permet de créer une section de langue complète en écrivant
          le moins de code possible.
        </p>
        <p>
          Le code sera directement inséré au bon endroit dans la zone d’édition.
          Vérifiez bien que le code généré est correct avant de publier votre
          modification.
        </p>
        <p>
          Vous pouvez créer plusieurs sections de types de mots en même temps en
          cliquant sur le bouton «&nbsp;Ajouter une entrée&nbsp;».
        </p>
      </cdx-message>
      <cdx-message type="warning">
        Assurez-vous de bien cliquer sur le bouton «&nbsp;Insérer le code&nbsp;»
        avant de publier la page, sinon les informations que vous avez entrées
        seront perdues.
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
        <cdx-button type="button" action="destructive" weight="primary">
          Annuler et fermer
        </cdx-button>
        <cdx-button type="submit" action="progressive" weight="primary">
          <cdx-icon :icon="cdxIconDownload"></cdx-icon>
          Insérer le code
        </cdx-button>
      </div>
    </form>

    <cdx-dialog
      v-model:open="openDialog"
      title="Confirmation de suppression"
      use-close-button
      :primary-action="primaryAction"
      :default-action="defaultAction"
      @primary="onDeleteConfirm"
      @default="openDialog = false"
    >
      Êtes-vous {{ utils.userGenderSwitch(gender, "sûr·e", "ŝure", "ŝur") }} de
      vouloir tout annuler et fermer le gadget&nbsp;?
      <template #footer-text>
        Toute les informations seront définitivement perdues.
      </template>
    </cdx-dialog>
  </div>
</template>

<style>
#cne-form .cne-box {
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 3px;
  padding: 0 0.5em;
}

#cne-form h1,
#cne-form .cne-start-btn {
  text-align: center;
}

#cne-form .cne-language-selector {
  margin-bottom: 1em;
}

#cne-form .bottom-btns {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin: 0.5em 0;
}

/*
 * Ruleset used by child components
 */
#cne-form .help-icon {
  margin-right: 0.5em;
}
</style>
<!-- </nowiki> -->
