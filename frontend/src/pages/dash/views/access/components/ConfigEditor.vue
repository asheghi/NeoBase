<template>
  <div class="ConfigEditor">
    <JsonEditor v-model="tempConfig" />
    <div class="btns flex justify-end items-center gap-4">
      <button class="" @click="$emit('canceled', true)">cancel</button>
      <button class="capitalize px-2 bg-blue-500 text-white rounded" @click="$emit('saved', tempConfig)">save</button>
    </div>
  </div>
</template>
<script>
import JsonEditor from "../../data/components/JsonEditor.vue";
import { ref } from "vue";
export default {
  name: "ConfigEditor",
  components: { JsonEditor },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  emits: ["saved", "canceled"],
  setup(props) {
    const tempConfig = ref(props.config);
    return { tempConfig };
  },
};
</script>
