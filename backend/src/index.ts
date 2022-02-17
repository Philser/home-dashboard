// tslint:disable:no-console
import cookieParser = require('cookie-parser')
import express from 'express'
import cors from 'cors'
import { initDb } from './db/Mongo'
import { wachlistApi } from './api/endpoints/Watchlist'
import { ShoppingListHandler as shoppingListApi } from './api/endpoints/ShoppingList'
import { LoginHandler as loginHandler } from './api/endpoints/Login'
import { Config } from './config'
import * as fs from 'fs'
import { dirname } from 'path'

const app = express()
const port = 8081 // default port to listen

function initMiddlewares() {
    app.use(cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }))

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    app.use(cookieParser())
}

function parseKeys(config: Config) {
    // TODO: Have a configurable absolute path for keys
    const appDir = dirname(require.main.filename)
    const pub = fs.readFileSync(`${appDir}/../keys/public.pem`).toString()
    const priv = fs.readFileSync(`${appDir}/../keys/private.pem`).toString()

    config.publicKeyPem = pub
    config.privateKeyPem = priv
}


async function server(): Promise<void> {
    initMiddlewares()

    const config: Config = {
        publicKeyPem: '',
        privateKeyPem: '',
    }

    try {
        parseKeys(config)
        console.log(config)

        await initDb()

        app.get('/', async (_, res) => {
            res.send('Hello world!')
        })

        wachlistApi(app, config)
        shoppingListApi(app, config)
        loginHandler(app, config)


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
