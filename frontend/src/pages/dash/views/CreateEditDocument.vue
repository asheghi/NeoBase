<template>
  <div class="CreateEditDocument" >
    {{ document }}
    <template :key="index" v-for="(key,index) in Object.keys(document)">
      <DocumentField
          @update:field-key="onKeyChange"
          @update:field-value="onValueChanged(key,$event)"
          :field-key="String(key)"
          v-model:field-value="document[key]"/>
    </template>
  </div>
</template>
<script>
import DocumentField from "./components/DocumentField.vue";

export default {
  name: "CreateEditDocument",
  components: {DocumentField},
  data() {
    return {
      document: {
        'one': '1',
      },
      render_counter:1,
    }
  },
  mounted() {
    this.render_counter++;
  },
  methods: {
    onKeyChange(newKey, oldKey) {
      console.log(`on key changed, new:${newKey}, old:${oldKey}`);
      this.document[String(newKey)] = this.document[oldKey];
      delete this.document[oldKey];
      console.log(this.document);
      this.render_counter++;
    },
    onValueChanged(key, value) {
      console.log(key, typeof key, value, typeof value);
      this.document[String(key)] = value;
      this.render_counter++;
      this.fireUpdate()
    },
    fireUpdate() {
      const value = {...this.document};
      delete value[''];
      this.$emit('update:modelValue',)
    }
  },
  watch:{
    render_counter(){
      if (!Object.keys(this.document).find(it => it === '')) {
       this.document[''] = '';
      }
    }
  }
}
</script>
