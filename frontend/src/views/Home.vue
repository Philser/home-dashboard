<template>
  <v-container>
    <hello-world />
    <v-row>
      <v-col cols="10" sm="6">
        <watchlist-component />
      </v-col>
      <v-col>
        <shopping-list-component />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ShoppingListComponent from '../components/ShoppingListComponent.vue'
import WatchlistComponent from '../components/WatchlistComponent.vue'

export default defineComponent({
  name: 'Home',

  components: {
    WatchlistComponent,
    ShoppingListComponent,
  },
})
</script>
