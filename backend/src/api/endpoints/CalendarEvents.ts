// tslint:disable:no-console

import { Express, Response } from 'express'
import { Config } from '../../config'
import { getAuthMiddleware } from '../../middleware/Auth'
import { InternalServerError } from '../errors/Utils'
import { CalendarEvent, CalendarEventModel } from '../../model/CalendarEvent'
import { Document } from 'mongoose'

interface CalendarEventApiObject extends CalendarEvent {
    id?: string
}
interface CalendarEventsApiGet {
    events: CalendarEventApiObject[]
}

function eventInputIsValid(eventInput: any) {
    if (!eventInput?.title || !eventInput?.date || !eventInput?.creator || !eventInput?.subject) {
        return false
    }

    return true
}

export function calendarEventHandler(app: Express, config: Config) {
    app.get('/api/events', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            const returnValue: CalendarEventsApiGet = {
                events: []
            }

            const entries = await CalendarEventModel.find({}).exec()
            if (entries !== null) {
                let event: CalendarEvent
                for (const entry of entries) {
                    event = {
                        ...entry
                    }
                    returnValue.events.push(event)
                }
            }

            res.send(returnValue)
        }
        catch (e) {
            InternalServerError(res, e, 'GET', '/api/events')
        }
    })

    // TODO
    app.post('/api/events', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            // TODO: Properly validate event
            if (!eventInputIsValid(req.body?.event)) {
                res.sendStatus(400)
                return
            }

            const event = new CalendarEventModel(req.body.event)
            await event.save()

            // Return the newly created ID to be set in the webapp
            res.send({
                id: event._id,
            })
        } catch (e) {
            InternalServerError(res, e, 'POST', '/api/events')
        }
    })

    // TODO
    app.put('/api/events', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!eventInputIsValid(req.body?.event) || !req.body?.event?.id) {
                res.sendStatus(400)
                return
            }
            const eventInput: CalendarEventApiObject = req.body.event

            const event = await CalendarEventModel.findById(eventInput.id).exec()
            if (!event) {
                res.sendStatus(404)
                return
            }

            event.title = eventInput.title
            event.subject = eventInput.subject
            event.date = eventInput.date
            event.creator = eventInput.creator
            await event.save()


            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'PUT', '/api/notebook')
        }
    })

    // TODO
    app.delete('/api/events', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body?.event?.id) {
                res.sendStatus(400)
                return
            }

            // TODO: Authorization?
            const doc = await CalendarEventModel.findByIdAndRemove(req.body.event.id).exec()
            if (!doc) {
                res.sendStatus(404)
                return
            }

            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'DELETE', '/api/notebook')
        }
    })
}
