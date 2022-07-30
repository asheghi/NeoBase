<template>
  <div class="ActionPlayground">
    <div class="api">
      <div class="url flex gap-2 px-2 items-center">
        <div
          class="method text-lg font-bold uppercase"
          :class="all_actions[actionName].method"
        >
          {{ all_actions[actionName].method }}
        </div>
        <div class="value">
          <span class="opacity-75 p-1">{{ baseUrl }}</span>
          <span class="p-1  bg-gray-200">{{
            all_actions[actionName].url
          }}</span>
        </div>
        <button
          class="ml-auto flex gap-2 px-4 font-bold items-center py-2  bg-primary text-white"
          @click="executeAction"
        >
          Execute
          <IconExecute class="fill-white" />
        </button>
      </div>
    </div>
    <div
      :key="actionName"
      class="options pt-4 relative p-2 border border-gray-200"
    >
      <div class="font-bold mb-2">options</div>
      <ActionOptions
        :show-optionals="showOptionals"
        :options="all_actions[actionName].options"
      />
      <button class="toggle-options-btn" @click="toggleOptions">
        <component
          :is="showOptionals ? IconHide : IconShow"
          class="fill-primary"
        />
        {{ showOptionals ? "less" : "more" }} options
      </button>
    </div>
    <div class="row flex items-center justify-between py-4"></div>
    <ExecutionResult
      v-for="(execution, index) in executions"
      :key="index + renderCounter"
      :execution="execution"
    />
  </div>
</template>

<script setup>
import { ax, baseUrl, parseAxiosError } from "../../../../plugins/axios";
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import { document_actions } from "./actions";
import IconShow from "@mdi/svg/svg/eye.svg";
import IconHide from "@mdi/svg/svg/eye-off.svg";
import ActionOptions from "./components/ActionOptions.vue";
import ExecutionResult from "./ExecutonResult.vue";
import IconExecute from "@mdi/svg/svg/play.svg";
const all_actions = reactive(document_actions);
const authToken = ref("");
Object.keys(document_actions).forEach((actionKey) => {
  if (all_actions[actionKey].hideAuthToken) return;
  if (!all_actions[actionKey].options) {
    all_actions[actionKey].options = {};
  }
  all_actions[actionKey].options.headers = {
    type: "json",
    fields: {
      "x-auth-token": {
        optional: true,
        type: "string",
        value: authToken,
      },
    },
  };
});
const route = useRoute();
const project = computed(() => route.params.project);
const collection = computed(() => route.params.collection);
const actionName = computed(() => route.params.action);
const action = computed(() => document_actions[actionName.value]);
const api = computed(() => Api.Documents(project, collection));

const renderCounter = ref(0);
//todo rewrite this IMPORTANT
function getValueOfOptions(arg) {
  if (!arg) return {};
  let value = {};
  if (typeof arg === "object" && arg) {
    Object.keys(arg).forEach((key) => {
      if (!arg[key]) return;
      let fields = arg[key].fields;
      if (fields) {
        Object.keys(fields).forEach((field) => {
          if (fields[field].fields) {
            value[field] = getValueOfOptions({ [field]: fields[field] });
          } else {
            let val = fields[field].value;
            if (val.__v_isRef) {
              value[field] = val.value;
            } else {
              value[field] = val;
            }
          }
        });
      } else {
        value = arg[key].value;
      }
    });
  }
  return value;
}
const executions = reactive([]);
const executeAction = async () => {
  const execution = {
    action: actionName.value,
  };
  executions.splice(0, 0, execution);
  const { url, options, method } = action.value;
  const reqUrl = url
    .replace(":project", project.value)
    .replace(":collection", collection.value);
  let body = getValueOfOptions({ body: options.body });

  const headers = getValueOfOptions({ headers: options.headers });
  if (typeof body === "string" && options.body.type === "json") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.error(e);
    }
  }
  execution.loading = true;
  const startTime = new Date().getTime();
  try {
    const {
      data,
      status,
      headers: resHeaders,
      request,
    } = await ax({
      url: reqUrl,
      data: body,
      method,
      params: {},
      headers,
      skipAccountToken: true,
    });
    execution.responseTime = new Date().getTime() - startTime;
    execution.data = data;
    execution.status = status;
    execution.body = body;
    execution.res_headers = resHeaders;
    execution.req_headers = headers;
    // execution.req_headers = request.headers;
  } catch (e) {
    const { status, data, msg, headers: resHeaders } = parseAxiosError(e);
    execution.error = e.message;
    execution.responseTime = new Date().getTime() - startTime;
    execution.data = data;
    execution.status = status;
    execution.body = body;
    execution.res_headers = resHeaders;
    execution.req_headers = headers;
    execution.error_msg = msg;
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    execution.loading = false;
    if (executions.length > 3) {
      executions.splice(2, executions.length - 3);
    }
    renderCounter.value++;
  }
};
const showOptionals = ref(false);
const toggleOptions = () => {
  showOptionals.value = !showOptionals.value;
};

watch(
  () => all_actions,
  () => {
    renderCounter.value = renderCounter.value + 1;
  },
  { deep: true, immediate: true }
);
</script>
<script>
export default {
  name: "ActionPlayground",
};
</script>
<style lang="scss">
.ActionPlayground {
  @apply flex flex-col gap-4 pb-16;
  .toggle-options-btn {
    @apply flex gap-2 px-4 py-2 text-primary absolute top-0 right-4 bg-white;
  }
  .method {
    &.post {
      @apply text-green-700;
    }
  }
}
</style>
