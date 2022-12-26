<template>
  <div class="DocumentEditor">
    <template v-for="(key, index) in Object.keys(document)" :key="index">
      <DocumentField
        :field-key="String(key)"
        :field-value="document[key]"
        @update:field-key="onKeyChange"
        @update:field-value="onValueChanged(key, $event)"
        @remove="removeField(key)"
      />
    </template>
  </div>
</template>
<script>
import DocumentField from "./DocumentField.vue";
import { getLogger } from "../../../../../plugins/log";
const log = getLogger("document-editor");

export default {
  name: "DocumentEditor",
  components: { DocumentField },
  props: {
    modelValue: {
      default: {},
    },
  },
  data() {
    return {
      document: this.modelValue || {
        "": "",
      },
      render_counter: 1,
    };
  },
  watch: {
    render_counter() {
      if (!Object.keys(this.document).find((it) => it === "")) {
        this.document[""] = "";
      }
    },
  },
  mounted() {
    this.render_counter++;
  },
  methods: {
    onKeyChange(newKey, oldKey) {
      log.debug(`on key changed, new:${newKey}, old:${oldKey}`);
      this.document[String(newKey)] = this.document[oldKey];
      delete this.document[oldKey];
      log.debug("after: ", this.document);
      this.render_counter++;
      this.fireUpdate();
    },
    onValueChanged(key, value) {
      log.debug("onValueChanged", key, typeof key, value, typeof value);
      this.document[String(key)] = value;
      this.render_counter++;
      this.fireUpdate();
    },
    fireUpdate() {
      const value = { ...this.document };
      delete value[""];
      console.log("check", value);
      this.$emit("update:modelValue", value);
    },
    removeField(key) {
      if (!key) return;
      delete this.document[key];
      this.fireUpdate();
    },
  },
};
</script>
<style lang="scss">
.Field {
  @apply py-2;
}
</style>
