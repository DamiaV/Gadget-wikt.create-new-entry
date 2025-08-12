<script>
import { defineComponent, ref } from "vue";
import { CdxField, CdxTextArea, CdxTextInput } from "@wikimedia/codex";
import EditTools from "./EditTools.vue";
import W from "../wikitext.js";

export default defineComponent({
  components: {
    CdxField,
    CdxTextInput,
    CdxTextArea,
    EditTools,
  },
  props: {
    required: { type: Boolean, default: false },
    textArea: { type: Boolean, default: false },
    showFormatButtons: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<string[][]>}
     */
    specialCharacters: { type: Array, default: () => [W.specialCharacters] },
    modelValue: { type: String, required: true },
  },
  emits: ["update:model-value"],
  setup(props, ctx) {
    const value = ref(props.modelValue);
    const status = ref("default");
    const messages = ref({
      error: "",
    });
    const textInputType = props.textArea ? CdxTextArea : CdxTextInput;

    /**
     * Called when the input’s text is updated.
     * @param {string} text The new text.
     */
    function onInput(text) {
      value.value = text;
      status.value = "default";
      messages.value.error = "";
      ctx.emit("update:model-value", text);
    }

    /**
     * @param {Event} event
     */
    function onInvalid(event) {
      status.value = "error";
      if (event.target) messages.value.error = event.target.validationMessage;
    }

    /**
     * Insert the given character(s) into the text input.
     * @param {string} char The character(s) to insert.
     */
    function onInsertChar(char) {
      console.log(char); // TODO
    }

    return {
      textInputType,
      value,
      status,
      messages,
      onInput,
      onInvalid,
      onInsertChar,
    };
  },
});
</script>

<template>
  <cdx-field :status="status" :messages="messages">
    <edit-tools
      :show-format-buttons="$props.showFormatButtons"
      :characters="$props.specialCharacters"
      @insert-char="onInsertChar"
    ></edit-tools>
    <component
      :is="textInputType"
      :required="required"
      :model-value="value"
      @update:model-value="onInput"
      @invalid="onInvalid"
    ></component>
    <template #label><slot name="label"></slot></template>
    <template #description><slot name="description"></slot></template>
    <template #help-text><slot name="help-text"></slot></template>
  </cdx-field>
</template>
