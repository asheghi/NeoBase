<template>
  <div class="ActionPlayground">
    <PlaygroundActionsMenu
      :selected="$route.query?.action"
      @select="onActionNameSelected"
    />
    <div v-if="actionName" class="Playground">
      <div class="card api">
        <div class="url pl-4 flex gap-2 items-center">
          <div
            class="method text-lg font-bold uppercase"
            :class="all_actions[actionName]?.method"
          >
            {{ all_actions[actionName]?.method }}
          </div>
          <div class="value">
            <span class="opacity-75 p-1">{{ baseUrl }}</span>
            <span class="py-1 bg-gray-200 dark:bg-gray-600 pr-2 pl-1 -ml-2">{{
              all_actions[actionName]?.url
            }}</span>
          </div>
          <NButton
            class="ml-auto flex px-4 font-bold items-center py-2 text-primary dark:text-white"
            :disabled="!collection && !collection.length"
            @click="executeAction"
          >
            Send
            <IconExecute class="fill-primary dark:fill-white" />
          </NButton>
        </div>
      </div>
      <div
        :key="actionName"
        class="options card relative border border-gray-200"
      >
        <div class="header flex items-center">
          options
          <span class="ml-auto"></span>
          <NButton class="" @click="toggleOptions">
            <component :is="showOptionals ? IconHide : IconShow" />
          </NButton>
        </div>
        <div class="options-content px-4 pt-4">
          <ActionOptions
            :show-optionals="showOptionals"
            :options="all_actions[actionName]?.options"
          />
          <div
            v-if="all_actions[actionName]?.url?.includes(':collection')"
            class="collection-option grid grid-cols-8 gap-2 mb-2"
          >
            <div class="label">collection</div>
            <select
              :value="$route.query?.collection"
              @select="onCollectionSelected"
              @change="onCollectionSelected"
            >
              <option value="">Select a Collection</option>
              <option
                v-for="it in collections"
                :key="it"
                :value="it.name"
                v-text="it.name"
              ></option>
            </select>
          </div>
        </div>
      </div>
      <div class="row flex items-center justify-between py-4"></div>
      <ExecutionResult
        v-for="(execution, index) in executions"
        :key="index + renderCounter"
        :execution="execution"
      />
    </div>
  </div>
</template>

<script setup>
import { ax, baseUrl, parseAxiosError } from "../../../../plugins/axios";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Api } from "../../../../lib/api";
import { document_actions } from "./actions";
import IconShow from "@mdi/svg/svg/eye.svg";
import IconHide from "@mdi/svg/svg/eye-off.svg";
import ActionOptions from "./components/ActionOptions.vue";
import ExecutionResult from "./ExecutonResult.vue";
import IconExecute from "@mdi/svg/svg/play.svg";
import PlaygroundActionsMenu from "./PlaygroundActionsMenu.vue";
import NButton from "../../../../components/design-system/N-Button.vue";

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
const collection = computed(() => route.query.collection);
const actionName = computed(() => route.query.action);
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
    } = await ax({
      url: reqUrl,
      data: body,
      method,
      params: {},
      headers,
      skipAccountToken: true,
      skipInterceptors: true,
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
const router = useRouter();
const onActionNameSelected = (arg) => {
  router.push({
    name: route.name,
    params: route.params,
    query: { ...route.query, action: arg },
  });
};
const collections = ref([]);
const fetchingCollections = ref(false);
const fetchCollections = async () => {
  fetchingCollections.value = true;
  try {
    const { data } = await Api.Collections(route.params.project).list();
    collections.value = data;
    if (!collection.value) onCollectionSelected(data[0].name);
  } catch (e) {
    console.error(e);
  } finally {
    fetchingCollections.value = false;
  }
};
onMounted(() => {
  fetchCollections();
});
const onCollectionSelected = (arg) => {
  if (typeof arg !== "string") arg = arg.target.value;
  router.push({
    name: route.name,
    params: route.params,
    query: { ...route.query, collection: arg },
  });
};
</script>
<script>
export default {
  name: "ActionPlayground",
};
</script>
<style lang="scss">
.ActionPlayground {
  @apply flex gap-4 pb-16;
  .toggle-options-btn {
    @apply flex gap-2 px-4 py-2 text-primary absolute top-0 right-4 bg-white;
  }
  .method {
    &.post {
      @apply text-green-500;
    }
    &.get {
      @apply text-blue-500;
    }
  }
  .api {
    @apply px-0;
  }
  .card,
  .ExecutionResult {
    @apply max-w-[1220px];
  }

  .Playground {
    @apply flex flex-col gap-4 w-full pr-4;
    .card {
      .header {
        @apply bg-gray-400;
      }
    }
  }
  select {
    @apply dark:bg-gray-600 px-2 py-1 rounded-sm border border-gray-200 dark:border-gray-500;
  }
}
</style>
