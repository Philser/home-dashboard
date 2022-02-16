import { Schema, model } from 'mongoose'
import { SHOPPING_LIST_COLLECTION } from '../db/Mongo'

export interface ShoppingListItem {
    name: string
    checked: boolean
}

export interface ShoppingList {
    items: ShoppingListItem[]
}

const shoppingListItemSchema = new Schema<ShoppingListItem>({
    name: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        required: true
    }
})

const shoppingListSchema = new Schema<ShoppingList>({
    items: {
        type: [shoppingListItemSchema]
    }
})


export const ShoppingListModel = model<ShoppingList>(SHOPPING_LIST_COLLECTION, shoppingListSchema, SHOPPING_LIST_COLLECTION)
