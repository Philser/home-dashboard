import axios from 'axios'
import { getApiBaseUrl } from './utils'

export type EventId = string

export interface CalendarEvent {
    id?: string,
    title: string,
    dateStart: Date,
    dateEnd: Date,
    allDay: boolean,
    creator: string,
    subject: string,
    category: string
}

export async function postEvent(event: CalendarEvent): Promise<EventId> {
    const response = await axios.post(`${getApiBaseUrl()}/calendarEvents`, { event }, { withCredentials: true })

    return response.data.id as EventId
}

export async function getEvents(): Promise<CalendarEvent[]> {
    const response = await axios.get(`${getApiBaseUrl()}/calendarEvents`, { withCredentials: true })

    return response.data.events
}

export async function putEvent(event: CalendarEvent, eventId: string) {
    await axios.put(`${getApiBaseUrl()}/calendarEvents/${eventId}`, { event }, { withCredentials: true })
}

export async function deleteEvent(eventId: string) {
    await axios.delete(`${getApiBaseUrl()}/calendarEvents/${eventId}`, { withCredentials: true })
}
