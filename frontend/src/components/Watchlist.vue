<template>
  <v-container>
    <v-card>
      <v-list>
        <v-list-item v-for="movie in movies" :key="movie.title">
          <div>
            <p class="list-item">{{ movie.title }}</p>
          </div>
        </v-list-item>
      </v-list>
      <v-col cols="12" sm="12">
        <v-text-field
          type="text"
          id="movieTitleInput"
          name="movieTitleInput"
          placeholder="Movie Title"
          v-model="movieInput"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn elevation="2" class="submitMovie" @click="submitMovie"
          >Submit</v-btn
        >
      </v-col>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';

type Movie = {
  title: string;
};

@Options({
  created() {
    axios.get('http://localhost:8081/api/watchlist').then((resp) => {
      this.movies = resp.data;
    });
  },
  data() {
    return {
      movieInput: '',
      movies: [],
    };
  },
})
export default class Watchlist extends Vue {
  movies!: Movie[];

  movieInput!: string;

  async submitMovie(): Promise<void> {
    this.movies.push({ title: this.movieInput });

    axios
      .post(
        'http://localhost:8081/api/watchlist',
        {
          movie: {
            title: this.movieInput,
          },
        },
        {},
      )
      .catch((e) => alert(`Error saving movie: ${e}`));
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
