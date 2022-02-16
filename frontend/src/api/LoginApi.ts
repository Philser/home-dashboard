import axios from 'axios'
import { SHA256 } from 'crypto-js'

export interface Credentials {
    username: string,
    password: string
}

export class LoginApi {
    static async postLogin(credentials: Credentials) {

        const hashed = SHA256(credentials.password).toString()

        await axios.post('http://localhost:8081/login', {
            username: credentials.username,
            password: hashed,
        }, { withCredentials: true })
    }
}
