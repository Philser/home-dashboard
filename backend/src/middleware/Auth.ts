// tslint:disable:no-console

import { RequestHandler } from 'express'
import * as jwt from 'jsonwebtoken'


export function getAuthMiddleware(publicKey: string): RequestHandler {
    return (req, res, next) => {
        try {
            if (req.cookies.token) {
                const token = req.cookies.token.split(';')[0]
                console.log(token)
                jwt.verify(token, publicKey, (err: Error, _: any) => {
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
}
