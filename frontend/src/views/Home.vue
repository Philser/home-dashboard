<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Watchlist />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Watchlist from '@/components/Watchlist.vue'; // @ is an alias to /src

@Options({
  components: {
    Watchlist,
  },
})
export default class Home extends Vue {}
</script>
