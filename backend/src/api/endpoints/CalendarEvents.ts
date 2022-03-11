// tslint:disable:no-console

import { Express } from 'express'
import { Config } from '../../config'
import { getAuthMiddleware } from '../../middleware/Auth'
import { InternalServerError } from '../errors/Utils'
import { CalendarEvent, CalendarEventModel } from '../../model/CalendarEvent'

interface CalendarEventApiObject extends CalendarEvent {
    id?: string
}
interface CalendarEventsApiGet {
    events: CalendarEventApiObject[]
}

function eventInputIsValid(eventInput: any) {
    // TODO: Validation lib?
    if (!Object.prototype.hasOwnProperty.call(eventInput, 'title')
        || !Object.prototype.hasOwnProperty.call(eventInput, 'dateStart')
        || !Object.prototype.hasOwnProperty.call(eventInput, 'dateEnd')
        || !Object.prototype.hasOwnProperty.call(eventInput, 'allDay')
        || !Object.prototype.hasOwnProperty.call(eventInput, 'creator')
        || !Object.prototype.hasOwnProperty.call(eventInput, 'subject')
    )
        return false


    const dateStart = Date.parse(eventInput.dateStart)
    const dateEnd = Date.parse(eventInput.dateEnd)

    if (isNaN(dateStart) || isNaN(dateEnd) || dateEnd < dateStart) {
        return false
    }

    if (dateStart === dateEnd) {
        return eventInput.allDay === true
    }

    return true
}

export function calendarEventHandler(app: Express, config: Config) {
    app.get('/api/calendarEvents', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            const returnValue: CalendarEventsApiGet = {
                events: []
            }

            const entries = await CalendarEventModel.find({}).lean().exec()
            if (entries !== null) {
                let event: CalendarEvent
                for (const entry of entries) {
                    event = entry

                    returnValue.events.push(event)
                }
            }

            res.send(returnValue)
        }
        catch (e) {
            InternalServerError(res, e, 'GET', '/api/events')
        }
    })

    // TODO check creator & subject are valid IDs
    app.post('/api/calendarEvents', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            // TODO: Properly validate event
            if (!eventInputIsValid(req.body?.event)) {
                console.error(`Invalid POST event input: ${JSON.stringify(req.body)}`)
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

    app.put('/api/calendarEvents', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
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
            event.dateStart = eventInput.dateStart
            event.dateEnd = eventInput.dateEnd
            event.allDay = eventInput.allDay
            event.creator = eventInput.creator
            await event.save()


            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'PUT', '/api/notebook')
        }
    })

    app.delete('/api/calendarEvents', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
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
