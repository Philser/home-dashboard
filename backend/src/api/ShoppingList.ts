// tslint:disable:no-console

import { Express } from 'express'
import { ShoppingList, ShoppingListModel } from '../model/ShoppingList'

interface ShoppingListApiObject {
    shoppingList: ShoppingList
}

export function ShoppingListHandler(app: Express) {
    app.get('/api/shoppinglist', async (_, res) => {
        try {
            let list = await ShoppingListModel.findOne({})
            if (list === null) {
                list = new ShoppingListModel({ items: [] })
                await list.save()
            }

            const returnValue: ShoppingListApiObject = {
                shoppingList: {
                    items: list.items
                }
            }

            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(returnValue)
        }
        catch (e) {
            console.error(`Error in GET /api/shoppinglist: ${e}`)
            res.sendStatus(500)
        }
    })

    app.post('/api/shoppinglist', async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body || !req.body.shoppingList || !req.body.shoppingList.items) {
                res.sendStatus(400)
                return
            }

            const persistentList = await ShoppingListModel.findOne()
            await ShoppingListModel.replaceOne({ _id: persistentList._id }, req.body.shoppingList)

            res.sendStatus(200)
        } catch (e) {
            console.error(`Error in POST /api/shoppinglist: ${e}`)
            res.sendStatus(500)
        }
    })
}
