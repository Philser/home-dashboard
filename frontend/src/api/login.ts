import axios, { AxiosError } from 'axios';
import { SHA256 } from 'crypto-js';
import { getApiBaseUrl } from './utils';

export interface Credentials {
    username: string,
    password: string;
}

function notifyOfLoginError(e: AxiosError) {
    if (e.response) {
        if (e.response.status === 401) {
            alert("Invalid credentials");
        }

        if (e.response.status === 500) {
            alert("Whoops! Something's not right with the server :(");
        }
    } else if (e.request) {
        alert("Nobody's answering on the other side...Is the server up?");
    }
}

export async function postLogin(credentials: Credentials) {
    await axios.post(`${getApiBaseUrl()}/login`, {
        username: credentials.username,
        password: credentials.password,
    }, { withCredentials: true }).catch((e) => {
        notifyOfLoginError(e);
        throw e;
    });
}
