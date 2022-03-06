// tslint:disable:no-console
import cookieParser = require('cookie-parser')
import express from 'express'
import cors from 'cors'
import { initDb } from './db/Mongo'
import { wachlistApi } from './api/endpoints/Watchlist'
import { ShoppingListHandler as shoppingListApi } from './api/endpoints/ShoppingList'
import { LoginHandler as loginHandler } from './api/endpoints/Login'
import { Config, parseConfig } from './config'

const app = express()

function initMiddlewares(config: Config) {
    app.use(cors({
        origin(origin, callback) {
            const re = new RegExp(`${config.domain}(\:\d{2,5})?`)

            if (re.exec(origin) === null) {
                return callback(null, false)
            }

            return callback(null, true)
        },
        credentials: true,
    }))

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    app.use(cookieParser())
}

async function server(): Promise<void> {
    try {
        const config = parseConfig()

        await initDb(config)

        initMiddlewares(config)

        wachlistApi(app, config)
        shoppingListApi(app, config)
        loginHandler(app, config)


        // start the Express server
        app.listen(config.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at ${config.domain}:${config.port}`)
        })
    } catch (e) {
        console.error(`Fatal: ${e}`)
    }

}

server().catch(console.dir)
