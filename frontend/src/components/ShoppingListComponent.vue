<template>
  <v-container>
    <v-card>
      <v-list dense>
        <v-list-item v-for="(item, i) in shoppingList.items" :key="i">
          <v-list-item-action
            ><v-checkbox
              :input-value="active"
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
              }"
              hide-details
            />
          </v-list-item-action>
          <v-list-item-title v-text="item.name"></v-list-item-title>
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

type ShoppingListItem = {
  name: string;
  checked: boolean;
};

type ShoppingList = {
  items: ShoppingListItem[];
};

@Options({
  created() {
    axios.get('http://localhost:8081/api/shoppinglist').then((resp) => {
      console.log(resp.data);
      this.shoppingList = resp.data.shoppingList;
      console.log(this.shoppingList);
    });
  },
  data() {
    return {
      itemInput: '',
      shoppingList: { items: [] },
      checkedItems: [],
    };
  },
})
export default class ShoppingListComponent extends Vue {
  shoppingList!: ShoppingList;

  itemInput!: string;

  async submitItem(): Promise<void> {
    this.shoppingList.items.push({ name: this.itemInput, checked: false });

    axios
      .post(
        'http://localhost:8081/api/shoppinglist',
        {
          shoppingList: this.shoppingList,
        },
        {},
      )
      .catch((e) => alert(`Error saving item: ${e}`));
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
