<template>
  <v-container>
    <v-card>
      <v-list dense>
        <v-list-item v-for="(movie, i) in watchlist.movies" :key="i">
          <v-col>
            <v-list-item-title v-text="movie.title"></v-list-item-title>
          </v-col>
          <v-list-item-action>
            <v-btn
              icon="mdi-delete"
              size="x-small"
              rounded="lg"
              @click="deleteMovie(i)"
            ></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-col cols="12" sm="12">
        <v-text-field
          type="text"
          id="watchlistInput"
          name="watchlistInput"
          placeholder="Movie"
          v-model="movieInput"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn elevation="2" class="submitMovie" @click="submitMovie"
          >Add</v-btn
        >
      </v-col>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import { Watchlist, WatchlistApi } from '../api/WatchlistApi';

async function postWatchlist(list: Watchlist): Promise<void> {
  try {
    WatchlistApi.postWatchlist(list);
  } catch (e) {
    // TODO: Handle error :)
  }
}

@Options({
  created() {
    axios.get('http://localhost:8081/api/watchlist').then((resp) => {
      console.log(resp.data);
      this.watchlist = resp.data.watchlist;
    });
  },
  data() {
    return {
      movieInput: '',
      watchlist: { movies: [] },
    };
  },
})
export default class WatchlistComponent extends Vue {
  watchlist!: Watchlist;

  movieInput!: string;

  async submitMovie(): Promise<void> {
    this.watchlist.movies.push({ title: this.movieInput });
    await postWatchlist(this.watchlist);
  }

  async deleteMovie(index: number): Promise<void> {
    this.watchlist.movies.splice(index, 1);
    await postWatchlist(this.watchlist);
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
