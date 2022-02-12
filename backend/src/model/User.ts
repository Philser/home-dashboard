import { model, Schema } from 'mongoose'
import { USER_COLLECTION } from '../db/Mongo'

export interface User {
    username: string
    passwordHash: string
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }
})

export const UserModel = model<User>(USER_COLLECTION, userSchema)
