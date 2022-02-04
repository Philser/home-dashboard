// tslint:disable:no-console

import { getDb, WATCHLIST_COLLECTION } from './../db/Mongo'
import { Express } from 'express'
import { Db } from 'mongodb'
import { WatchlistMovie } from './../model/Watchlist'

export function WatchlistHandler(app: Express) {
    app.get('/api/watchlist', async (_, res) => {
        const db = await getDb()
        const movies = await db.collection<WatchlistMovie>(WATCHLIST_COLLECTION).find().toArray()

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send(movies)
    })

    app.post('/api/watchlist', async (req, res) => {
        const db = await getDb()
        // TODO: Find a validation lib
        if (!req.body || !req.body.movie || !req.body.movie.title) {
            res.sendStatus(400)
            return
        }

        await db.collection<WatchlistMovie>(WATCHLIST_COLLECTION).insertOne({
            title: req.body.movie.title
        })

        res.sendStatus(200)
    })

}
