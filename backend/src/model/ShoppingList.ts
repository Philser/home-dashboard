import { Db } from 'mongodb'

export interface ShoppingListItem {
    name: string
    checked: boolean
}

export interface ShoppingList {
    items: ShoppingListItem[]
}
