// tslint:disable:no-console
import { Express } from 'express'
import { Config } from '../../config'
import { getAuthMiddleware } from '../../middleware/Auth'
import { Watchlist, WatchlistModel } from '../../model/Watchlist'
import { InternalServerError } from '../errors/Utils'

interface WatchlistApiObject {
    watchlist: Watchlist
}

export function wachlistApi(app: Express, config: Config) {
    app.get('/api/watchlist', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            let watchlist = await WatchlistModel.findOne({}).exec()
            if (watchlist === null) {
                watchlist = new WatchlistModel({ movies: [] })
                await watchlist.save()
            }

            const returnValue: WatchlistApiObject = {
                watchlist: {
                    movies: watchlist.movies
                }
            }

            res.send(returnValue)
        } catch (e) {
            InternalServerError(res, e, 'GET', '/api/watchlist')
        }
    })

    app.post('/api/watchlist', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body?.watchlist?.movies) {
                res.sendStatus(400)
                return
            }

            const persistentList = await WatchlistModel.findOne({}).exec()
            await WatchlistModel.replaceOne({ _id: persistentList._id }, { movies: req.body.watchlist.movies }).exec()

            res.sendStatus(200)
        }
        catch (e) {
            InternalServerError(res, e, 'POST', '/api/watchlist')
            res.sendStatus(500)
        }
    })

}
