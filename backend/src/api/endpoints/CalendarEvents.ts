// tslint:disable:no-console

import { Express } from 'express';
import { Config } from '../../config';
import { getAuthMiddleware } from '../../middleware/Auth';
import { InternalServerError } from '../errors/Utils';
import { CalendarEvent, CalendarEventModel } from '../../model/CalendarEvent';
import { isValidObjectId } from 'mongoose';

const DEFAULT_EVENT_CATEGORY = 'General';

interface CalendarEventApiObject extends CalendarEvent {
    id: string;
}
interface CalendarEventsApiGet {
    events: CalendarEventApiObject[];
}

// TODO: use is-myth
function validateEventInput(eventInput: any): { isError: boolean, message?: string; } {
    // TODO: Validation lib?
    const mandatoryProperties = ['title', 'dateStart', 'dateEnd', 'allDay', 'creator', 'subject'];
    for (const property of mandatoryProperties) {
        if (!Object.prototype.hasOwnProperty.call(eventInput, property)) {
            return { isError: true, message: `Missing mandatory property "${property}"` };
        }
    }

    const dateStart = Date.parse(eventInput.dateStart);
    if (isNaN(dateStart)) {
        return { isError: true, message: 'Provided invalid dateStart' };
    }

    const dateEnd = Date.parse(eventInput.dateEnd);
    if (isNaN(dateEnd)) {
        return { isError: true, message: 'Provided invalid dateEnd' };
    }

    if (dateEnd < dateStart) {
        return { isError: true, message: 'dateEnd must not be earlier than dateStart' };
    }

    if (dateStart === dateEnd && !eventInput.allDay) {
        return { isError: true, message: 'dateStart and dateEnd can only be equal for allDay events' };
    }

    return { isError: false };
}

export function calendarEventHandler(app: Express, config: Config) {
    app.get('/api/calendarEvents', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            const returnValue: CalendarEventsApiGet = {
                events: []
            };

            const entries = await CalendarEventModel.find({}).lean().exec();
            if (entries !== null) {
                let event: CalendarEventApiObject;
                for (const entry of entries) {
                    const id = entry._id.toString();
                    delete entry._id;
                    event = { ...entry, id };
                    if (!event.category) {
                        // TODO: This should be a migration
                        event.category = DEFAULT_EVENT_CATEGORY;
                    }

                    returnValue.events.push(event);
                }
            }

            res.send(returnValue);
        }
        catch (e) {
            InternalServerError(res, e, 'GET', '/api/events');
        }
    });

    // TODO check creator & subject are valid IDs
    app.post('/api/calendarEvents', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            // TODO: Properly validate event
            const validateResult = validateEventInput(req.body?.event);
            if (validateResult.isError) {
                console.error(`Invalid POST event input: ${JSON.stringify(req.body?.event)}`);
                res.status(400).send(validateResult.message);
                return;
            }


            const event = new CalendarEventModel(req.body.event);
            if (!event.category) {
                event.category = DEFAULT_EVENT_CATEGORY;
            }
            await event.save();

            // Return the newly created ID to be set in the webapp
            res.send({
                id: event._id,
            });
        } catch (e) {
            InternalServerError(res, e, 'POST', '/api/events');
        }
    });

    // TODO: Middleware for object id validation
    app.put('/api/calendarEvents/:eventId', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            const eventInput: CalendarEventApiObject = req.body.event;
            if (!isValidObjectId(req.params.eventId)) {
                res.status(400).send(JSON.stringify({ error: 'Invalid event ID' }));
                return;
            }

            const event = await CalendarEventModel.findById(req.params.eventId).exec();
            if (!event || event.errors) {
                res.sendStatus(404);
                return;
            }

            event.title = eventInput.title;
            event.subject = eventInput.subject;
            event.dateStart = eventInput.dateStart;
            event.dateEnd = eventInput.dateEnd;
            event.allDay = eventInput.allDay;
            event.creator = eventInput.creator;
            event.category = eventInput.category || event.category;
            await event.save();


            res.sendStatus(200);
        } catch (e) {
            InternalServerError(res, e, 'PUT', '/api/notebook');
        }
    });

    app.delete('/api/calendarEvents/:eventId', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            if (!isValidObjectId(req.params.eventId)) {
                res.status(400).send(JSON.stringify({ error: 'Invalid event ID' }));
                return;
            }
            // TODO: Allow for user-owned events only?
            const doc = await CalendarEventModel.findByIdAndRemove(req.params.eventId).exec();
            if (!doc) {
                res.sendStatus(404);
                return;
            }

            res.sendStatus(200);
        } catch (e) {
            InternalServerError(res, e, 'DELETE', '/api/notebook');
        }
    });
}
