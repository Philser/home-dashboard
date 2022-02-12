import { Request, Response, NextFunction } from 'express'


export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    // const verified = jwt.verify(token, PUBLIC_KEY)
    next()
}
