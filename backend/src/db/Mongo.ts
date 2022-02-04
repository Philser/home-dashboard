// tslint:disable:no-console

import { Db, MongoClient } from 'mongodb'

// TODO: Move to config
export const MONGO_URI = 'mongodb://phil:phil@localhost/dashboard?w=majority'
const MONGO_DB = 'dashboard'
export const WATCHLIST_COLLECTION = 'watchlist'


export async function getDb(client: MongoClient): Promise<Db> {
    try {
        await client.connect()
        const db = await client.db(MONGO_DB)
        db.command({ ping: 1 })

        console.log('DB connection up and running')

        return db
    } catch (e) {
        console.error(`Could not establish DB connection: ${e}`)
        client.close()
        throw e
    }
}
