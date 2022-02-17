// TODO: Figure out how to let eslint ignore this directory
/* eslint-disable*/
import axios from 'axios'
import { Router } from 'vue-router'
import handleApiError from './utils'

export type Movie = {
    title: string
}

export type Watchlist = {
    movies: Movie[]
}

export async function postWatchlist(list: Watchlist, router: Router) {
    axios
        .post(
            'http://localhost:8081/api/watchlist',
            {
                watchlist: list,
            },
            {
                withCredentials: true
            },
        )
        .catch((e) => {
            handleApiError(e, router)
        })
}
