// tslint:disable:no-console
import express from 'express'
import { Db, MongoClient } from 'mongodb'
import { WatchlistMovie } from './model/Watchlist'
import cors from 'cors'
import { getDb, initDb } from './db/Mongo'
import { wachlistApi } from './api/Watchlist'
import { ShoppingListHandler as shoppingListApi } from './api/ShoppingList'

const app = express()
const port = 8081 // default port to listen

function initMiddlewares() {
    app.use(cors({
        origin: '*',
        credentials: true,
    }))

    app.use(express.json())
}


async function server(): Promise<void> {
    initMiddlewares()

    try {
        await initDb()

        app.get('/', async (_, res) => {
            res.send('Hello world!')
        })

        wachlistApi(app)

        shoppingListApi(app)


        // start the Express server
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at http://localhost:${port}`)
        })
    } catch (e) {
        console.error(`Fatal: ${e}`)
    }

}

server().catch(console.dir)
