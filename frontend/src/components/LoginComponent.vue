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
import { Options, Vue } from 'vue-class-component'
import { ShoppingListApi } from '../api/LoginApi'
import { authState } from '../auth'

@Options({
  data() {
    return {
      username: '',
      password: '',
    }
  },
})
export default class LoginComponent extends Vue {
  username: string

  password: string

  async login() {
    console.log(`Posting:' + ${this.username}`)
    try {
      await ShoppingListApi.postLogin({
        username: this.username,
        password: this.password,
      })

      authState.loggedIn = true
      this.$router.push('/')
    } catch (e) {
      // TODO: Show Login Failed error
    }
  }
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
