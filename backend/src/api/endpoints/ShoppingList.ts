// tslint:disable:no-console

import { Express } from 'express'
import { isAuthenticated } from '../../middleware/Auth'
import { ShoppingList, ShoppingListModel } from '../../model/ShoppingList'
import { InternalServerError } from '../errors/Utils'

interface ShoppingListApiObject {
    shoppingList: ShoppingList
}

export function ShoppingListHandler(app: Express) {
    app.get('/api/shoppinglist', isAuthenticated, async (_, res) => {
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
            InternalServerError(res, e, 'GET', '/api/shoppinglist')
        }
    })

    app.post('/api/shoppinglist', isAuthenticated, async (req, res) => {
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
            InternalServerError(res, e, 'POST', '/api/shoppinglist')
        }
    })
}
