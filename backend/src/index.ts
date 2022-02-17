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
const DEFAULT_PORT = 8081 // default port to listen

function initMiddlewares(config: Config) {
    app.use(cors({
        origin: `${config.domain}:${config.port}`,
        credentials: true,
    }))

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    app.use(cookieParser())
}

function parsePublicPrivateKeys(): { publicKeyPem: string, privateKeyPem: string } {
    // TODO: Have a configurable absolute path for keys
    const appDir = dirname(require.main.filename)
    const publicKeyPem = fs.readFileSync(`${appDir}/../keys/public.pem`).toString()
    const privateKeyPem = fs.readFileSync(`${appDir}/../keys/private.pem`).toString()

    return {
        publicKeyPem,
        privateKeyPem
    }
}

function parseConfig(): Config {
    try {
        let port = DEFAULT_PORT
        if (process.env.PORT) {
            port = parseInt(process.env.PORT)

            if (port == NaN) {
                throw new Error(`Invalid PORT value: ${process.env.PORT}. Expected number`)
            }
        }

        const domain = process.env.DOMAIN
        if (!domain) {
            // TODO: Add validation
            throw new Error("Missing domain")
        }

        const keys = parsePublicPrivateKeys()
        const publicKeyPem = keys.publicKeyPem
        const privateKeyPem = keys.privateKeyPem


        return {
            port,
            publicKeyPem,
            privateKeyPem,
            domain,
        }
    } catch (e) {
        throw new Error(`Error parsing config: ${e}`)
    }
}


async function server(): Promise<void> {
    try {
        const config = parseConfig()

        await initDb()

        initMiddlewares(config)

        wachlistApi(app, config)
        shoppingListApi(app, config)
        loginHandler(app, config)


        // start the Express server
        app.listen(config.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at http://${config.domain}:${config.port}`)
        })
    } catch (e) {
        console.error(`Fatal: ${e}`)
    }

}

server().catch(console.dir)
