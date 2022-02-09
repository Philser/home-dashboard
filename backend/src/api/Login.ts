// tslint:disable:no-console

import { getDb, USER_COLLECTION } from '../db/Mongo'
import { Express } from 'express'
import * as bcrypt from 'bcrypt'
import { User } from '../model/User'

export function LoginHandler(app: Express) {
    app.post('/login', async (req, res) => {
        try {
            const db = await getDb()
            const { username, password } = req.body

            const savedUser = await db.collection<User>(USER_COLLECTION).findOne({ username })

            if (!savedUser) {
                // TODO: Proper error message body
                console.error(`Invalid login attempt through unknown user: ${username}`)
                res.sendStatus(401)
            }

            const isValid = await bcrypt.compare(password, savedUser.passwordHash)
            if (!isValid) {
                res.sendStatus(401)
            }

            // TODO: Create JWT
        } catch (e) {
            console.error(`Failed to query user: ${e}`)
            res.sendStatus(500)

            return null
        }
    })
}
