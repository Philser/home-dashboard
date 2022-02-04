<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Watchlist />
    <ShoppingList />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Watchlist from '@/components/Watchlist.vue'; // @ is an alias to /src
import ShoppingList from '@/components/ShoppingList.vue'; // @ is an alias to /src

@Options({
  components: {
    Watchlist,
    ShoppingList,
  },
})
export default class Home extends Vue {}
</script>
