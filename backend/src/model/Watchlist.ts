import { model, Schema } from 'mongoose'
import { WATCHLIST_COLLECTION } from '../db/Mongo'

export interface Movie {
    title: string
}

export interface Watchlist {
    movies: Movie[]
}

const movieSchema = new Schema<Movie>({
    title: {
        type: String,
        required: true
    }
})

const watchlistSchema = new Schema<Watchlist>({
    movies: {
        type: [movieSchema],
        required: true
    }
})

export const WatchlistModel = model<Watchlist>(WATCHLIST_COLLECTION, watchlistSchema)
