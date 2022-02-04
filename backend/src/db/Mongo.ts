// tslint:disable:no-console

import { Db, MongoClient } from 'mongodb'

// TODO: Move to config
export const MONGO_URI = 'mongodb://phil:phil@localhost/dashboard'
const MONGO_DB = 'dashboard'
export const WATCHLIST_COLLECTION = 'watchlist'
export const SHOPPING_LIST_COLLECTION = 'shoppinglist'

let _db: Db

export async function initDb(): Promise<void> {
    if (!_db) {
        const client = await MongoClient.connect(MONGO_URI)
        const db = await client.db()
        await db.command({ ping: 1 })

        _db = db

        console.log('DB connection up and running')
    }
}

export async function getDb(): Promise<Db> {
    try {
        await initDb()
        return _db
    } catch (e) {
        console.error(`Could not establish DB connection: ${e}`)
        throw e
    }
}
