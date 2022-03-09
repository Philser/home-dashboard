import { model, Schema } from 'mongoose'
import { CALENDAR_EVENT_COLLECTION } from '../db/Mongo'

export interface CalendarEvent {
    title: string,
    date: Date,
    creator: string,
    subject: string,
}


const calendarEventSchema = new Schema<CalendarEvent>({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
})

export const CalendarEventModel = model<CalendarEvent>(CALENDAR_EVENT_COLLECTION, calendarEventSchema, CALENDAR_EVENT_COLLECTION)
