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
    const port = process.env.PORT ? `:${process.env.PORT}` : ""

    return `${process.env.HTTP_TYPE}://${process.env.API_DOMAIN}${process.env.PORT}`
}
