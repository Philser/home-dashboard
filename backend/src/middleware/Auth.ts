// tslint:disable:no-console

import { Request, Response, NextFunction } from 'express'

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

export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // console.log('Cookies: ' + JSON.stringify(req.cookies))
        // const token = req.cookies.token
        // if (jwt.verify(token, PUBLIC_KEY)) {
        //     next()
        // }

        // res.sendStatus(401)
        next()
    } catch (e) {
        console.error(`Error in auth middleware: ${e}`)
        res.sendStatus(500)
    }
}
