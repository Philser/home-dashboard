<template>
  <login-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginComponent from '../components/LoginComponent.vue'

export default defineComponent({
  name: 'Home',

  components: {
    LoginComponent,
  },
})
</script>
