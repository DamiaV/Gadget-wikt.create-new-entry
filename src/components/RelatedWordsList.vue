<script>
// <nowiki>
import {
  computed,
  defineComponent,
  inject,
  reactive,
  ref,
  shallowRef,
  toRaw,
} from "vue";
import {
  CdxButton,
  CdxCheckbox,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxTextInput,
} from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconCancel,
  cdxIconCheck,
  cdxIconEdit,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconStar,
  cdxIconTrash,
  cdxIconUnStar,
} from "@wikimedia/codex-icons";
import requests from "../requests.js";
import strings from "../strings.js";
import types from "../types.js";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

// </nowiki>
/**
 * A component to edit an array of RelatedWord objects.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/RelatedWordsList.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxButton,
    CdxCheckbox,
    CdxDialog,
    CdxField,
    CdxIcon,
    CdxTextInput,
    InputWithToolbar,
    WikiLink,
  },

  props: {
    /**
     * The type of section this component represents.
     */
    sectionType: { type: String, required: true },
    /**
     * The data for the type of section this component represents.
     * @type {import("vue").PropType<import("../types.js").SectionData>}
     */
    sectionData: { type: Object, required: true },
    /**
     * An optional description for the type of section this component represents.
     */
    description: { type: String, default: "" },
    /**
     * Whether to disable the delete button.
     * Defaults to false.
     */
    disableDelete: { type: Boolean, default: false },
    /**
     * The array of RelatedWord objects to manage.
     * @type {import("vue").PropType<import("../types.js").RelatedWord[] | string>}
     */
    modelValue: { type: [Array, String], required: true },
  },

  emits: ["update:model-value", "delete"],

  setup(props, ctx) {
    const isTextual = !!props.sectionData.isText;

    const text = ref(isTextual ? props.modelValue : "");
    /**
     * @type {import("vue").Ref<import("../types.js").RelatedWord[]>}
     */
    const items = shallowRef(!isTextual ? props.modelValue : []);

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");
    /**
     * @type {import("../types.js").UserPreferences}
     */
    const userPrefs = inject("userPrefs");

    const sectionStatus = computed(() => {
      const sectionStatus = userPrefs.favoritedSections[props.sectionType];
      if (!sectionStatus) return null;
      return sectionStatus.status;
    });

    /**
     * Check whether the given item is empty.
     * @param {import("../types.js").RelatedWord} item The item to check.
     */
    function isEmpty(item) {
      if ("words" in item) return item.words.every((word) => !word);
      return !item.text;
    }

    function fireEvent() {
      if (isTextual) {
        ctx.emit("update:model-value", text.value);
        return;
      }

      /**
       * @type {import("../types.js").RelatedWord[]}
       */
      const firedEvent = [];
      for (const item of items.value) {
        const id = item.id;
        const empty = isEmpty(item);
        if ("words" in item)
          firedEvent.push({
            id,
            words: Array.from(item.words),
            annotation: item.annotation,
            nonFormattedAnnotation: item.nonFormattedAnnotation,
            empty,
          });
        else
          firedEvent.push({
            id,
            text: item.text,
            empty,
          });
      }
      ctx.emit("update:model-value", firedEvent);
    }

    function sortItems() {
      items.value.sort((i1, i2) => {
        if ("text" in i1 && "text" in i2)
          return i1.text.toLowerCase().localeCompare(i2.text.toLowerCase());

        if ("words" in i1 && "words" in i2) {
          const smallestLength = Math.min(i1.words.length, i2.words.length);
          // Seek the first differing word pair
          for (let i = 0; i < smallestLength; i++) {
            const w1 = i1.words[i];
            const w2 = i2.words[i];
            const comp = w1.toLowerCase().localeCompare(w2.toLowerCase());
            if (comp !== 0) return comp;
          }
          // All words were the same, sort by array length
          const comp = i1.words.length - i2.words.length;
          if (comp !== 0) return comp;
          // Arrays are identical, sort by annotation
          return i1.annotation
            .toLowerCase()
            .localeCompare(i2.annotation.toLowerCase());
        }

        if ("text" in i1 && "words" in i2) return -1;

        return 1;
      });
    }

    /*
     * Edit dialogs
     */

    const editedItemIndex = ref(-1);
    const addMode = computed(() => editedItemIndex.value < 0);
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const dialogDefaultAction = {
      label: "Annuler",
    };

    /**
     * Edit an item.
     * @param {number} index The index of the item to edit.
     */
    function onOpenItemEditDialog(index) {
      const item = items.value[index];
      if ("words" in item) onOpenFormattedItemEditDialog(index);
      else onOpenUnformattedItemEditDialog(index);
    }

    /*
     * Formatted item edit dialog
     */

    const openFormattedItemEditDialog = ref(false);
    /**
     * @type {import("vue").Reactive<import("../types.js").FormattedRelatedWord>}
     */
    const editedFormattedItem = reactive(
      types.createEmptyFormattedRelatedWord()
    );
    const isFormattedItemDialogValid = computed(
      () =>
        editedFormattedItem.words.length !== 0 &&
        editedFormattedItem.words.every((word) => !!word.trim())
    );
    /**
     * @type {import("vue").ComputedRef<import("@wikimedia/codex").PrimaryModalAction>}
     */
    const formattedItemDialogPrimaryAction = computed(() => ({
      label: addMode.value ? "Ajouter" : "Appliquer",
      actionType: "progressive",
      disabled: !isFormattedItemDialogValid.value,
    }));

    /**
     * Add or edit an item.
     * @param {number} index The index of the item to edit. Leave empty to create a new one.
     */
    function onOpenFormattedItemEditDialog(index) {
      editedItemIndex.value = index;
      if (addMode.value) {
        editedFormattedItem.words = [""];
        editedFormattedItem.annotation = "";
        editedFormattedItem.nonFormattedAnnotation = false;
      } else {
        const item = items.value[index];
        editedFormattedItem.id = item.id;
        editedFormattedItem.words = Array.from(item.words);
        editedFormattedItem.annotation = item.annotation;
        editedFormattedItem.nonFormattedAnnotation =
          item.nonFormattedAnnotation;
      }
      openFormattedItemEditDialog.value = true;
    }

    function onFormattedItemEditDialogSubmit() {
      const words = Array.from(editedFormattedItem.words);
      if (addMode.value) {
        items.value.push({
          id: utils.getNextId(items.value),
          words: words,
          annotation: editedFormattedItem.annotation,
          nonFormattedAnnotation: editedFormattedItem.nonFormattedAnnotation,
        });
      } else {
        const item = items.value[editedItemIndex.value];
        item.words = words;
        item.annotation = editedFormattedItem.annotation;
        item.nonFormattedAnnotation =
          editedFormattedItem.nonFormattedAnnotation;
      }
      sortItems();
      fireEvent();
    }

    /*
     * Unformatted item edit dialog
     */

    const openUnformattedItemEditDialog = ref(false);
    /**
     * @type {import("vue").Reactive<import("../types.js").UnformattedRelatedWord>}
     */
    const editedUnformattedItem = reactive(
      types.createEmptyUnformattedRelatedWord()
    );
    const isUnformattedItemDialogValid = computed(
      () => !!editedUnformattedItem.text
    );
    /**
     * @type {import("vue").ComputedRef<import("@wikimedia/codex").PrimaryModalAction>}
     */
    const unformattedItemDialogPrimaryAction = computed(() => ({
      label: addMode.value ? "Ajouter" : "Appliquer",
      actionType: "progressive",
      disabled: !isUnformattedItemDialogValid.value,
    }));

    /**
     * Add or edit an item.
     * @param {number} index The index of the item to edit. Leave empty to create a new one.
     */
    function onOpenUnformattedItemEditDialog(index) {
      editedItemIndex.value = index;
      if (addMode.value) editedUnformattedItem.text = "";
      else editedUnformattedItem.text = items.value[index].text;
      openUnformattedItemEditDialog.value = true;
    }

    function onUnformattedItemEditDialogSubmit() {
      const text = editedUnformattedItem.text;
      if (addMode.value) {
        items.value.push({
          id: utils.getNextId(items.value),
          text,
        });
      } else {
        items.value[editedItemIndex.value].text = text;
      }
      sortItems();
      fireEvent();
    }

    /*
     * Delete dialog
     */

    const openDeletionDialog = ref(false);

    /**
     * @type {import("@wikimedia/codex").PrimaryModalAction}
     */
    const deletionDialogPrimaryAction = {
      label: "Supprimer",
      actionType: "destructive",
    };

    function onDelete() {
      if (items.value.every(isEmpty)) deleteRelatedWordsList();
      else openDeletionDialog.value = true;
    }

    function deleteRelatedWordsList() {
      openDeletionDialog.value = false;
      ctx.emit("delete", props.sectionType);
    }

    /**
     * Delete the item at thi given index.
     * @param {number} index The index of the item to delete.
     */
    function onDeleteItem(index) {
      items.value.splice(index, 1);
      fireEvent();
    }

    /*
     * Pinning and locking
     */

    function onPin() {
      const state = userPrefs.favoritedSections[props.sectionType];
      userPrefs.favoritedSections[props.sectionType] = { status: "pinned" };
      requests
        .setUserPreferences(config.userName, userPrefs, config.api)
        .then(() => {
          mw.notify(
            `La section «\u00a0${props.sectionData.name}\u00a0» a été épinglée.`,
            {
              type: "success",
              autoHide: true,
            }
          );
        })
        .catch(() => {
          if (state) userPrefs.favoritedSections[props.sectionType] = state;
          mw.notify(
            `La section «\u00a0${props.sectionData.name}\u00a0» n’a pas pu être épinglée.`,
            {
              type: "error",
              autoHide: true,
            }
          );
        });
    }

    function onLock() {
      const state = userPrefs.favoritedSections[props.sectionType];
      userPrefs.favoritedSections[props.sectionType] = {
        status: "locked",
        content: isTextual ? text.value : structuredClone(toRaw(items.value)),
      };
      requests
        .setUserPreferences(config.userName, userPrefs, config.api)
        .then(() => {
          mw.notify(
            `Le contenu de la section «\u00a0${props.sectionData.name}\u00a0» a été sauvegardé.`,
            {
              type: "success",
              autoHide: true,
            }
          );
        })
        .catch(() => {
          if (state) userPrefs.favoritedSections[props.sectionType] = state;
          mw.notify(
            `Le contenu de la section «\u00a0${props.sectionData.name}\u00a0» n’a pas pu être sauvegardé.`,
            {
              type: "error",
              autoHide: true,
            }
          );
        });
    }

    /**
     * Reset the status of this section.
     * @param {import("../types.js").SectionStatus} sectionStatus The previous section status.
     */
    function onReset(sectionStatus) {
      const state = userPrefs.favoritedSections[props.sectionType];
      delete userPrefs.favoritedSections[props.sectionType];
      requests
        .setUserPreferences(config.userName, userPrefs, config.api)
        .then(() => {
          mw.notify(
            sectionStatus === "locked"
              ? `La sauvegarde de l’état de la section «\u00a0${props.sectionData.name}\u00a0» a été supprimée.`
              : `La section «\u00a0${props.sectionData.name}\u00a0» a été désépinglée.`,
            {
              type: "success",
              autoHide: true,
            }
          );
        })
        .catch(() => {
          if (state) userPrefs.favoritedSections[props.sectionType] = state;
          mw.notify(
            sectionStatus === "locked"
              ? `La sauvegarde de l’état de la section «\u00a0${props.sectionData.name}\u00a0» n’a pas pu être supprimée.`
              : `La section «\u00a0${props.sectionData.name}\u00a0» n’a pas pu être désépinglée.`,
            {
              type: "error",
              autoHide: true,
            }
          );
        });
    }

    const sectionStatusObject = userPrefs.favoritedSections[props.sectionType];
    if (sectionStatusObject && sectionStatusObject.status === "locked") {
      if (isTextual) text.value = sectionStatusObject.content;
      else {
        for (const element of sectionStatusObject.content)
          items.value.push(element);
        sortItems();
      }
      fireEvent();
    }

    return {
      // Data
      isTextual,
      text,
      items,
      sectionStatus,
      // Other
      config,
      userPrefs,
      // Dialogs
      formattedItemDialogPrimaryAction,
      unformattedItemDialogPrimaryAction,
      dialogDefaultAction,
      openFormattedItemEditDialog,
      openUnformattedItemEditDialog,
      addMode,
      editedFormattedItem,
      editedUnformattedItem,
      editedItemIndex,
      deletionDialogPrimaryAction,
      openDeletionDialog,
      // Icons
      cdxIconAdd,
      cdxIconCancel,
      cdxIconCheck,
      cdxIconEdit,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconStar,
      cdxIconTrash,
      cdxIconUnStar,
      // Callbacks
      fireEvent,
      onOpenItemEditDialog,
      onOpenFormattedItemEditDialog,
      onFormattedItemEditDialogSubmit,
      onOpenUnformattedItemEditDialog,
      onUnformattedItemEditDialogSubmit,
      onDelete,
      deleteRelatedWordsList,
      onDeleteItem,
      onPin,
      onLock,
      onReset,
      userGenderSwitch: strings.userGenderSwitch,
      capitalize: strings.capitalize,
    };
  },
});
</script>

<template>
  <div class="cne-related-words-list">
    <cdx-field class="cne-box" is-fieldset>
      <template #label>
        {{ capitalize($props.sectionData.name) }}
        <span class="cne-fieldset-btns">
          <wiki-link
            v-if="$props.sectionData.helpPage"
            :page-title="$props.sectionData.helpPage"
          >
            <cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
          </wiki-link>

          <wiki-link
            v-if="$props.sectionData.conventionPage"
            :page-title="$props.sectionData.conventionPage"
          >
            <cdx-icon :icon="cdxIconInfoFilled"></cdx-icon>
          </wiki-link>

          <cdx-button
            v-if="!$props.disableDelete"
            type="button"
            size="small"
            action="destructive"
            aria-label="Supprimer"
            title="Supprimer"
            @click="onDelete"
          >
            <cdx-icon :icon="cdxIconTrash"></cdx-icon>
          </cdx-button>

          <template v-if="!$props.disableDelete">
            <cdx-button
              v-if="!sectionStatus"
              type="button"
              size="small"
              aria-label="Épingler"
              title="Épingler"
              @click="onPin"
            >
              <cdx-icon :icon="cdxIconStar"></cdx-icon>
            </cdx-button>

            <cdx-button
              v-if="sectionStatus === 'pinned'"
              type="button"
              size="small"
              aria-label="Désépingler"
              title="Désépingler"
              @click="onReset('pinned')"
            >
              <cdx-icon :icon="cdxIconUnStar"></cdx-icon>
            </cdx-button>
          </template>

          <cdx-button
            v-if="items.length || text"
            type="button"
            size="small"
            aria-label="Sauvegarder le contenu de cette section"
            title="Sauvegarder le contenu de cette section"
            @click="onLock"
          >
            <cdx-icon :icon="cdxIconCheck"></cdx-icon>
          </cdx-button>

          <cdx-button
            v-if="sectionStatus === 'locked'"
            type="button"
            size="small"
            aria-label="Supprimer la sauvegarde du contenu de cette section"
            title="Supprimer la sauvegarde du contenu de cette section"
            @click="onReset('locked')"
          >
            <cdx-icon :icon="cdxIconCancel"></cdx-icon>
          </cdx-button>
        </span>
      </template>

      <template #help-text>{{ $props.description }}</template>

      <input-with-toolbar
        v-if="isTextual"
        v-model="text"
        text-area
        @update:model-value="fireEvent()"
      >
      </input-with-toolbar>

      <template v-else>
        <div class="cne-related-words-buttons">
          <cdx-button
            type="button"
            action="progressive"
            @click="onOpenFormattedItemEditDialog(-1)"
          >
            <cdx-icon :icon="cdxIconAdd"></cdx-icon>
            Ajouter un mot
          </cdx-button>
          <cdx-button
            type="button"
            action="progressive"
            @click="onOpenUnformattedItemEditDialog(-1)"
          >
            <cdx-icon :icon="cdxIconAdd"></cdx-icon>
            Ajouter du texte libre
          </cdx-button>
        </div>

        <ul v-if="items.length">
          <li v-for="(item, i) in items" :key="item.id">
            <cdx-button
              type="button"
              size="small"
              action="destructive"
              aria-label="Supprimer"
              title="Supprimer"
              @click="onDeleteItem(i)"
            >
              <cdx-icon :icon="cdxIconTrash"></cdx-icon>
            </cdx-button>
            <cdx-button
              type="button"
              size="small"
              aria-label="Modifier"
              title="Modifier"
              @click="onOpenItemEditDialog(i)"
            >
              <cdx-icon :icon="cdxIconEdit"></cdx-icon>
            </cdx-button>

            <span v-if="'words' in item">
              <template v-for="(word, j) in item.words" :key="j">
                <wiki-link :page-title="word"></wiki-link
                >{{ j < item.words.length - 1 ? ", " : " " }}
              </template>
              <template v-if="item.annotation">
                <span
                  :class="{
                    'cne-words-annotation': true,
                    'cne-words-annotation-formatted':
                      !item.nonFormattedAnnotation,
                  }"
                >
                  <template v-if="item.nonFormattedAnnotation">
                    {{ item.annotation }}
                  </template>
                  <template v-else>({{ item.annotation }})</template>
                </span>
              </template>
            </span>
            <span v-else>
              {{ item.text }}
            </span>
          </li>
        </ul>
      </template>
    </cdx-field>
  </div>

  <cdx-dialog
    v-model:open="openFormattedItemEditDialog"
    class="cne-related-words-dialog"
    :title="
      capitalize($props.sectionData.name) +
      '\u00a0: ' +
      (addMode ? 'Ajout' : 'Modification') +
      ' de mot(s)'
    "
    :subtitle="$props.description"
    use-close-button
    :primary-action="formattedItemDialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="
      openFormattedItemEditDialog = false;
      onFormattedItemEditDialogSubmit();
    "
    @default="openFormattedItemEditDialog = false"
  >
    <cdx-field v-for="(word, i) in editedFormattedItem.words" :key="i">
      <template #label>
        {{ editedFormattedItem.words.length > 1 ? `Variante ${i + 1}` : "Mot" }}
        <span class="cne-fieldset-btns">
          <cdx-button
            v-if="editedFormattedItem.words.length > 1"
            type="button"
            size="small"
            action="destructive"
            aria-label="Supprimer"
            title="Supprimer"
            @click="editedFormattedItem.words.splice(i, 1)"
          >
            <cdx-icon :icon="cdxIconTrash"></cdx-icon>
          </cdx-button>
        </span>
      </template>
      <cdx-text-input
        :model-value="word"
        required
        clearable
        @update:model-value="editedFormattedItem.words[i] = $event.trim()"
      ></cdx-text-input>
    </cdx-field>

    <cdx-button
      type="button"
      action="progressive"
      @click="editedFormattedItem.words.push('')"
    >
      <cdx-icon :icon="cdxIconAdd"></cdx-icon>
      Ajouter une variante orthographique
    </cdx-button>

    <input-with-toolbar v-model="editedFormattedItem.annotation" clearable>
      <template #label>Annotation</template>
      <template #description>
        Le terme est-il familier, soutenu, plus rare, plus courant, etc.&nbsp;?
      </template>
    </input-with-toolbar>

    <cdx-field>
      <cdx-checkbox v-model="editedFormattedItem.nonFormattedAnnotation">
        Désactiver le formatage automatique de l’annotation
      </cdx-checkbox>
      <template #help-text>
        Par défaut l’annotation sera affichée en italique et entre parenthèses.
        Cochez cette case pour désactiver ce formatage.
      </template>
    </cdx-field>
  </cdx-dialog>

  <cdx-dialog
    v-model:open="openUnformattedItemEditDialog"
    class="cne-related-words-dialog"
    :title="
      capitalize($props.sectionData.name) +
      '\u00a0: ' +
      (addMode ? 'Ajout' : 'Modification') +
      ' de texte libre'
    "
    :subtitle="$props.description"
    use-close-button
    :primary-action="unformattedItemDialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="
      openUnformattedItemEditDialog = false;
      onUnformattedItemEditDialogSubmit();
    "
    @default="openUnformattedItemEditDialog = false"
  >
    <input-with-toolbar v-model="editedUnformattedItem.text" required clearable>
      <template #label>Texte</template>
    </input-with-toolbar>
  </cdx-dialog>

  <cdx-dialog
    v-model:open="openDeletionDialog"
    title="Confirmation de suppression"
    use-close-button
    :primary-action="deletionDialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="deleteRelatedWordsList"
    @default="openDeletionDialog = false"
  >
    Êtes-vous
    {{ userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de vouloir
    supprimer cette section&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.cne-related-words-buttons {
  display: flex;
  gap: 0.5em;
}

.cne-related-words-list {
  margin-bottom: 1em;
}

.cne-related-words-list ul {
  list-style-type: none;
  padding-left: 1em;
}

.cne-related-words-list ul > li {
  display: flex;
  gap: 0.5em;
  align-items: center;
  margin-bottom: 0.2em;
}

.cne-words-annotation.cne-words-annotation-formatted,
.cne-missing-definition {
  font-style: italic;
}

.cne-related-words-dialog {
  max-width: 60em;
}
/* </nowiki> */
</style>
