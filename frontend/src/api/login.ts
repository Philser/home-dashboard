import axios, { AxiosError } from 'axios'
import { SHA256 } from 'crypto-js'

export interface Credentials {
    username: string,
    password: string
}


function notifyOfLoginError(e: AxiosError) {
    if (e.response) {
        if (e.response.status === 401) {
            alert("Invalid credentials")
        }

        if (e.response.status === 500) {
            alert("Whoops! Something's not right with the server :(")
        }
    } else if (e.request) {
        alert("Nobody's answering on the other side...Is the server up?")
    }
}


export async function postLogin(credentials: Credentials) {
    const hashed = SHA256(credentials.password).toString()

    await axios.post('http://localhost:8081/login', {
        username: credentials.username,
        password: hashed,
    }, { withCredentials: true }).catch((e) => {
        notifyOfLoginError(e)
        throw e
    })
}
