<template>
  <div class="JsonEditor">
    <textarea :value="value" :class="{ invalid }" @change="onChange" />
  </div>
</template>
<script>
import { ref } from "vue";

function stringify(arg) {
  try {
    return JSON.stringify(arg, null, "    ");
  } catch (e) {
    return arg;
  }
}

export default {
  name: "JsonEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = ref(stringify(props.modelValue));
    const invalid = ref(false);
    const onChange = (event) => {
      const textAreaValue = event.target.value;
      try {
        const parsed = JSON.parse(textAreaValue);
        value.value = stringify(parsed);
        emit("update:modelValue", parsed);
        invalid.value = false;
      } catch (e) {
        invalid.value = true;
      }
    };
    return {
      onChange,
      value,
      invalid,
    };
  },
};
</script>
<style lang="scss">
.JsonEditor {
  @apply w-full;
  textarea {
    @apply w-full border  border-gray-400 outline-0 px-2 py-1;
    &.invalid {
      @apply border-red-400;
    }
  }
}
</style>
