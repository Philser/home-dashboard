<template>
  <v-container>
    <hello-world />
    <v-row>
      <v-col cols="16" sm="4">
        <watchlist-component />
      </v-col>
      <v-col sm="4">
        <shopping-list-component />
      </v-col>
      <v-col>
        <notebook-component />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <calendar-component />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ShoppingListComponent from '../components/ShoppingListComponent.vue'
import WatchlistComponent from '../components/WatchlistComponent.vue'
import NotebookComponent from '../components/NotebookComponent.vue'
import CalendarComponent from '../components/CalendarComponent.vue'

export default defineComponent({
  name: 'Home',

  components: {
    WatchlistComponent,
    ShoppingListComponent,
    NotebookComponent,
    CalendarComponent,
  },
})
</script>
