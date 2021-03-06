// tslint:disable:no-console

import { Express } from 'express'
import { Config } from '../../config'
import { getAuthMiddleware } from '../../middleware/Auth'
import { ShoppingList, ShoppingListModel } from '../../model/ShoppingList'
import { InternalServerError } from '../errors/Utils'

interface ShoppingListApiObject {
    shoppingList: ShoppingList
}

export function ShoppingListHandler(app: Express, config: Config) {
    app.get('/api/shoppinglist', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            let list = await ShoppingListModel.findOne({}).exec()
            if (list === null) {
                list = new ShoppingListModel({ items: [] })
                await list.save()
            }

            const returnValue: ShoppingListApiObject = {
                shoppingList: {
                    items: list.items
                }
            }

            res.send(returnValue)
        }
        catch (e) {
            InternalServerError(res, e, 'GET', '/api/shoppinglist')
        }
    })

    app.post('/api/shoppinglist', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body?.shoppingList?.items) {
                res.sendStatus(400)
                return
            }

            const persistentList = await ShoppingListModel.findOne().exec()
            await ShoppingListModel.replaceOne({ _id: persistentList._id }, req.body.shoppingList)

            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'POST', '/api/shoppinglist')
        }
    })
}
