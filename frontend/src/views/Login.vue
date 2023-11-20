<template>
  <login-component />
</template>

<script>
  (function () {
    // Create a queue, but don't obliterate an existing one!
    var innkeepr = (window.Innkeepr = window.Innkeepr || []);

    innkeepr.methods = ['identify', 'track', 'getCookie'];
    // Define a factory to create stubs. These are placeholders
    // for methods in Innkeepr.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    innkeepr.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        innkeepr.push(args);
        return innkeepr;
      };
    };
    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < innkeepr.methods.length; i++) {
      var key = innkeepr.methods[i];
      innkeepr[key] = innkeepr.factory(key);
    }

    // Define a method to load Innkeepr.js.
    innkeepr.load = function (apiKey, apiUrl) {
      // Create an async script element based on your key.
      innkeepr.apiKey = apiKey;
      innkeepr.apiUrl = apiUrl;
      var script = document.createElement('script');
      script.type = 'application/javascript';
      script.async = 'false';
      script.src = 'https://d3qwomaseq0uwx.cloudfront.net/innkeepr.js'; // Proxy URL

      // Insert our script next to the first script element.
      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
    };

    // Add a version to keep track of what's in the wild.
    innkeepr.SNIPPET_VERSION = '1.0.0';

    // Load Innkeepr.js with your key, which will automatically
    // load the tools you've enabled!
    innkeepr.load('49b72d4d-4314-2116-ea34-19eddbbbc3dc', 'http://localhost:8080');
  })();

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
