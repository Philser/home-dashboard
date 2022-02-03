<template>
  <div class="watchlist">
    <ul>
      <li v-for="movie in movies" :key="movie.title">{{ movie.title }}</li>
    </ul>

    <input
      type="text"
      id="movTitle"
      name="movTitle"
      placeholder="Movie Title"
      v-model="movieInput"
    />
    <button class="submitMovie" @click="submitMovie">Submit</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';

type Movie = {
  title: string;
};

@Options({
  props: {
    msg: String,
  },
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
  msg!: string;

  movies: Movie[];

  movieInput: string;

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
