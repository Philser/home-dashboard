// tslint:disable:no-console

import { getDb, SHOPPING_LIST_COLLECTION, WATCHLIST_COLLECTION } from '../db/Mongo'
import { Express } from 'express'
import { ShoppingListItem } from '../model/ShoppingList'


export function ShoppingListHandler(app: Express) {
    app.get('/api/shoppinglist', async (_, res) => {
        const db = await getDb()
        const list = await db.collection<ShoppingListItem>(SHOPPING_LIST_COLLECTION).find().toArray()

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send(list)
    })

    app.post('/api/shoppinglist', async (req, res) => {
        const db = await getDb()
        // TODO: Find a validation lib
        if (!req.body || !req.body.item || !req.body.item.name) {
            res.sendStatus(400)
            return
        }

        await db.collection<ShoppingListItem>(SHOPPING_LIST_COLLECTION).insertOne({
            name: req.body.item.name
        })

        res.sendStatus(200)
    })

}
