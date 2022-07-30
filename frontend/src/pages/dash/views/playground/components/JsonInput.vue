<template>
  <div
    ref="parent"
    class="json-input inline-block w-full"
    :class="{ invalid }"
  ></div>
</template>
<script>
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default {
  name: "JsonInput",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["@update:modelValue"],
  data() {
    return {
      invalid: false,
    };
  },
  mounted() {
    let editor = new EditorView({
      extensions: [basicSetup, javascript()],
      parent: this.$refs.parent,
      doc: this.modelValue,
    });
    let updateValue = async () => {
      await this.$nextTick();
      let value = editor.state.doc.toString();
      try {
        value = JSON.parse(value);
        this.$emit("change", value);
        this.invalid = false;
      } catch (e) {
        this.invalid = true;
      }
    };
    //todo find a better way to update value
    editor.dom.addEventListener("input", updateValue);
    editor.dom.addEventListener("keydown", updateValue);
  },
};
</script>
<style lang="scss">
.json-input {
  @apply border-2 border-transparent rounded;
  &.invalid {
    @apply border-red-500;
  }
}
.cm-editor {
  @apply  border border-gray-100;
}
.ͼ1 .cm-lineNumbers .cm-gutterElement {
  @apply text-gray-500;
}
.ͼ2 .cm-activeLine {
  @apply bg-white;
}
.ͼ2 .cm-gutters {
  @apply bg-gray-100;
}
.ͼ2 .cm-activeLineGutter {
  @apply bg-gray-200;
}
</style>
