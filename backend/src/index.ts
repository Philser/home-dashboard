// tslint:disable:no-console
import express from 'express'
import { Db, MongoClient } from 'mongodb'
import { WatchlistMovie } from './model/Watchlist'
import { TextDecoder, TextEncoder } from 'util'
import { STATUS_CODES } from 'http'
import cors from 'cors'

const app = express()
const port = 8081 // default port to listen

const MONGO_URI = 'mongodb://phil:phil@localhost/dashboard?w=majority'
const MONGO_DB = 'dashboard'
const WATCHLIST_COLLECTION = 'watchlist'

function initMiddlewares() {
    app.use(cors({
        origin: '*',
        credentials: true,
    }))

    app.use(express.json())
}

async function getDb(): Promise<Db> {
    const client = new MongoClient(MONGO_URI)
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

async function server(): Promise<void> {
    initMiddlewares()
    const mongoClient = new MongoClient(MONGO_URI)

    try {
        const db = await getDb()

        app.get('/', async (req, res) => {
            res.send('Hello world!')
        })

        app.get('/api/watchlist', async (req, res) => {
            const movies: WatchlistMovie[] = []
            const movieCursor = db.collection<WatchlistMovie>(WATCHLIST_COLLECTION).find()
            await movieCursor.forEach((movie) => {
                movies.push({ title: movie.title })
            })

            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(movies)
        })

        app.post('/api/watchlist', async (req, res) => {
            console.log(req)
            // TODO: Find a validation lib
            if (!req.body || !req.body.movie || !req.body.movie.title) {
                res.sendStatus(400)
                return
            }

            await db.collection<WatchlistMovie>(WATCHLIST_COLLECTION).insertOne({
                title: req.body.movie.title
            })

            res.sendStatus(200)
        })



        // start the Express server
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at http://localhost:${port}`)
        })
    } finally {
        mongoClient.close()
    }
}

server().catch(console.dir)