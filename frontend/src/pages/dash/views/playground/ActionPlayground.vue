<template>
  <div class="ActionPlayground">
    <div class="api">
      <div class="url flex gap-2">
        <div class="label" v-text="'url: '"></div>
        <div class="value">
          <span class="opacity-75 p-1">{{ baseUrl }}</span>
          <span class="p-1 rounded bg-gray-200">{{
            all_actions[actionName].url
          }}</span>
        </div>
        <button
          class="ml-auto flex gap-2 px-4 font-bold items-center py-2 rounded bg-primary text-white"
          @click="executeAction"
        >
          Execute
          <IconExecute class="fill-white" />
        </button>
      </div>
    </div>
    <div :key="actionName" class="options relative p-2 border border-gray-200">
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
    <ExecutionResult :execution="execution" />
  </div>
</template>

<script setup>
import { ax, baseUrl } from "../../../../plugins/axios";
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
const route = useRoute();
const project = computed(() => route.params.project);
const collection = computed(() => route.params.collection);
const actionName = computed(() => route.params.action);
const action = computed(() => document_actions[actionName.value]);
const api = computed(() => Api.Documents(project, collection));

const renderCounter = ref(0);
function getValueOfOptions(arg) {
  if (!arg) return {};
  let value = {};
  if (typeof arg === "object" && arg) {
    Object.keys(arg).forEach((key) => {
      let fields = arg[key].fields;
      if (fields) {
        Object.keys(fields).forEach((field) => {
          if (fields[field].fields) {
            value[field] = getValueOfOptions({ [field]: fields[field] });
          } else {
            let valField = fields[field].value;
            value[field] = valField;
          }
        });
      }
    });
  }
  return value;
}
const execution = reactive({});
const executeAction = async () => {
  const { url, options, method } = action.value;
  const reqUrl = url
    .replace(":project", project.value)
    .replace(":collection", collection.value);
  const body = getValueOfOptions({ body: options.body });
  execution.loading = true;
  try {
    const startTime = new Date().getTime();
    const { data, status } = await ax({
      url: reqUrl,
      data: body,
      method,
      params: {},
    });
    execution.responseTime = new Date().getTime() - startTime;
    execution.data = data;
    execution.status = status;
  } catch (e) {
    execution.error = e.message;
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    execution.loading = false;
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
    console.log("counter ++", renderCounter.value);
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
  @apply flex flex-col gap-4;
  .toggle-options-btn {
    @apply flex gap-2 px-4 py-2 text-primary absolute top-4 right-4 bg-white;
  }
}
</style>
