<script>
const { defineComponent, ref } = require("vue");
const { CdxButton } = require("@wikimedia/codex");

module.exports = defineComponent({
  components: {
    CdxButton,
  },
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {
    const count = ref(0);

    return {
      count,
    };
  },
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <div>
    <cdx-button @click="count++">count is {{ count }}</cdx-button>
    <p>Ceci est un test de VueJS pour le Wiktionnaire.</p>
  </div>
</template>
