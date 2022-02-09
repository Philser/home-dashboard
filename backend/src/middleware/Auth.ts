import { Request, Response, NextFunction } from 'express'
import { getDb } from '../db/Mongo'
import { hashPassword } from '../crypto/Hash'


export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {

    next()
}
