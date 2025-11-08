<script>
// <nowiki>
import { CdxField, CdxRadio } from "@wikimedia/codex";
import { defineComponent, ref } from "vue";

// </nowiki>
/**
 * A component that shows a list of radio buttons belonging to the same group.
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/RadioList.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxField,
    CdxRadio,
  },

  props: {
    label: { type: String, required: true },
    /**
     * @type {import("vue").PropType<import("@wikimedia/codex").MenuItemData[]>}
     */
    menuItems: { type: Array, required: true },
    selected: { type: String, required: true },
    name: { type: String, required: true },
  },

  emits: ["update:selected"],

  setup(props, ctx) {
    // UUID to avoid collisions of radio groups
    const uuid = crypto.randomUUID();
    const selectedValue = ref(props.selected);

    /**
     * Emit an update event for the given value.
     * @param {string} value The selected value.
     */
    function onUpdate(value) {
      ctx.emit("update:selected", value);
    }

    return {
      // Data
      selectedValue,
      // Other
      uuid,
      // Callbacks
      onUpdate,
    };
  },
});
</script>

<template>
  <cdx-field>
    <template #label>{{ $props.label }}</template>
    <cdx-radio
      v-for="item in $props.menuItems"
      :key="item.value"
      :name="`${$props.name}-${uuid}`"
      :model-value="selectedValue"
      :input-value="item.value"
      @update:model-value="onUpdate"
    >
      {{ item.label }}
      <template #description>
        {{ item.description }}
      </template>
    </cdx-radio>
  </cdx-field>
</template>

<style>
/* </nowiki> */
</style>
