// tslint:disable:no-console

import { Express, Response } from 'express'
import { Config } from '../../config'
import { getAuthMiddleware } from '../../middleware/Auth'
import { InternalServerError } from '../errors/Utils'
import { CalendarEvent, CalendarEventModel } from '../../model/CalendarEvent'
import { createBrotliCompress } from 'zlib'

interface CalendarEventsApiObject {
    events: CalendarEvent[]
}

function eventInputIsValid(eventInput: any) {
    if (!eventInput || !eventInput.title || !eventInput.date || !eventInput.creator || !eventInput.subject) {
        return false
    }

    return true
}

export function calendarEventHandler(app: Express, config: Config) {
    app.get('/api/events', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            const returnValue: CalendarEventsApiObject = {
                events: []
            }

            const entries = await CalendarEventModel.find({})
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
            await event.save().catch((err) => {
                console.log(`saving event in DB failed: ${err}`)
                res.sendStatus(400)
            })

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
            if (!req.body || !req.body.notebook || !req.body.notebook.text) {
                res.sendStatus(400)
                return
            }

            let notebook = await NotebookModel.findOne()
            if (notebook) {
                await NotebookModel.replaceOne({ _id: notebook._id }, req.body.notebook)
            }
            else {
                notebook = new NotebookModel({ text: req.body.notebook.text })
                await notebook.save()
            }

            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'PUT', '/api/notebook')
        }
    })

    // TODO
    app.delete('/api/events', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body || !req.body.notebook || !req.body.notebook.text) {
                res.sendStatus(400)
                return
            }

            let notebook = await NotebookModel.findOne()
            if (notebook) {
                await NotebookModel.replaceOne({ _id: notebook._id }, req.body.notebook)
            }
            else {
                notebook = new NotebookModel({ text: req.body.notebook.text })
                await notebook.save()
            }

            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'PUT', '/api/notebook')
        }
    })
}
