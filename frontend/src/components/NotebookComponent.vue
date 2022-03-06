<template>
  <v-container fluid>
    <v-textarea
      name="input-7-1"
      label="Notes"
      auto-grow
      v-model="note"
    ></v-textarea>
    <v-btn rounded="lg" class="mb-4" @click="updateNote">Save</v-btn>
  </v-container>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { putNote } from '../api/notebook'
import { getApiBaseUrl } from '../api/utils'

export default {
  setup() {
    const note = ref('')
    const router = useRouter()

    async function fetchNotebook() {
      axios
        .get(`${getApiBaseUrl()}/api/notebook`, { withCredentials: true })
        .then((resp) => {
          note.value = resp.data.notebook.text
        })
    }

    onMounted(fetchNotebook)

    async function updateNote() {
      try {
        await putNote(
          {
            text: note.value,
          },
          router,
        )
      } catch (e) {
        alert(`There was an error updating the notebook: ${e}`)
      }
    }

    return {
      note,
      updateNote,
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
