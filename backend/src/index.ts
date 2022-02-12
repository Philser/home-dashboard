// tslint:disable:no-console
import express from 'express'
import cors from 'cors'
import { initDb } from './db/Mongo'
import { wachlistApi } from './api/endpoints/Watchlist'
import { ShoppingListHandler as shoppingListApi } from './api/endpoints/ShoppingList'
import { LoginHandler as loginHandler } from './api/endpoints/Login'

const app = express()
const port = 8081 // default port to listen

function initMiddlewares() {
    app.use(cors({
        origin: '*',
        credentials: true,
    }))

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
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
        loginHandler(app)


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
