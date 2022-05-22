<template>
  <div class="Field">
    <div class="key">
      <label for="key">Field</label>
      <br />
      <input
        id="key"
        name="key"
        :value="fieldKey"
        placeholder="key"
        @change="$emit('update:field-key', $event.target.value, fieldKey)"
      />
      <div class="dotted-line"></div>
    </div>
    <div class="equal">=</div>
    <div class="type">
      <label for="type">Type</label>
      <br />
      <select id="type" :value="type">
        <option value="text" v-text="'text'" />
        <option value="number" v-text="'number'" />
      </select>
    </div>
    <div class="value">
      <label for="value">Value</label>
      <br />
      <input
        id="value"
        :value="fieldValue"
        name="value"
        placeholder="value"
        @change="$emit('update:field-value', $event.target.value)"
      />
    </div>
    <button v-if="fieldKey" class="remove-icon">
      <RemoveIcon
        class="icon"
        width="24"
        height="24"
        @click="$emit('remove')"
      />
    </button>
  </div>
</template>
<script>
import RemoveIcon from "ionicons/dist/svg/remove-circle-outline.svg";

export default {
  name: "DocumentField",
  components: { RemoveIcon },
  props: {
    fieldKey: {
      type: String,
      required: true,
      default: "",
    },
    fieldValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selected_type: null,
    };
  },
  computed: {
    type() {
      const { selected_type } = this;
      if (selected_type) return selected_type;
      if (!isNaN(this.fieldValue)) return "number";
      return "text";
    },
  },
};
</script>
<style lang="scss">
.Field {
  @apply flex gap-2 items-center pl-8;

  .key {
    position: relative;
    input {
      max-width: 100px;
    }
    .dotted-line {
      @apply absolute;
      left: -20px;
      height: 2px;
      width: 20px;
      bottom: 1rem;
      background-image: linear-gradient(
        to right,
        rgba(black, 0.5) 33%,
        rgba(255, 255, 255, 0) 0%
      );
      background-position: bottom;
      background-size: 6px 2px;
      background-repeat: repeat-x;
    }
  }
  .type {
    select {
    }
  }
  .equal {
    @apply mt-auto mb-1 opacity-75;
  }

  .remove-icon {
    @apply mt-6 cursor-pointer;
    width: 24px;
    height: 24px;
    path {
      stroke: theme("colors.gray.500");
    }
  }
}
</style>
