// tslint:disable:no-console

import { connect, connection } from 'mongoose'
import { Config } from '../config'

export const WATCHLIST_COLLECTION = 'watchlist'
export const SHOPPING_LIST_COLLECTION = 'shoppinglist'
export const USER_COLLECTION = 'user'



export async function initDb(config: Config): Promise<void> {
    try {
        const mongoUri = `mongodb://${config.dbHost}:27017/${config.dbCollection}`
        console.log(`Trying to establish DB connection at ${mongoUri}`)
        await connect(mongoUri, { bufferCommands: false, user: config.dbUser, pass: config.dbPassword })
        connection.on('error', err => {
            console.error(`MongoDB connection reported error: ${err}`)
        }).on('disconnected', reason => {
            console.error(`MongoDB connection reported error: ${reason}`)
        })
        console.log('DB connection up and running')
    } catch (e) {
        console.error(`Could not establish DB connection: ${e}`)
        throw e
    }
}
