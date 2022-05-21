<template>
  <div class="Field">
    <div class="key">
      <input name="key" :value="fieldKey"
             @change="$emit('update:field-key',$event.target.value,this.fieldKey,)"
             placeholder="key"
             id="key">
    </div>
    <div class="value">
      <input @change="$emit('update:field-value',$event.target.value)"
             :value="this.fieldValue" name="value" id="value"
             placeholder="value">
    </div>
  </div>
</template>
<script>
export default {
  name: 'DocumentField',
  props: {
    fieldKey: {},
    fieldValue: {},
  },
  emits: ['update:modelValue'],
}
</script>
<style lang="scss">
.Field {
  @apply flex gap-2 items-center;
  .key, .value {
    @apply w-full bg-gray-200;
    input {
      @apply px-2 py-1 border border-gray-200 rounded;
    }

    min-width: 60px;
  }
}
</style>
