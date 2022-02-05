<template>
  <v-container>
    <hello-world />
    <v-row>
      <v-col cols="10" sm="6">
        <watchlist />
      </v-col>
      <v-col>
        <shopping-list-component />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ShoppingListComponent from '../components/ShoppingListComponent.vue';
import Watchlist from '../components/Watchlist.vue';
import HelloWorld from '../components/HelloWorld.vue';

export default defineComponent({
  name: 'Home',

  components: {
    HelloWorld,
    Watchlist,
    ShoppingListComponent,
  },
});
</script>
