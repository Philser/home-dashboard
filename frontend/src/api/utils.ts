import { AxiosError } from 'axios'
import { Router } from 'vue-router'

export default function handleApiError(e: AxiosError, router: Router) {
    if (e.response && e.response.status === 401) {
        alert("You appear to be not logged in. Please log in.")
        router.push('/login')
        return
    }

    alert("Why the hell did you do that? You broke it!")

}
