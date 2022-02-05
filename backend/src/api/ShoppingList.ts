// tslint:disable:no-console

import { getDb, SHOPPING_LIST_COLLECTION } from '../db/Mongo'
import { Express } from 'express'
import { ShoppingList, ShoppingListItem } from '../model/ShoppingList'


export function ShoppingListHandler(app: Express) {
    app.get('/api/shoppinglist', async (_, res) => {
        const db = await getDb()
        // TODO: Use ORM
        let list = await db.collection<ShoppingList>(SHOPPING_LIST_COLLECTION).findOne()
        console.log(list)
        if (list === null) {
            const empty = { items: [] as ShoppingListItem[] }
            const inserted = await db.collection<ShoppingList>(SHOPPING_LIST_COLLECTION).insertOne(empty)
            list = { _id: inserted.insertedId, ...empty }
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send({ shoppingList: { items: list.items } })
    })

    app.post('/api/shoppinglist', async (req, res) => {
        const db = await getDb()
        // TODO: Find a validation lib
        if (!req.body || !req.body.shoppingList) {
            res.sendStatus(400)
            return
        }
        const persistentList = await db.collection<ShoppingList>(SHOPPING_LIST_COLLECTION).findOne()
        await db.collection<ShoppingList>(SHOPPING_LIST_COLLECTION).replaceOne({ _id: persistentList._id }, req.body.shoppingList)

        res.sendStatus(200)
    })
}
