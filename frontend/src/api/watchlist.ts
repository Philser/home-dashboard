// TODO: Figure out how to let eslint ignore this directory
/* eslint-disable*/
import axios from 'axios'
import { Router } from 'vue-router'
import { handleApiError, getApiBaseUrl } from './utils'

export type Movie = {
    title: string
}

export type Watchlist = {
    movies: Movie[]
}

export async function getWatchlist(): Promise<Watchlist> {
    const resp = await axios
        .get(`${getApiBaseUrl()}/watchlist`, { withCredentials: true })

    return resp.data.watchlist
}

export async function postWatchlist(list: Watchlist, router: Router) {
    axios
        .post(
            `${getApiBaseUrl()}/watchlist`,
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
