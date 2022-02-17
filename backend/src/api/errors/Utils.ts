import { Response } from 'express'

// tslint:disable:no-console
export function InternalServerError(response: Response, error: Error, httpMethod: string, apiPath: string) {
    console.error(`Error in ${httpMethod} ${apiPath}: ${error}`)
    response.sendStatus(500)
}
