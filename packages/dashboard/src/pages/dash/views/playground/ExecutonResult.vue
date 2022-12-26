<template>
  <div class="ExecutionResult max-w-[1200px]">
    <div v-if="execution.loading" class="loading">Loading ...</div>
    <template v-if="!execution.loading && Object.keys(execution).length">
      <div class="row">
        <div class="tabs">
          <NButton
            v-for="(tab, key) in tabs"
            :key="key"
            class="tab"
            :class="{
              primary: tab === currentTab,
              secondary: tab !== currentTab,
            }"
            @click="currentTab = tab"
            >{{ tab }}</NButton
          >
        </div>

        <div class="ml-auto">
          <div class="">status:</div>
          <div
            class="res-code"
            :class="{
              'text-red-500': execution.status && execution.status >= 400,
            }"
          >
            {{ execution.status }}
          </div>
        </div>
        <div class="">
          <div>time:</div>
          <div>{{ execution.responseTime }}ms</div>
        </div>
      </div>
      <template v-if="currentTab === tabs.response_body">
        <div class="body card">
          <pre
            class="px-2 overflow-x-auto"
          ><code>{{JSON.stringify(execution.data,null,'\t')}}</code></pre>
        </div>
      </template>
      <template v-if="currentTab === tabs.headers">
        <div class="card overflow-x-auto border border-gray-100 p-2">
          <div
            v-for="(val, name) in execution.res_headers"
            :key="name"
            class="the-header flex gap-2 py-2"
          >
            <div class="header-name opacity-50 font-bold">{{ name }}:</div>
            <div class="header-value">{{ val }}</div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script setup></script>

<script>
import { parseAxiosError } from "../../../../plugins/axios";
import NButton from "../../../../components/design-system/N-Button.vue";

const tabs = {
  response_body: "Response",
  headers: "Headers",
};
export default {
  name: "ExecutionResult",
  components: { NButton },
  props: {
    execution: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabs,
      currentTab: Object.values(tabs)[0],
    };
  },
};
</script>
<style lang="scss">
.ExecutionResult {
  @apply overflow-x-auto max-w-full;
  .row {
    .head {
      @apply mr-auto mt-8 font-bold text-lg mb-4;
    }
    @apply flex gap-4 items-center;
    & > div {
      @apply flex items-end gap-1;
      & > div:first-child {
        @apply opacity-75 dark:text-white text-primary-800;
      }
      & > div:nth-child(2) {
        @apply font-bold;
      }
    }
  }
  .body {
    @apply max-h-[50vh] overflow-auto  border border-gray-200 p-2;
  }
  .tabs {
    @apply flex;
    .tab {
    }
  }
}
</style>
