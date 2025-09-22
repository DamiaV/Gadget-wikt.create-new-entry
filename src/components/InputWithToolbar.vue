<!-- <nowiki> -->
<script>
import { defineComponent, ref, useTemplateRef } from "vue";
import { CdxField, CdxTextArea, CdxTextInput } from "@wikimedia/codex";
import EditTools from "./EditTools.vue";
import W from "../wikitext.js";
import templates from "../templates.js";
import TemplateSelectionDialog from "./TemplateSelectionDialog.vue";

export default defineComponent({
  components: {
    CdxField,
    CdxTextInput,
    CdxTextArea,
    EditTools,
    TemplateSelectionDialog,
  },

  props: {
    required: { type: Boolean, default: false },
    textArea: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    showFormatButtons: { type: Boolean, default: true },
    showTemplateButton: { type: Boolean, default: true },
    /**
     * @type {import("vue").PropType<import("./EditTools.vue").CustomAction[]>}
     */
    customActions: { type: Array, default: () => [] },
    /**
     * @type {import("vue").PropType<(text: string) => string | null>}
     */
    validator: { type: Function, default: null },
    /**
     * @type {import("vue").PropType<(text: string) => string>}
     */
    transformer: { type: Function, default: null },
    /**
     * @type {import("vue").PropType<string[][]>}
     */
    specialCharacters: { type: Array, default: () => [W.specialCharacters] },
    modelValue: { type: String, required: true },
  },

  emits: ["update:model-value", "change"],

  setup(props, ctx) {
    const value = ref(props.modelValue);
    const status = ref("default");
    const messages = ref({
      error: "",
      warning: "",
    });
    const textInputType = props.textArea ? CdxTextArea : CdxTextInput;

    /**
     * @type {Readonly<import("vue").ShallowRef<import("@wikimedia/codex").CdxTextArea | import("@wikimedia/codex").CdxTextInput>>}
     */
    const textInput = useTemplateRef("textInput");

    const openTemplateDialog = ref(false);

    /**
     * Called when the input’s text is updated.
     */
    function onInput() {
      if (props.transformer) value.value = props.transformer(value.value);
      let message;
      if (props.validator && (message = props.validator(value.value))) {
        status.value = "warning";
        messages.value.warning = message;
      } else {
        status.value = "default";
      }
      ctx.emit("update:model-value", value.value);
    }

    /**
     * @param {Event} event
     */
    function onInvalid(event) {
      status.value = "error";
      if (event.target) messages.value.error = event.target.validationMessage;
    }

    /**
     * Transform the text of the wrapped input using the given transformer function.
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
      ctx.emit("update:model-value", value.value);
      ctx.emit("change", value.value);
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
     * Insert a wikilink around the current selection.
     */
    function onInsertLink() {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}[[${selection}]]${afterSelection}`
      );
    }

    /**
     * Insert quotes around the current selection.
     */
    function onInsertQuotes() {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}«\u00a0${selection}\u00a0»${afterSelection}`
      );
    }

    /**
     * Insert the given tags around the current selection.
     * @param {string} tagName The name of the tag to insert.
     */
    function onInsertTag(tagName) {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}<${tagName}>${selection}</${tagName}>${afterSelection}`
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

    /**
     * Apply the given action to the selected text.
     * @param {(selectedText: string) => string} action The action to perform.
     */
    function onCustomAction(action) {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}${action(selection)}${afterSelection}`
      );
    }

    /**
     * Insert the given template.
     * @param {import("../templates.js").FilledTemplate} filledTemplate The filled template’s data.
     */
    function onInsertTemplate(filledTemplate) {
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}${templates.templateToString(filledTemplate)}${selection}${afterSelection}`
      );
    }

    return {
      // Data
      textInputType,
      value,
      // Visual
      openTemplateDialog,
      status,
      messages,
      // Callbacks
      onInput,
      onInvalid,
      onInsertChar,
      onInsertLink,
      onInsertQuotes,
      onInsertTag,
      onBold,
      onItalic,
      onCustomAction,
      onInsertTemplate,
    };
  },
});
</script>

<template>
  <div>
    <cdx-field :status="status" :messages="messages">
      <edit-tools
        :show-format-buttons="$props.showFormatButtons"
        :show-template-button="$props.showTemplateButton"
        :characters="$props.specialCharacters"
        :custom-actions="$props.customActions"
        @style:bold="onBold"
        @style:italic="onItalic"
        @insert:char="onInsertChar"
        @insert:link="onInsertLink"
        @insert:quotes="onInsertQuotes"
        @insert:nowiki="onInsertTag('nowiki')"
        @insert:subscript="onInsertTag('sub')"
        @insert:superscript="onInsertTag('sup')"
        @insert:code="onInsertTag('code')"
        @insert:ref="onInsertTag('ref')"
        @insert:template="openTemplateDialog = true"
        @custom-action="onCustomAction"
      ></edit-tools>
      <component
        :is="textInputType"
        ref="textInput"
        v-model.trim="value"
        :required="$props.required"
        :clearable="$props.clearable"
        @update:model-value="onInput"
        @change="$emit('change', value)"
        @invalid="onInvalid"
      ></component>
      <template #label><slot name="label"></slot></template>
      <template #description><slot name="description"></slot></template>
      <template #help-text><slot name="help-text"></slot></template>
    </cdx-field>

    <template-selection-dialog
      v-model:open="openTemplateDialog"
      @insert="onInsertTemplate"
    ></template-selection-dialog>
  </div>
</template>
<!-- </nowiki> -->
