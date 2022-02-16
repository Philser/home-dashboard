// tslint:disable:no-console

import { Express } from 'express'
import * as jwt from 'jsonwebtoken'
import { UserModel } from '../../model/User'
import * as bcrypt from 'bcrypt'
import { InternalServerError } from '../errors/Utils'


const PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----

-----END PRIVATE KEY-----
`

const PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwt/ClEbbriX2WQZreOwO
MFB7/OQDcP/e1Vx++6ez6hk9f3VyM2SvvMIAIVrkM6uxP2b8W+7HTNeYJHEsXSpB
+N9huTe+hPCrXMEbLTTIXx9NIMGmfOR1IC/vitydbN4JscjEloCD6Sd+Da6QU0iL
tSOWwdAvN4LD1/OCyMk79I/xcZBmk40zNW7wmHVJixbnhpdrK1bZZTf7F7nheMQF
q7adS5nbNb52qS1PFZY+5SUK3orZup+mAfEALm2VpbRJKy+BSGoqM/7DXW6E7PY4
WAr39SlZUnkI4bfIbPMuBuywfqacP+gEQZJ6Nzl9zb5SUnB+zEowVCOMSvgpLeB+
ebmQvWsRdUdoT8r/Bu7LllLvS8stG5sxQ/5h7gW5UKkBhIljdMG/057Ls8A71SDL
EUMqdt76O0A4KkvK75Qby5L/22zjVGH3xrX/I/0zWIu6TUkoYZ0FHqiKfn0/VdoB
911Pjx4E45uvqx4frys+tFyyRrKZ1tQPd3mqIftSCufu8jDS1xOGI8VnkxesnLCD
HY0TeCxcfWML4sDeiJ7rADYTpWHyByP5dDJTSNOqL1T8nHcvY9ifdc9+ZjndS2z+
Qg1n7EjFQRTXmZrnij2/7fQJQfd0/S30V0oR/atGaddluqr4PyjRjxpDAw8cQcpP
Prq+IvDuXldWhx8eLBBpJhECAwEAAQ==
-----END PUBLIC KEY-----
`

export function LoginHandler(app: Express) {
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
            const token = jwt.sign({}, PRIVATE_KEY, { algorithm: 'RS256' })
            console.log('Signed')

            jwt.verify(token, PUBLIC_KEY)
            console.log('Verified')

            // TODO: Set secure when using HTTPS/make it depending on the config
            res.cookie('token', `${token}; HttpOnly`)
            res.sendStatus(200)

        } catch (e) {
            InternalServerError(res, e, 'POST', '/login')
        }
    })
}
