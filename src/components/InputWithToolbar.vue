<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
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
     * @type {Readonly<import("vue").ShallowRef<CdxTextArea | CdxTextInput>>}
     */
    const textInput = useTemplateRef("textInput");

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
     * Transform the text of the wrapped input with the given transformer function.
     * @param {(beforeSelection: string, selection: string, afterSelection: string) => string} tranformer A function to apply to the text.
     */
    function transformText(tranformer) {
      /**
       * @type {HTMLInputElement | HTMLTextAreaElement}
       */
      let node;
      // Dig into the component’s refs to get to the actual DOM element
      const refs = textInput.value.$refs;
      if (refs.input) node = refs.input;
      else if (refs.textarea) node = refs.textarea;
      else return;
      const selectionStart = node.selectionStart;
      const selectionEnd = node.selectionEnd;
      const text = value.value;
      const beforeSelection = text.substring(0, selectionStart);
      const selection = text.substring(selectionStart, selectionEnd);
      const afterSelection = text.substring(selectionEnd);

      value.value = tranformer(beforeSelection, selection, afterSelection);
      textInput.value.focus();
    }

    /**
     * Insert the given character(s) into the text input at the cursor position.
     * @param {string} char The character(s) to insert.
     */
    function onInsertChar(char) {
      transformText(
        (beforeSelection, _, afterSelection) =>
          `${beforeSelection}${char}${afterSelection}`
      );
    }

    /**
     * Wrap the input’s selected text with `''' '''` to make it bold.
     */
    function onBold() {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}'''${selection}'''${afterSelection}`
      );
    }

    /**
     * Wrap the input’s selected text with `'' ''` to make it italicized.
     */
    function onItalic() {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}''${selection}''${afterSelection}`
      );
    }

    return {
      textInputType,
      value,
      status,
      messages,
      onInput,
      onInvalid,
      onInsertChar,
      onBold,
      onItalic,
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
      @style:bold="onBold"
      @style:italic="onItalic"
    ></edit-tools>
    <component
      :is="textInputType"
      ref="textInput"
      v-model="value"
      :required="required"
      @update:model-value="onInput"
      @invalid="onInvalid"
    ></component>
    <template #label><slot name="label"></slot></template>
    <template #description><slot name="description"></slot></template>
    <template #help-text><slot name="help-text"></slot></template>
  </cdx-field>
</template>
<!-- </nowiki> -->
