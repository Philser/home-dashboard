import { dirname } from 'path'
import * as fs from 'fs'

export interface Config {
    publicKeyPem: string
    privateKeyPem: string
    domain: string
    port: number

    dbHost: string
    dbUser: string
    dbPassword: string
    dbCollection: string
}

const DEFAULT_PORT = 8081 // default port to listen

function parsePublicPrivateKeys(): { publicKeyPem: string, privateKeyPem: string } {
    // TODO: Have a configurable absolute path for keys
    const appDir = dirname(require.main.filename)
    const publicKeyPem = fs.readFileSync(`${appDir}/../keys/public.pem`).toString()
    const privateKeyPem = fs.readFileSync(`${appDir}/../keys/private.pem`).toString()

    return {
        publicKeyPem,
        privateKeyPem
    }
}

export function parseConfig(): Config {
    try {
        let port = DEFAULT_PORT
        if (process.env.PORT) {
            port = parseInt(process.env.PORT, 10)

            if (Number.isNaN(port)) {
                throw new Error(`Invalid PORT value: ${process.env.PORT}. Expected number`)
            }
        }

        const domain = process.env.DOMAIN
        if (!domain) {
            throw new Error(`Missing ${Object.keys({ domain }).pop()}`)
        }

        const keys = parsePublicPrivateKeys()
        const publicKeyPem = keys.publicKeyPem
        const privateKeyPem = keys.privateKeyPem

        const dbHost = process.env.DB_HOST
        if (!domain) {
            throw new Error("Missing DB_HOST")
        }

        const dbUser = process.env.DB_USER
        if (!domain) {
            throw new Error("Missing DB_USER")
        }

        const dbPassword = process.env.DB_PASSWORD
        if (!dbPassword) {
            throw new Error("Missing DB_PASSWORD")
        }

        const dbCollection = process.env.DB_COLLECTION
        if (!dbCollection) {
            throw new Error("Missing DB_COLLECTION")
        }


        return {
            port,
            publicKeyPem,
            privateKeyPem,
            domain,
            dbHost,
            dbUser,
            dbPassword,
            dbCollection
        }
    } catch (e) {
        throw new Error(`Error parsing config: ${e}`)
    }
}
