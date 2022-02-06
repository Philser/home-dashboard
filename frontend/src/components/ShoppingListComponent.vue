<template>
  <v-container>
    <v-card>
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
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn elevation="2" class="submitItem" @click="submitItem">Add</v-btn>
      </v-col>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import { ShoppingList, ShoppingListApi } from '../api/ShoppingListApi';

async function postShoppingList(list: ShoppingList): Promise<void> {
  try {
    ShoppingListApi.postShoppingList(list);
  } catch (e) {
    // TODO: Handle error :)
  }
}

@Options({
  created() {
    axios.get('http://localhost:8081/api/shoppinglist').then((resp) => {
      this.shoppingList = resp.data.shoppingList;
    });
  },
  data() {
    return {
      itemInput: '',
      shoppingList: { items: [] },
    };
  },
})
export default class ShoppingListComponent extends Vue {
  shoppingList!: ShoppingList;

  itemInput!: string;

  async submitItem(): Promise<void> {
    this.shoppingList.items.push({ name: this.itemInput, checked: false });
    await postShoppingList(this.shoppingList);
  }

  async changeChecked(index: number): Promise<void> {
    const { checked } = this.shoppingList.items[index];
    this.shoppingList.items[index].checked = !checked;
    await postShoppingList(this.shoppingList);
  }

  async deleteItem(index: number): Promise<void> {
    this.shoppingList.items.splice(index, 1);
    await postShoppingList(this.shoppingList);
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
