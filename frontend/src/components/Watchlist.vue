<template>
  <div class="watchlist">
    <input type="text" id="movName" name="movName" placeholder="Movie Name" />
    <button class="submitMovie" @click="submitMovie">Submit</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String,
  },
})
export default class Watchlist extends Vue {
  msg!: string;

  submitMovie(): void {
    window.alert(this.msg);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
