<template>
  <div v-for="(val, key) in options" :key="key" class="option">
    <div v-if="!val.fields && checkOptional(val)" class="row">
      <div class="label flex gap-1 whitespace-nowrap">
        <div class="text" v-text="key"></div>
        <div class="type opacity-50" v-text="'(' + val.type + ')'"></div>
      </div>
      <JsonInput
        v-if="val.type === 'json'"
        class="input"
        :model-value="val.value"
        @update:model-value="val.value = $event"
      />
      <input
        v-if="val.type !== 'json'"
        v-model="val.value"
        class="input"
        type="text"
      />
    </div>
    <template v-if="val.fields && checkOptional(val)">
      <ActionOptions :options="val.fields" :show-optionals="showOptionals" />
    </template>
  </div>
</template>

<script>
import JsonInput from "./JsonInput.vue";

export default {
  name: "ActionOptions",
  components: { JsonInput },
  props: {
    options: {
      type: Object,
      required: true,
    },
    showOptionals: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["@update:form"],
  data() {
    return {
      t_form: this.form,
    };
  },
  methods: {
    onUpdate(val, $event) {
      console.log("updated", val, $event);
    },
    checkOptional(val) {
      if (this.showOptionals) {
        return true;
      }
      return !val.optional;
    },
  },
};
</script>

<style lang="scss">
.option {
  @apply flex flex-col;
  .row {
    @apply grid grid-cols-8 gap-2 mb-2;
    .label {
      @apply col-span-1;
    }
    .input {
      @apply col-span-7;
    }
  }
  input {
    @apply border border-gray-200 dark:border-gray-500 mx-2 px-2 py-1 outline-gray-300
    dark:outline-gray-400;
  }
}
</style>
