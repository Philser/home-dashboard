// TODO: Figure out how to let eslint ignore this directory
/* eslint-disable*/
import axios, { AxiosError } from 'axios'
import { Ref } from 'vue'
import { Router } from 'vue-router'
import handleApiError from './utils'

export type ShoppingListItem = {
    name: string
    checked: boolean
}

export type ShoppingList = {
    items: ShoppingListItem[]
}

export async function postShoppingList(list: ShoppingList, router: Router) {
    axios
        .post(
            'http://localhost:8081/api/shoppinglist',
            {
                shoppingList: list,
            },
            {
                withCredentials: true
            },
        )
        .catch((e) => {
            handleApiError(e, router)
        })
}

export async function fetchShoppingList(shoppingList: Ref<ShoppingList>, router: Router) {
    try {
        const resp = await axios.get('http://localhost:8081/api/shoppinglist', {
            withCredentials: true,
        })

        shoppingList.value = resp.data.shoppingList
    } catch (e) {
        handleApiError(e as AxiosError, router)
    }
}