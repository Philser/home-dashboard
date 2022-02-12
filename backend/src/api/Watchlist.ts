// tslint:disable:no-console
import { Express } from 'express'
import { Watchlist, WatchlistModel } from './../model/Watchlist'

interface WatchlistApiObject {
    watchlist: Watchlist
}

export function wachlistApi(app: Express) {
    app.get('/api/watchlist', async (_, res) => {
        try {
            let watchlist = await WatchlistModel.findOne({})
            if (watchlist === null) {
                watchlist = new WatchlistModel({ movies: [] })
                await watchlist.save()
            }

            const returnValue: WatchlistApiObject = {
                watchlist: {
                    movies: watchlist.movies
                }
            }

            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(returnValue)
        } catch (e) {
            console.error(`Error in GET /api/shoppinglist: ${e}`)
            res.sendStatus(500)
        }
    })

    app.post('/api/watchlist', async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body || !req.body.watchlist || !req.body.watchlist.movies) {
                res.sendStatus(400)
                return
            }

            const persistentList = await WatchlistModel.findOne({})
            await WatchlistModel.replaceOne({ _id: persistentList._id }, { movies: req.body.watchlist.movies })

            res.sendStatus(200)
        }
        catch (e) {
            console.error(`Error in POST /api/shoppinglist: ${e}`)
            res.sendStatus(500)
        }
    })

}
