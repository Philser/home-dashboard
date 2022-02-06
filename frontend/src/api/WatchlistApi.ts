// TODO: Figure out how to let eslint ignore this directory
/* eslint-disable*/
import axios from 'axios'

export type Movie = {
    title: string
}

export type Watchlist = {
    movies: Movie[]
}

export class WatchlistApi {
    static async postWatchlist(list: Watchlist) {
        axios
            .post(
                'http://localhost:8081/api/watchlist',
                {
                    watchlist: list,
                },
                {},
            )
            .catch((e) => {
                alert(`Error saving item: ${e}`)
                throw e
            })
    }
}
