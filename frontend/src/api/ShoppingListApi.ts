// TODO: Figure out how to let eslint ignore this directory
/* eslint-disable*/
import axios from 'axios'

export type ShoppingListItem = {
    name: string
    checked: boolean
}

export type ShoppingList = {
    items: ShoppingListItem[]
}

export class ShoppingListApi {
    static async postShoppingList(list: ShoppingList) {
        axios
            .post(
                'http://localhost:8081/api/shoppinglist',
                {
                    shoppingList: list,
                },
                {},
            )
            .catch((e) => {
                alert(`Error saving item: ${e}`)
                throw e
            })
    }
}
