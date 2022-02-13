// tslint:disable:no-console
import { Express } from 'express'
import { isAuthenticated } from '../../middleware/Auth'
import { Watchlist, WatchlistModel } from '../../model/Watchlist'
import { InternalServerError } from '../errors/Utils'

interface WatchlistApiObject {
    watchlist: Watchlist
}

export function wachlistApi(app: Express) {
    app.get('/api/watchlist', isAuthenticated, async (_, res) => {
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
            InternalServerError(res, e, 'GET', '/api/watchlist')
        }
    })

    app.post('/api/watchlist', isAuthenticated, async (req, res) => {
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
            InternalServerError(res, e, 'POST', '/api/watchlist')
        }
    })

}
