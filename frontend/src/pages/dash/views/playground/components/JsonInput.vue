<template>
  <div ref="parent" class="json-input inline-block w-full"></div>
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
  mounted() {
    let editor = new EditorView({
      extensions: [basicSetup, javascript()],
      parent: this.$refs.parent,
      doc: this.modelValue,
    });
    editor.dom.addEventListener("input", async () => {
      await this.$nextTick();
      let value = editor.state.doc.toString();
      this.$emit("change", value);
    });
  },
};
</script>
