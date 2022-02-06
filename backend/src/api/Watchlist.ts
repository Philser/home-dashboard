// tslint:disable:no-console

import { getDb, WATCHLIST_COLLECTION } from './../db/Mongo'
import { Express } from 'express'
import { Movie, Watchlist } from './../model/Watchlist'
import { WithoutId } from 'mongodb'

export function wachlistApi(app: Express) {
    app.get('/api/watchlist', async (_, res) => {
        const db = await getDb()
        // TODO: Use ORM
        let watchlist: WithoutId<Watchlist> = await db.collection<Watchlist>(WATCHLIST_COLLECTION).findOne()
        if (watchlist === null) {
            watchlist = { movies: [] as Movie[] }
            await db.collection<Watchlist>(WATCHLIST_COLLECTION).insertOne(watchlist)
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send({ watchlist: { movies: watchlist.movies } })
    })

    app.post('/api/watchlist', async (req, res) => {
        const db = await getDb()
        // TODO: Find a validation lib
        if (!req.body || !req.body.watchlist || !req.body.watchlist.movies) {
            res.sendStatus(400)
            return
        }

        const persistentList = await db.collection<Watchlist>(WATCHLIST_COLLECTION).findOne()
        await db.collection<Watchlist>(WATCHLIST_COLLECTION).replaceOne({ _id: persistentList._id }, { movies: req.body.watchlist.movies })

        res.sendStatus(200)
    })

}
