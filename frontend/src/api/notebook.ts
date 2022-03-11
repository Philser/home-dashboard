import { Router } from 'vue-router'
import axios from 'axios'
import { getApiBaseUrl, handleApiError } from './utils'

export interface Note {
    text: string
}

export async function putNote(note: Note, router: Router) {
    axios.put(`${getApiBaseUrl()}/notebook`,
        {
            notebook: note,
        },
        {
            withCredentials: true,
        },
    ).catch((e) => {
        handleApiError(e, router)
    })
}
