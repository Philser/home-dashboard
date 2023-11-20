<template>
  <v-container>
    <v-row>
      <v-col cols="8" sm="4">
        <v-card class="text-center">
          <v-text-field label="login" v-model="username"></v-text-field>
          <v-text-field type="password" label="password" v-model="password"></v-text-field>
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

<script>
;(function () {
  // Create a queue, but don't obliterate an existing one!
  var innkeepr = (window.Innkeepr = window.Innkeepr || [])

  innkeepr.methods = ['identify', 'track', 'getCookie']
  // Define a factory to create stubs. These are placeholders
  // for methods in Innkeepr.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  innkeepr.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(method)
      innkeepr.push(args)
      return innkeepr
    }
  }
  // For each of our methods, generate a queueing stub.
  for (var i = 0; i < innkeepr.methods.length; i++) {
    var key = innkeepr.methods[i]
    innkeepr[key] = innkeepr.factory(key)
  }

  // Define a method to load Innkeepr.js.
  innkeepr.load = function (apiKey, apiUrl) {
    // Create an async script element based on your key.
    innkeepr.apiKey = apiKey
    innkeepr.apiUrl = apiUrl
    var script = document.createElement('script')
    script.type = 'application/javascript'
    script.async = 'false'
    script.src = 'https://d3qwomaseq0uwx.cloudfront.net/innkeepr.js' // Proxy URL

    // Insert our script next to the first script element.
    var first = document.getElementsByTagName('script')[0]
    first.parentNode.insertBefore(script, first)
  }

  // Add a version to keep track of what's in the wild.
  innkeepr.SNIPPET_VERSION = '1.0.0'

  // Load Innkeepr.js with your key, which will automatically
  // load the tools you've enabled!
  innkeepr.load('49b72d4d-4314-2116-ea34-19eddbbbc3dc', 'http://localhost:8080')
})()
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
