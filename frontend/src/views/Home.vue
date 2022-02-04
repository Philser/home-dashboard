<template>
  <hello-world />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Watchlist from '../components/Watchlist.vue'; // @ is an alias to /src
import ShoppingList from '../components/ShoppingList.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',

  components: {
    Watchlist,
    ShoppingList,
  },
});
</script>
