<template>
  <div class="ExecutionResult">
    <div v-if="execution.loading" class="loading">Loading ...</div>
    <template v-if="!execution.loading && Object.keys(execution).length">
      <div class="row">
        <div class="head">Response</div>
        <div>
          <div class="">status:</div>
          <div class="res-code">{{ execution.status }}</div>
        </div>
        <div class="">
          <div>time:</div>
          <div>{{ execution.responseTime }}ms</div>
        </div>
      </div>
      <div class="body">
        <pre><code>{{JSON.stringify(execution.data,null,'\t')}}</code></pre>
      </div>
    </template>
  </div>
</template>
<script setup></script>

<script>
export default {
  name: "ExecutionResult",
  props: {
    execution: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang="scss">
.ExecutionResult {
  .row {
    .head {
      @apply mr-auto mt-8 font-bold text-lg mb-4;
    }
    @apply flex gap-4 items-center;
    & > div {
      @apply flex items-end gap-1;
      & > div:first-child {
        @apply opacity-75 text-primary-800;
      }
      & > div:nth-child(2) {
        @apply font-bold;
      }
    }
  }
  .body{
    @apply max-h-[50vh] overflow-auto rounded border border-gray-200 p-2;
  }
}
</style>
