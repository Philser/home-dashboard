<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { loggedInState } from './auth'

export default {
  name: 'App',

  setup() {
    const item = localStorage.getItem('isLoggedIn')
    if (!item) {
      localStorage.setItem('isLoggedIn', 'false')
      loggedInState.setIsLoggedIn(false)
    } else {
      loggedInState.setIsLoggedIn(item === 'true')
    }

    return {
      //
    }
  },
}
</script>
