<!-- <nowiki> -->
<script>
import { computed, defineComponent, inject, reactive, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxField,
  CdxIcon,
  CdxTextInput,
} from "@wikimedia/codex";
import {
  cdxIconAdd,
  cdxIconEdit,
  cdxIconHelpNotice,
  cdxIconInfoFilled,
  cdxIconTrash,
} from "@wikimedia/codex-icons";
import T from "../types.js";
import utils from "../utils.js";
import InputWithToolbar from "./InputWithToolbar.vue";
import WikiLink from "./WikiLink.vue";

export default defineComponent({
  components: {
    CdxButton,
    CdxDialog,
    CdxField,
    CdxIcon,
    CdxTextInput,
    InputWithToolbar,
    WikiLink,
  },

  props: {
    sectionType: { type: String, required: true },
    /**
     * @type {import("vue").PropType<import("../types.js").SectionData>}
     */
    sectionData: { type: Object, required: true },
    description: { type: String, default: "" },
    /**
     * @type {import("vue").PropType<import("../types.js").RelatedWord[]>}
     */
    modelValue: { type: Array, required: true },
  },

  emits: ["update:model-value", "delete"],

  setup(props, ctx) {
    /**
     * @type {import("vue").Ref<import("../types.js").RelatedWord[]>}
     */
    const items = ref(props.modelValue);

    function isEmpty() {
      return items.value.every((relatedWord) =>
        relatedWord.words.every((word) => !word)
      );
    }

    function fireEvent() {
      /**
       * @type {import("../types.js").RelatedWord[]}
       */
      const firedEvent = [];
      for (const item of items.value) {
        firedEvent.push({
          id: item.id,
          words: Array.from(item.words),
          annotation: item.annotation,
          empty: isEmpty(),
        });
      }
      ctx.emit("update:model-value", firedEvent);
    }

    /*
     * Edit dialog
     */

    const openEditDialog = ref(false);
    /**
     * @type {import("vue").Reactive<import("../types.js").RelatedWord>}
     */
    const editedItem = reactive(T.createEmptyRelatedWord());
    const isDialogValid = computed(
      () =>
        editedItem.words.length !== 0 &&
        editedItem.words.every((word) => !!word.trim())
    );
    const editedItemIndex = ref(-1);
    const addMode = computed(() => editedItemIndex.value < 0);

    /**
     * @type {import("vue").ComputedRef<import("@wikimedia/codex").PrimaryModalAction>}
     */
    const dialogPrimaryAction = computed(() => ({
      label: addMode.value ? "Ajouter" : "Appliquer",
      actionType: "progressive",
      disabled: !isDialogValid.value,
    }));
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const dialogDefaultAction = {
      label: "Annuler",
    };

    /**
     * Add or edit an item.
     * @param {number} index The index of the item to edit. Leave empty to create a new one.
     */
    function onOpenEditDialog(index) {
      editedItemIndex.value = index;
      if (addMode.value) {
        editedItem.words = [""];
        editedItem.annotation = "";
      } else {
        const item = items.value[index];
        editedItem.id = item.id;
        editedItem.words = Array.from(item.words);
        editedItem.annotation = item.annotation;
      }
      openEditDialog.value = true;
    }

    function onEditDialogSubmit() {
      const words = Array.from(editedItem.words);
      if (addMode.value) {
        items.value.push({
          id: utils.getNextId(items.value),
          words: words,
          annotation: editedItem.annotation,
        });
      } else {
        const item = items.value[editedItemIndex.value];
        item.words = words;
        item.annotation = editedItem.annotation;
      }
      items.value.sort((i1, i2) =>
        i1.words[0].toLowerCase().localeCompare(i2.words[0].toLowerCase())
      );
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
      if (isEmpty()) deleteRelatedWordsList();
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

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");

    return {
      // Data
      items,
      // Other
      utils,
      config,
      // Dialogs
      dialogPrimaryAction,
      dialogDefaultAction,
      openEditDialog,
      addMode,
      editedItem,
      editedItemIndex,
      deletionDialogPrimaryAction,
      openDeletionDialog,
      // Icons
      cdxIconAdd,
      cdxIconEdit,
      cdxIconHelpNotice,
      cdxIconInfoFilled,
      cdxIconTrash,
      // Callbacks
      onOpenEditDialog,
      onEditDialogSubmit,
      onDelete,
      deleteRelatedWordsList,
      onDeleteItem,
    };
  },
});
</script>

<template>
  <div class="cne-related-words-list">
    <cdx-field class="cne-box" is-fieldset>
      <template #label>
        {{ utils.capitalize($props.sectionData.name) }}
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
            type="button"
            size="small"
            action="destructive"
            aria-label="Supprimer"
            title="Supprimer"
            @click="onDelete"
          >
            <cdx-icon :icon="cdxIconTrash"></cdx-icon>
          </cdx-button>
        </span>
      </template>
      <template #help-text>{{ $props.description }}</template>
      <cdx-button
        type="button"
        action="progressive"
        @click="onOpenEditDialog(-1)"
      >
        <cdx-icon :icon="cdxIconAdd"></cdx-icon>
        Ajouter
      </cdx-button>
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
            @click="onOpenEditDialog(i)"
          >
            <cdx-icon :icon="cdxIconEdit"></cdx-icon>
          </cdx-button>

          <span>
            <template v-for="(word, j) in item.words" :key="j">
              <wiki-link :page-title="word"></wiki-link
              >{{ j < item.words.length - 1 ? ", " : "" }}
            </template>
            <template v-if="item.annotation">
              <span class="cne-words-annotation">
                ({{ item.annotation }})
              </span>
            </template>
          </span>
        </li>
      </ul>
    </cdx-field>
  </div>

  <cdx-dialog
    v-model:open="openEditDialog"
    :title="utils.capitalize($props.sectionData.name)"
    :subtitle="$props.description"
    use-close-button
    :primary-action="dialogPrimaryAction"
    :default-action="dialogDefaultAction"
    @primary="
      openEditDialog = false;
      onEditDialogSubmit();
    "
    @default="openEditDialog = false"
  >
    <cdx-field v-for="(word, i) in editedItem.words" :key="i">
      <template #label>
        {{ editedItem.words.length > 1 ? `Variante ${i + 1}` : "Mot" }}
        <span class="cne-fieldset-btns">
          <cdx-button
            v-if="editedItem.words.length > 1"
            type="button"
            size="small"
            action="destructive"
            aria-label="Supprimer"
            title="Supprimer"
            @click="editedItem.words.splice(i, 1)"
          >
            <cdx-icon :icon="cdxIconTrash"></cdx-icon>
          </cdx-button>
        </span>
      </template>
      <cdx-text-input
        :model-value="word"
        required
        clearable
        @update:model-value="editedItem.words[i] = $event.trim()"
      ></cdx-text-input>
    </cdx-field>

    <cdx-button
      type="button"
      action="progressive"
      @click="editedItem.words.push('')"
    >
      <cdx-icon :icon="cdxIconAdd"></cdx-icon>
      Ajouter une variante
    </cdx-button>

    <cdx-field>
      <template #label>Annotation</template>
      <template #description>
        Le terme est-il familier, soutenu, plus rare, plus courant, etc.&nbsp;?
      </template>
      <input-with-toolbar
        v-model="editedItem.annotation"
        clearable
        :show-format-buttons="false"
        :show-template-button="false"
      ></input-with-toolbar>
    </cdx-field>
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
    {{ utils.userGenderSwitch(config.userGender, "sûr·e", "sûre", "sûr") }} de
    vouloir supprimer cette section&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
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

.cne-words-annotation,
.cne-missing-definition {
  font-style: italic;
}
</style>
<!-- </nowiki> -->
