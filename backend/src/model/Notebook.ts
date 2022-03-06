import { Schema, model } from 'mongoose'
import { NOTEBOOK_COLLECTION } from '../db/Mongo'

export interface Notebook {
    text: string
}


const notebookSchema = new Schema<Notebook>({
    text: {
        type: String,
        required: true
    }
})


export const NotebookModel = model<Notebook>(NOTEBOOK_COLLECTION, notebookSchema, NOTEBOOK_COLLECTION)
