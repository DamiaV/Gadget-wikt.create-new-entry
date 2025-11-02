<script>
// <nowiki>
import { defineComponent, inject, reactive, ref } from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxMessage,
  CdxRadio,
} from "@wikimedia/codex";
import { cdxIconAlert, cdxIconConfigure } from "@wikimedia/codex-icons";
import requests from "../requests.js";

/**
 * A button that shows a dialog to edit the current user’s preferences for this gadget.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/UserPreferences.vue]]
 */
export default defineComponent({
  components: {
    CdxButton,
    CdxCheckbox,
    CdxDialog,
    CdxField,
    CdxIcon,
    CdxMessage,
    CdxRadio,
  },

  props: {
    /**
     * The UserPreferences object to manage.
     * @type {import("vue").PropType<import("../types.js").UserPreferences>}
     */
    modelValue: { type: Object, required: true },
  },

  emits: ["update:model-value"],

  setup(props, ctx) {
    /**
     * @type {import("vue").Reactive<import("../types.js").UserPreferences>}
     */
    const userPrefs = reactive(props.modelValue);

    function fireEvent() {
      ctx.emit("update:model-value", userPrefs); // Do not send a copy, as it would break reactivity.
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    /*
     * Dialog
     */

    const openDialog = ref(false);
    const editingUserPrefs = reactive({
      displayMode: "full",
      formValidityCheckingDisabled: false,
      tabClosingWarningDisabled: false,
      resetIntroMessages: false,
    });

    /**
     * @type {import("@wikimedia/codex").PrimaryModalAction}
     */
    const dialogPrimaryAction = {
      label: "Enregistrer",
      actionType: "progressive",
    };
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const dialogDefaultAction = {
      label: "Annuler",
    };

    function onOpenDialog() {
      editingUserPrefs.displayMode = userPrefs.displayMode;
      editingUserPrefs.formValidityCheckingDisabled =
        userPrefs.formValidityCheckingDisabled;
      editingUserPrefs.tabClosingWarningDisabled =
        userPrefs.tabClosingWarningDisabled;
      editingUserPrefs.resetIntroMessages = false;

      openDialog.value = true;
    }

    function onSavePreferences() {
      /**
       * @type {import("../types.js").UserPreferences}
       */
      const prefs = {
        displayMode: editingUserPrefs.displayMode,
        formValidityCheckingDisabled:
          editingUserPrefs.formValidityCheckingDisabled,
        tabClosingWarningDisabled: editingUserPrefs.tabClosingWarningDisabled,
        introMessageHidden: editingUserPrefs.resetIntroMessages
          ? false
          : userPrefs.introMessageHidden,
        warningIntroMessageHidden: editingUserPrefs.resetIntroMessages
          ? false
          : userPrefs.warningIntroMessageHidden,
        favoritedSections: userPrefs.favoritedSections,
      };
      requests
        .setUserPreferences(config.userName, prefs, config.api)
        .then(() => {
          openDialog.value = false;

          userPrefs.displayMode = prefs.displayMode;
          userPrefs.formValidityCheckingDisabled =
            prefs.formValidityCheckingDisabled;
          userPrefs.tabClosingWarningDisabled = prefs.tabClosingWarningDisabled;
          userPrefs.introMessageHidden = prefs.introMessageHidden;
          userPrefs.warningIntroMessageHidden = prefs.warningIntroMessageHidden;

          if (typeof mw !== "undefined")
            mw.notify("Vos préférences ont été enregistrées.", {
              type: "success",
              autoHide: true,
            });

          fireEvent();
        })
        .catch((reason) => {
          console.warn("[CNE] Error:", reason);
          if (typeof mw !== "undefined")
            mw.notify(
              "Vos préférences n’ont pas pu être sauvegardées. Veuillez réessayer.",
              {
                type: "error",
                autoHide: true,
              }
            );
        });
    }

    return {
      // Data
      editingUserPrefs,
      // Dialog
      openDialog,
      dialogPrimaryAction,
      dialogDefaultAction,
      // Icons
      cdxIconAlert,
      cdxIconConfigure,
      // Callbacks
      onOpenDialog,
      onSavePreferences,
    };
  },
});
</script>

<template>
  <cdx-button
    title="Préférences"
    type="button"
    weight="quiet"
    aria-label="Préférences"
    @click="onOpenDialog"
  >
    <cdx-icon :icon="cdxIconConfigure"></cdx-icon>
  </cdx-button>

  <cdx-dialog
    v-model:open="openDialog"
    title="Préférences du gadget"
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    use-close-button
    @primary="onSavePreferences"
    @default="openDialog = false"
  >
    <cdx-field is-fieldset role="radiogroup" class="cne-box">
      <template #label>Mode d’affichage</template>

      <cdx-radio
        v-model="editingUserPrefs.displayMode"
        name="display-mode"
        input-value="full"
      >
        Complet
      </cdx-radio>

      <cdx-radio
        v-model="editingUserPrefs.displayMode"
        name="display-mode"
        input-value="minimal"
      >
        Minimaliste
        <template #description>
          Une interface simplifiée, avec seulement le sélecteur de langue, les
          sélecteurs de propriétés grammaticales, et un champ de définition.
        </template>
      </cdx-radio>
      <cdx-message
        v-if="editingUserPrefs.displayMode === 'minimal'"
        :icon="cdxIconAlert"
        type="warning"
        style="margin-bottom: 0.5em"
      >
        Les données déjà entrées dans le formulaire seront partiellement
        effacées.
      </cdx-message>

      <cdx-radio
        v-model="editingUserPrefs.displayMode"
        name="display-mode"
        input-value="compact"
      >
        Compact
        <template #description>
          Une interface épurée, avec moins de texte et d’espaces vides.
        </template>
      </cdx-radio>
    </cdx-field>

    <cdx-field>
      <cdx-checkbox v-model="editingUserPrefs.resetIntroMessages">
        Réinitialiser tous les messages fermés
      </cdx-checkbox>
    </cdx-field>

    <cdx-field>
      <cdx-checkbox v-model="editingUserPrefs.formValidityCheckingDisabled">
        Désactiver la vérification du formulaire
      </cdx-checkbox>
      <template #help-text>
        Le code pourra être inséré même si le formulaire contient des erreurs.
      </template>
      <cdx-message
        v-if="editingUserPrefs.formValidityCheckingDisabled"
        :icon="cdxIconAlert"
        type="warning"
      >
        Activer cette option pourrait générer du wikicode incomplet ou
        incorrect.
      </cdx-message>
    </cdx-field>

    <cdx-field>
      <cdx-checkbox v-model="editingUserPrefs.tabClosingWarningDisabled">
        Désactiver l’avertissement de modifications non insérées
      </cdx-checkbox>
      <template #help-text>
        L’avertissement à la fermeture de l’onglet ou de la fenêtre ne sera plus
        affiché dans le cas où le formulaire contient des données qui n’ont pas
        été insérées.
      </template>
      <cdx-message
        v-if="editingUserPrefs.tabClosingWarningDisabled"
        :icon="cdxIconAlert"
        type="warning"
      >
        Activer cette option vous expose à des pertes de données accidentelles.
      </cdx-message>
    </cdx-field>
  </cdx-dialog>
</template>

<style>
/* </nowiki> */
</style>
