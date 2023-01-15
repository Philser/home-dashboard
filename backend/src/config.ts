import * as fs from 'fs';
import * as dotenv from 'dotenv';

export interface Config {
    publicKeyPem: string;
    privateKeyPem: string;
    domain: string;
    port: number;

    cert: string;
    certKey: string;

    dbHost: string;
    dbUser: string;
    dbPassword: string;
    dbCollection: string;
}

const DEFAULT_PORT = 8081; // default port to listen

function parseJWTKeys(): { publicKeyPem: string, privateKeyPem: string; } {
    // TODO: Have a configurable absolute path for keys
    const publicKeyPem = fs.readFileSync(`${process.env.KEY_DIRECTORY}/public.pem`).toString();
    const privateKeyPem = fs.readFileSync(`${process.env.KEY_DIRECTORY}/private.pem`).toString();

    return {
        publicKeyPem,
        privateKeyPem
    };
}

function parseSSLCert(certPath: string, keyPath: string): { cert: string, certKey: string; } {
    const cert = fs.readFileSync(certPath).toString();
    const certKey = fs.readFileSync(keyPath).toString();

    return {
        cert,
        certKey
    };
}

export function parseConfig(): Config {
    try {
        dotenv.config();
        let port = DEFAULT_PORT;
        if (process.env.PORT) {
            port = parseInt(process.env.PORT, 10);

            if (Number.isNaN(port)) {
                throw new Error(`Invalid PORT value: ${process.env.PORT}. Expected number`);
            }
        }

        const domain = process.env.DOMAIN;
        if (!domain) {
            throw new Error(`Missing DOMAIN`);
        }

        const { publicKeyPem, privateKeyPem } = parseJWTKeys();

        // const { cert, certKey } = parseSSLCert(`${process.env.KEY_DIRECTORY}/cert.pem`, `${process.env.KEY_DIRECTORY}/cert_key.pem`);

        const dbHost = process.env.DB_HOST;
        if (!domain) {
            throw new Error('Missing DB_HOST');
        }

        const dbUser = process.env.DB_USER;
        if (!domain) {
            throw new Error('Missing DB_USER');
        }

        const dbPassword = process.env.DB_PASSWORD;
        if (!dbPassword) {
            throw new Error('Missing DB_PASSWORD');
        }

        const dbCollection = process.env.DB_COLLECTION;
        if (!dbCollection) {
            throw new Error('Missing DB_COLLECTION');
        }


        return {
            port,
            publicKeyPem,
            privateKeyPem,
            domain,
            cert,
            certKey,
            dbHost,
            dbUser,
            dbPassword,
            dbCollection
        };
    } catch (e) {
        throw new Error(`Error parsing config: ${e}`);
    }
}

