import { AxiosError } from 'axios'
import { Router } from 'vue-router'

export function handleApiError(e: AxiosError, router: Router) {
    if (e.response && e.response.status === 401) {
        alert("You appear not to be logged in. Please log in.")
        router.push('/login')
        return
    }

    alert("Why the hell did you do that? You broke it!")

}

export function getApiBaseUrl(): string {
    const port = process.env.VUE_APP_API_PORT ? `:${process.env.VUE_APP_API_PORT}` : ""

    return `${process.env.VUE_APP_HTTP_TYPE}://${process.env.VUE_APP_API_DOMAIN}${port}`
}
