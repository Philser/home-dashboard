// tslint:disable:no-console

import { Express } from 'express'
import * as jwt from 'jsonwebtoken'
import { UserModel } from '../model/User'
import * as bcrypt from 'bcrypt'


// const PUBLIC_KEY = `
// -----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2H2b4+dlqFlbQPTSx5hP
// rljZYHZChEq56f6pRJQOgDL4pzALJYJXnOMc8QfF/L/a9Jrr3ehm2VJl3UgPyp0n
// eElJseWLPNYatD7ab0a7VlHlBij0OWIYV3XkqQDFDdC9n0XysZ7/Wpc+Veoc6dDT
// +juySXFWgLV/+7VaS9X8/KyI17y/Kk8ytYVyuVziaR6E6zb/82XTwOY7jg+btkDv
// LbsmH8T7wbeUB6IZHAaupApL05HwAEevrbs2+Kx7Pi7oecPGuPZBtcqJvS4tjCnX
// 7pfr+WyiQzFR/3+Lo/TPvjbHHQKaXYboZEFMMf3IOOwT/dTYdjF/TiSDlW3j39GG
// fyxrxx3fLO6zwgfXNhDVNnVHD6KIoIQLmvYqXvwRA/Paa+5FVEvInIJZqnXXrJ46
// wZl0jAh1686iS7OZUZf8HTVaX7nG7uy7t4OojNPE9kdKsMQkjGFeEdgT1tR83BQw
// Io7t9OrAnP/vwbfXeic8URqeNAZzsSsBdSzwx9GMa4WyfgiYPMrCNn+GD1GZ5QHh
// pgM3Sl+t4KZm5lZcF2AY+yu6q8/HRyNS6tBa1MQea/gHEjGd/wGAHAtOP82hX09m
// Hbm+5LIYee1niFV2rngqagMmjMTI8cbVVcUfBf5qbk3nlDR8aqZRGlyjYUFtCAC3
// ofm3AM8GIGYQ+nzcrc0bd6UCAwEAAQ==
// -----END PUBLIC KEY-----`

const PRIVATE_KEY = ``

export function LoginHandler(app: Express) {
    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body

            const savedUser = await UserModel.findOne({})

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
            const token = jwt.sign('test', PRIVATE_KEY)

            // TODO: Set secure when using HTTPS/make it depending on the config
            res.cookie('token', `${token}; HttpOnly`)
            res.sendStatus(200)

        } catch (e) {
            console.error(`Failed to query user: ${e.stack}`)
            res.sendStatus(500)

            return null
        }
    })
}
