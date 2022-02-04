<template>
  <v-container>
    <div class="shoppingList">
      <ul>
        <li v-for="item in shoppingList" :key="item.name">
          <div>
            <p class="list-item">{{ item.name }}</p>
          </div>
        </li>
      </ul>

      <label for="itemInput">
        <input
          type="text"
          name="itemInput"
          id="itemInput"
          placeholder="Shopping List Item"
          v-model="itemInput"
        />
      </label>
      <button id="submitItem" @click="submitItem">Submit</button>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';

type ShoppingListItem = {
  title: string;
};

@Options({
  created() {
    axios.get('http://localhost:8081/api/shoppinglist').then((resp) => {
      console.log(resp.data);
      this.shoppingList = resp.data;
    });
  },
  data() {
    return {
      itemInput: '',
      shoppingList: [],
    };
  },
})
export default class ShoppingList extends Vue {
  shoppingList!: ShoppingListItem[];

  itemInput!: string;

  async submitItem(): Promise<void> {
    this.shoppingList.push({ title: this.itemInput });

    axios
      .post(
        'http://localhost:8081/api/shoppinglist',
        {
          item: {
            name: this.itemInput,
          },
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
