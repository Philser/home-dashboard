<template>
  <v-container>
    <v-card>
      <v-card-header>
        <div class="text-overline mb-1">SHOPPING LIST</div>
      </v-card-header>
      <v-list dense>
        <v-list-item v-for="(item, i) in shoppingList.items" :key="i">
          <v-list-item-action>
            <v-checkbox
              @click="changeChecked(i)"
              v-model="item.checked"
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
              }"
              hide-details
            />
          </v-list-item-action>
          <v-col>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-col>
          <v-list-item-action>
            <v-btn
              icon="mdi-delete"
              size="x-small"
              rounded="lg"
              @click="deleteItem(i)"
            ></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-col cols="12" sm="12">
        <v-text-field
          type="text"
          id="shoppingListInput"
          name="shoppingListInput"
          placeholder="Shopping Item"
          v-model="itemInput"
          @keyup.enter="submitItem"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn elevation="2" class="submitItem" @click="submitItem">Add</v-btn>
      </v-col>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingList,
  postShoppingList,
  fetchShoppingList,
} from '../api/shopppingList'

export default {
  setup() {
    const shoppingList = ref({ items: [] } as ShoppingList)

    const itemInput = ref('')

    const router = useRouter()

    onMounted(() => {
      fetchShoppingList(shoppingList, useRouter())
    })

    async function submitItem(): Promise<void> {
      if (itemInput.value === '') {
        return
      }

      shoppingList.value.items.push({ name: itemInput.value, checked: false })
      await postShoppingList(shoppingList.value, router)
      itemInput.value = ''
    }

    async function changeChecked(index: number): Promise<void> {
      const { checked } = shoppingList.value.items[index]
      shoppingList.value.items[index].checked = !checked
      await postShoppingList(shoppingList.value, router)
    }

    async function deleteItem(index: number): Promise<void> {
      shoppingList.value.items.splice(index, 1)
      await postShoppingList(shoppingList.value, router)
    }

    return {
      submitItem,
      changeChecked,
      deleteItem,
      shoppingList,
      itemInput,
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
