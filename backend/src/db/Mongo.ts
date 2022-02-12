// tslint:disable:no-console

import { Db, MongoClient } from 'mongodb'
import * as mongoose from 'mongoose'

// TODO: Move to config
export const MONGO_URI = 'mongodb://phil:phil@localhost/dashboard'
export const WATCHLIST_COLLECTION = 'watchlist'
export const SHOPPING_LIST_COLLECTION = 'shoppinglist'
export const USER_COLLECTION = 'user'



export async function initDb(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI, { bufferCommands: false })
        mongoose.connection.on('error', err => {
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
