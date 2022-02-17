// tslint:disable:no-console

import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

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

export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        console.log('Cookies: ' + JSON.stringify(req.cookies))
        if (req.cookies.token) {
            const token = req.cookies.token.split(';')[0]
            console.log(token)
            jwt.verify(token, PUBLIC_KEY, (err: Error, _: any) => {
                if (err) {
                    res.sendStatus(401)
                } else {
                    next()
                }
            })

        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        console.error(`Error in auth middleware: ${e}`)
        res.sendStatus(500)
    }
}
