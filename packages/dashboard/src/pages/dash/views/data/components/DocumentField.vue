<template>
  <div class="Field">
    <div class="key">
      <label for="key">Field</label>
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
      <select
        id="type"
        :value="type"
        @change="selected_type = $event.target.value"
      >
        <option value="text" v-text="'text'" />
        <option value="number" v-text="'number'" />
        <option value="boolean" v-text="'boolean'" />
        <option value="date-time" v-text="'date-time'" />
        <option value="array" v-text="'array'" />
        <option value="map" v-text="'map'" />
      </select>
    </div>
    <div class="value">
      <label for="value">Value</label>
      <br />
      <input
        v-if="type === 'number'"
        id="value"
        type="number"
        :value="fieldValue"
        name="value"
        placeholder="value"
        @change="$emit('update:field-value', +$event.target.value)"
      />
      <input
        v-else-if="type === 'text'"
        id="value"
        :value="fieldValue"
        name="value"
        placeholder="value"
        @change="$emit('update:field-value', $event.target.value)"
      />
      <select
        v-else-if="type === 'boolean'"
        id="type"
        :value="fieldValue"
        @change="$emit('update:field-value', Boolean($event.target.value))"
      >
        <option :value="true" v-text="'true'" />
        <option :value="false" v-text="'false'" />
      </select>
      <textarea
        v-else
        id="type"
        :value="fieldValue"
        @change="$emit('update:field-value', JSON.parse($event.target.value))"
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
      if (!String(this.fieldValue)) return "text";
      const typeOf = typeof this.fieldValue;
      console.log("typeof ", typeOf);
      if (typeOf === "boolean") return "boolean";
      if (typeOf === "string") {
        if (this.fieldValue.length === 24 && this.fieldValue.endsWith("Z")) {
          return "date-time";
        }
      }
      if (typeOf === "object") {
        if (Array.isArray(this.fieldValue)) {
          return "array";
        }
        if (this.fieldValue) return "object";
      }
      if (!isNaN(this.fieldValue)) return "number";
      return "text";
    },
  },
};
</script>
<style lang="scss">
.Field {
  @apply flex gap-2  pl-8 items-start justify-start;

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
    @apply mt-7 mb-1 opacity-75;
  }

  .remove-icon {
    @apply mt-6 cursor-pointer;
    width: 24px;
    height: 24px;
    path {
      stroke: theme("colors.gray.500");
    }
  }
  textarea {
    @apply border;
  }
}
</style>
