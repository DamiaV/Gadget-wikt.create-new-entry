<script>
// <nowiki>
import { defineComponent, ref, useTemplateRef, watch } from "vue";
import { CdxField, CdxTextArea, CdxTextInput } from "@wikimedia/codex";
import strings from "../strings.js";
import templates from "../templates.js";
import wikitext from "../wikitext.js";
import EditTools from "./EditTools.vue";
import TemplateSelectionDialog from "./TemplateSelectionDialog.vue";

// </nowiki>
/**
 * A text input component with a toolbar.
 *
 * @see [[MediaWiki:Gadget-wikt.create-new-entry/components/EditTools.vue]]
 *
 * [[Catégorie:Vue.js du Wiktionnaire|create-new-entry/components/InputWithToolbar.vue]]
 */
// <nowiki>
export default defineComponent({
  components: {
    CdxField,
    CdxTextArea,
    CdxTextInput,
    EditTools,
    TemplateSelectionDialog,
  },

  props: {
    /**
     * Whether this input is disabled.
     */
    disabled: { type: Boolean, default: false },
    /**
     * Whether the wrapped text input should be required.
     */
    required: { type: Boolean, default: false },
    /**
     * Additional CSS classes to add to the wrapped text input.
     */
    inputClass: { type: String, default: "" },
    /**
     * Whether the wrapped text input should be a textarea instead of a single line.
     * Defaults to false.
     */
    textArea: { type: Boolean, default: false },
    /**
     * Whether the wrapped text input should be clearable.
     * Defaults to false.
     */
    clearable: { type: Boolean, default: false },
    /**
     * Whether to show the text-formatting buttons. If set to false, the template button will be hidden as well.
     * Defaults to true.
     */
    showFormatButtons: { type: Boolean, default: true },
    /**
     * Whether to show the template button. The showFormatButtons property needs to be set to true for this setting to work.
     * Defaults to true.
     */
    showTemplateButton: { type: Boolean, default: true },
    /**
     * An optional array of custom actions. Each action will be associated to a button.
     * @type {import("vue").PropType<import("./EditTools.vue").CustomAction[]>}
     */
    customActions: { type: Array, default: () => [] },
    /**
     * An optional validator function. If the function returns truthy string for the given text,
     * the returned string will be shown as a warning below the text input.
     * The function will be called for each input update.
     * @type {import("vue").PropType<(text: string) => string | null>}
     */
    validator: { type: Function, default: null },
    /**
     * An optional function that transforms the input’s text.
     * The function will be called for each input update.
     * @type {import("vue").PropType<(text: string) => string>}
     */
    transformer: { type: Function, default: null },
    /**
     * A list of insertable characters to show after the toolbar’s buttons.
     * Defaults to a list of useful French characters.
     * @type {import("vue").PropType<string[][]>}
     */
    specialCharacters: {
      type: Array,
      default: () => [wikitext.specialCharacters],
    },
    /**
     * The input’s placeholder text.
     */
    placeholder: { type: String, default: "" },
    /**
     * The input’s text.
     */
    modelValue: { type: String, required: true },
  },

  emits: ["update:model-value", "change"],

  setup(props, ctx) {
    const value = ref(props.modelValue);
    const status = ref("default");
    const messages = ref({
      error: "",
    });
    const textInputType = props.textArea ? CdxTextArea : CdxTextInput;

    // Necessary in some cases, I don’t know why…
    watch(
      () => props.modelValue,
      (newValue) => (value.value = newValue)
    );

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
        status.value = "error";
        messages.value.error = message;
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
      if (event.target) {
        messages.value.error = event.target.validationMessage;
        event.target.dispatchEvent(
          new Event("empty-field", {
            bubbles: true,
          })
        );
      }
    }

    /**
     * Transform the text of the wrapped input using the given transformer function.
     * @param {(beforeSelection: string, selection: string, afterSelection: string) => string} tranformer A function to apply to the text.
     * @param {boolean?} extractWhitespace If true, extract the trailing whitespace from the selection.
     */
    function transformText(tranformer, extractWhitespace = false) {
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
      let beforeSelection = text.substring(0, selectionStart);
      let selection = text.substring(selectionStart, selectionEnd);
      let afterSelection = text.substring(selectionEnd);

      if (extractWhitespace) {
        const [wsLeft, text, wsRight] =
          strings.extractTrailingWhitespace(selection);
        beforeSelection += wsLeft;
        selection = text;
        afterSelection = wsRight + afterSelection;
      }

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
      if (props.disabled) return;
      transformText(
        (beforeSelection, _, afterSelection) =>
          `${beforeSelection}${char}${afterSelection}`
      );
    }

    /**
     * Insert a wikilink around the current selection.
     */
    function onInsertLink() {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}[[${selection}]]${afterSelection}`,
        true
      );
    }

    /**
     * Insert an external link around the current selection.
     */
    function onInsertExtLink() {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}[${selection} ]${afterSelection}`,
        true
      );
    }

    /**
     * Insert quotes around the current selection.
     */
    function onInsertQuotes() {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}«\u00a0${selection}\u00a0»${afterSelection}`,
        true
      );
    }

    /**
     * Insert the given tags around the current selection.
     * @param {string} tagName The name of the tag to insert.
     */
    function onInsertTag(tagName) {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}<${tagName}>${selection}</${tagName}>${afterSelection}`,
        true
      );
    }

    /**
     * Wrap the input’s selected text with `''' '''` to make it bold.
     */
    function onBold() {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}'''${selection}'''${afterSelection}`,
        true
      );
    }

    /**
     * Wrap the input’s selected text with `'' ''` to make it italicized.
     */
    function onItalic() {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}''${selection}''${afterSelection}`,
        true
      );
    }

    /**
     * Apply the given action to the selected text.
     * @param {(selectedText: string) => string} action The action to perform.
     */
    function onCustomAction(action) {
      if (props.disabled) return;
      transformText(
        (beforeSelection, selection, afterSelection) =>
          `${beforeSelection}${action(selection)}${afterSelection}`,
        true
      );
    }

    /**
     * Insert the given template.
     * @param {import("../templates.js").FilledTemplate} filledTemplate The filled template’s data.
     */
    function onInsertTemplate(filledTemplate) {
      if (props.disabled) return;
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
      onInsertExtLink,
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
        v-if="$props.showFormatButtons || $props.specialCharacters.length"
        :show-format-buttons="$props.showFormatButtons"
        :show-template-button="$props.showTemplateButton"
        :characters="$props.specialCharacters"
        :custom-actions="$props.customActions"
        @style:bold="onBold"
        @style:italic="onItalic"
        @insert:char="onInsertChar"
        @insert:link="onInsertLink"
        @insert:ext-link="onInsertExtLink"
        @insert:quotes="onInsertQuotes"
        @insert:nowiki="onInsertTag('nowiki')"
        @insert:subscript="onInsertTag('sub')"
        @insert:superscript="onInsertTag('sup')"
        @insert:code="onInsertTag('code')"
        @insert:ref="onInsertTag('ref')"
        @insert:template="openTemplateDialog = !$props.disabled"
        @custom-action="onCustomAction"
      ></edit-tools>
      <component
        :is="textInputType"
        ref="textInput"
        v-model.trim="value"
        :required="$props.required"
        :clearable="$props.clearable"
        :disabled="$props.disabled"
        :class="$props.inputClass || 'wikitext'"
        :placeholder="$props.placeholder"
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

<style>
/* </nowiki> */
</style>
