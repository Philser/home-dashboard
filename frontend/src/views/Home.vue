<template>
  <div>
    <hello-world />
    <watchlist />
    <shopping-list />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ShoppingList from '../components/ShoppingList.vue';
import Watchlist from '../components/Watchlist.vue';
import HelloWorld from '../components/HelloWorld.vue';

export default defineComponent({
  name: 'Home',

  components: {
    HelloWorld,
    Watchlist,
    ShoppingList,
  },
});
</script>
