import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
            // Store hash in your password DB.
            if (err) {
                reject(err)
            }
            resolve(hash)
        })
    })
}
