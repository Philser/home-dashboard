<template>
  <v-container>
    <v-row>
      <v-col cols="8" sm="4">
        <v-card class="text-center">
          <v-text-field label="login" v-model="username"></v-text-field>
          <v-text-field
            type="password"
            label="password"
            v-model="password"
          ></v-text-field>
          <v-btn rounded="lg" class="mb-4" @click="login">Login</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postLogin } from '../api/login'
import { loggedInState } from '../auth'

export default {
  setup() {
    const router = useRouter()

    const username = ref('')
    const password = ref('')

    async function login() {
      try {
        await postLogin({
          username: username.value,
          password: password.value,
        })

        loggedInState.setIsLoggedIn(true)
        router.push('/')
      } catch (e) {
        // We don't do anything on login error
      }
    }

    return {
      login,
      username,
      password,
    }
  },
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
