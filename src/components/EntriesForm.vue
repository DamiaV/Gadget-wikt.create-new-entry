<!-- <nowiki> -->
<script>
import { defineComponent, inject, ref } from "vue";
import {
  CdxButton,
  CdxDialog,
  CdxIcon,
  CdxTab,
  CdxTabs,
} from "@wikimedia/codex";
import { cdxIconAdd } from "@wikimedia/codex-icons";
import EntryForm from "./EntryForm.vue";
import T from "../types.js";
import utils from "../utils.js";

export default defineComponent({
  components: {
    CdxTabs,
    CdxTab,
    CdxButton,
    CdxIcon,
    CdxDialog,
    EntryForm,
  },
  inject: ["config"],
  props: {
    language: { type: T.Language, required: true },
    /**
     * @type {import("vue").PropType<import("../types.js").Entry[]>}
     */
    modelValue: { type: Array, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const entries = ref(props.modelValue);

    function fireEvent() {
      /**
       * @type {import("../types.js").FormEntriesUpdateEvent}
       */
      const firedEvent = {
        entries: entries.value,
      };
      ctx.emit("update:model-value", firedEvent);
    }

    const openDialog = ref(false);
    const entryIndexToDelete = ref(-1);

    /**
     * @type {import("@wikimedia/codex").PrimaryModalAction}
     */
    const primaryAction = {
      label: "Supprimer",
      actionType: "destructive",
    };
    /**
     * @type {import("@wikimedia/codex").ModalAction}
     */
    const defaultAction = {
      label: "Annuler",
    };

    const activeTab = ref("tab-1");

    function onAddEntry() {
      const id = Math.max(...entries.value.map((e) => e.id)) + 1;
      entries.value.push({
        id,
        definitions: [
          {
            text: "",
            examples: [],
          },
        ],
      });
      activeTab.value = `tab-${id}`;
      fireEvent();
    }

    /**
     * @param {import("../types.js").FormEntryUpdateEvent} event
     */
    function onEntryUpdate(event) {
      entries.value[event.index] = event.entry;
      fireEvent();
    }

    /**
     * Called when the "delete" action of the deletion dialog is clicked.
     */
    function onDeleteConfirm() {
      openDialog.value = false;
      const index = entryIndexToDelete.value;
      const entriesNb = entries.value.length;
      if (index < 0 || index >= entriesNb) return;

      const nearestEntry =
        index === entriesNb - 1
          ? entries.value[entriesNb - 2]
          : entries.value[index + 1];
      entries.value.splice(index, 1);
      activeTab.value = `tab-${nearestEntry.id}`;
      fireEvent();
    }

    /**
     * Move the given entry one position to the left.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryLeft(entryIndex) {
      if (entryIndex === 0) return;
      const entry = entries.value.splice(entryIndex, 1)[0];
      entries.value.splice(entryIndex - 1, 0, entry);
      fireEvent();
    }

    /**
     * Move the given entry one position to the right.
     * @param {number} entryIndex The index of the entry to move.
     */
    function onMoveEntryRight(entryIndex) {
      if (entryIndex === entries.value.length - 1) return;
      const entry = entries.value.splice(entryIndex, 1)[0];
      entries.value.splice(entryIndex + 1, 0, entry);
      fireEvent();
    }

    /**
     * @type {import("../types.js").AppConfig}
     */
    const config = inject("config");
    const gender = config.userGender;

    return {
      entries,
      activeTab,
      openDialog,
      entryIndexToDelete,
      primaryAction,
      defaultAction,
      gender,
      utils,
      cdxIconAdd,
      onAddEntry,
      onEntryUpdate,
      onDeleteConfirm,
      onMoveEntryLeft,
      onMoveEntryRight,
    };
  },
});
</script>

<template>
  <cdx-button
    type="button"
    class="add-entry-btn"
    action="progressive"
    @click="onAddEntry"
  >
    <cdx-icon :icon="cdxIconAdd"></cdx-icon>
    Ajouter une entrée
  </cdx-button>

  <cdx-tabs v-model:active="activeTab">
    <cdx-tab
      v-for="(entry, i) in entries"
      :key="entry.id"
      :name="`tab-${entry.id}`"
      :label="`Entrée ${entry.id}`"
    >
      <entry-form
        :index="i"
        :language="$props.language"
        :model-value="entry"
        :enable-delete-btn="entries.length > 1"
        :can-move-left="i != 0"
        :can-move-right="i < entries.length - 1"
        @update:model-value="onEntryUpdate"
        @delete="
          entryIndexToDelete = $event;
          openDialog = true;
        "
        @move:left="onMoveEntryLeft"
        @move:right="onMoveEntryRight"
      ></entry-form>
    </cdx-tab>
    <cdx-tab name="etymology" label="Étymologie">🚧 En construction 🏗️</cdx-tab>
    <cdx-tab name="wiki-links" label="Liens wikis"
      >🚧 En construction 🏗️</cdx-tab
    >
    <cdx-tab name="references" label="Références"
      >🚧 En construction 🏗️</cdx-tab
    >
    <cdx-tab name="categories" label="Catégories"
      >🚧 En construction 🏗️</cdx-tab
    >
  </cdx-tabs>

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
    vouloir supprimer cette entrée&nbsp;?
    <template #footer-text>Cette action est irréversible.</template>
  </cdx-dialog>
</template>

<style>
.add-entry-btn {
  margin: 0.5em 0;
}
</style>
<!-- </nowiki> -->
