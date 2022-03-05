// tslint:disable:no-console

import { Express } from 'express'
import * as jwt from 'jsonwebtoken'
import { UserModel } from '../../model/User'
import * as bcrypt from 'bcrypt'
import { InternalServerError } from '../errors/Utils'
import { Config } from '../../config'

export function LoginHandler(app: Express, config: Config) {
    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body

            const savedUser = await UserModel.findOne({ username }).exec()

            if (!savedUser) {
                // TODO: Proper error message body
                console.error(`Invalid login attempt through unknown user: ${username}`)
                res.sendStatus(401)
                return
            }

            const isValid = await bcrypt.compare(password, savedUser.passwordHash)
            if (!isValid) {
                res.sendStatus(401)
            }

            // TODO: Create JWT
            const token = jwt.sign({}, config.privateKeyPem, { algorithm: 'RS256' })
            console.log('Signed')

            // TODO: Set secure when using HTTPS/make it depending on the config
            res.cookie('token', `${token}; HttpOnly; SameSite=None; Secure`)
            res.sendStatus(200)

        } catch (e) {
            InternalServerError(res, e, 'POST', '/login')
        }
    })
}
