<script>
const { defineComponent } = require("vue");
const CounterButton = require("./components/CounterButton.vue");

module.exports = defineComponent({
  components: {
    CounterButton,
  },
  setup() {
    console.log("init VueJS app");
  },
});
</script>

<template>
  <div>
    <a href="https://vuejs.org/" target="_blank">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg"
        class="logo vue"
        alt="Vue logo"
      />
    </a>
  </div>
  <counter-button msg="VueJS" />
</template>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
