<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <!-- date pick dialog -->
      <v-dialog
        content-class="v-dialog--custom"
        v-model="datePickerIsActive"
        persistent
      >
        <v-card>
          <div style="display: flex; justify-content: flex-end">
            <v-btn
              v-if="datePickInfo.eventId"
              @click="
                removeEvent(datePickInfo.eventId, datePickInfo.calendarApi),
                  (datePickerIsActive = false)
              "
              variant="plain"
              class="ma-2"
              icon="mdi-delete"
            >
            </v-btn>
            <v-btn
              @click="datePickerIsActive = false"
              variant="plain"
              class="ma-2"
              icon="mdi-close"
            >
            </v-btn>
          </div>

          <v-text-field
            type="text"
            id="eventTitleInput"
            name="eventTitleInput"
            label="Title"
            v-model="datePickInfo.title"
          ></v-text-field>
          <v-list>
            <v-list-item>
              <v-col>
                <v-list-item-title>{{
                  buildDialogDateString(
                    new Date(datePickInfo.startStr),
                    datePickInfo.allDay,
                    false,
                  )
                }}</v-list-item-title>
              </v-col>
              <v-list-item-title>--</v-list-item-title>
              <v-col>
                <v-list-item-title>{{
                  buildDialogDateString(
                    new Date(datePickInfo.endStr),
                    datePickInfo.allDay,
                    true,
                  )
                }}</v-list-item-title>
              </v-col>
            </v-list-item>
            <v-list-item>
              <v-menu top v-model="categoryPickerIsActive">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props">
                    <v-icon :color="getCategoryColor(datePickInfo.category)"
                      >mdi-circle</v-icon
                    ></v-btn
                  >
                  <v-subheader> {{ datePickInfo.category }}</v-subheader>
                </template>
                <v-card>
                  <v-list>
                    <v-list-item
                      v-for="(item, i) in Object.keys(
                        CATEGORY_TO_COLOR_MAPPING,
                      )"
                      :key="i"
                    >
                      <v-list-item-avatar left>
                        <v-btn
                          @click="
                            ;(datePickInfo.category = item),
                              (categoryPickerIsActive = false)
                          "
                          icon
                          v-bind="props"
                        >
                          <v-icon :color="getCategoryColor(item)"
                            >mdi-circle</v-icon
                          >
                        </v-btn>
                      </v-list-item-avatar>
                      <v-list-item-title>
                        {{ item }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-col class="text-right">
              <v-btn @click="datePickerIsActive = false">Cancel</v-btn>
              <v-btn @click="saveEventWrapper()">Save</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <FullCalendar class="demo-app-calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script lang='ts'>
/* eslint-disable no-restricted-syntax */
/* eslint-disable operator-linebreak */
// TODO: how to disable globally?
import '@fullcalendar/core/vdom' // solve problem with Vite
import FullCalendar, {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventInput,
  CalendarApi,
} from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Ref, ref } from 'vue'
import {
  getEvents,
  postEvent,
  putEvent,
  deleteEvent,
} from '../api/calendarEvents'

interface DatePickInfo {
  startStr: string
  endStr: string
  allDay: boolean
  calendarApi: CalendarApi
  title?: string
  eventId?: string
  category: string
}

const EVENT_CATEGORY_PROP_NAME = 'eventCategory'
const DEFAULT_EVENT_CATEGORY = 'General'
const CATEGORY_TO_COLOR_MAPPING = {
  [DEFAULT_EVENT_CATEGORY]: '#4682B4',
  Phil: '#8A2BE2',
  Katya: '#FA8072',
}

function getCategoryColor(category: string) {
  console.log(`Color:${category}`)
  return (
    CATEGORY_TO_COLOR_MAPPING[category] ||
    CATEGORY_TO_COLOR_MAPPING[DEFAULT_EVENT_CATEGORY]
  )
}

async function saveEvent(datePickInfo: DatePickInfo) {
  try {
    const { calendarApi } = datePickInfo

    calendarApi.unselect() // clear date selection

    if (!datePickInfo.title) {
      // TODO Error message instead of close
      return
    }

    const dateStart = new Date(datePickInfo.startStr)
    const dateEnd = new Date(datePickInfo.endStr)
    const { allDay } = datePickInfo
    let { eventId } = datePickInfo

    if (datePickInfo.eventId) {
      const calEvent = calendarApi.getEventById(datePickInfo.eventId)
      if (!calEvent) {
        // TODO Handle error? This shouldnt happen anyway, just to appease the linter
        return
      }

      await putEvent(
        {
          title: datePickInfo.title,
          dateStart,
          dateEnd,
          allDay,
          category: datePickInfo.category,
          creator: '0',
          subject: '0',
        },
        datePickInfo.eventId,
      )
      calEvent.remove() // there's no updating a calendar event, so we remove and re-add it
    } else {
      eventId = await postEvent({
        title: datePickInfo.title,
        dateStart,
        dateEnd,
        allDay,
        category: datePickInfo.category,
        creator: '0',
        subject: '0',
      })
    }

    const color = getCategoryColor(datePickInfo.category)
    const newEvent = calendarApi.addEvent({
      id: eventId,
      title: datePickInfo.title,
      start: datePickInfo.startStr,
      end: datePickInfo.endStr,
      allDay: datePickInfo.allDay,
      backgroundColor: color,
      borderColor: color,
    })
    newEvent.setExtendedProp(EVENT_CATEGORY_PROP_NAME, datePickInfo.category)
  } catch (e) {
    alert(`Saving event failed: ${e}`)
  }
}

async function removeEvent(eventId: string, calendarApi: CalendarApi) {
  try {
    if (!eventId) {
      return
    }

    await deleteEvent(eventId)

    const event = calendarApi.getEventById(eventId)
    if (event) {
      event.remove()
    } else {
      throw new Error(`$could not find calendar event ${eventId} for deletion`)
    }
  } catch (e) {
    console.error(`Error deleting event: ${e}`)
    alert(`Error deleting event`)
  }
}

async function getInitialEvents(): Promise<EventInput[]> {
  try {
    const eventInput = []
    const apiEvents = await getEvents()
    for (const event of apiEvents) {
      const start = new Date(event.dateStart)
      const end = new Date(event.dateEnd)
      const color = getCategoryColor(event.category)
      eventInput.push({
        id: event.id,
        title: event.title,
        start,
        end,
        allDay: event.allDay,
        backgroundColor: color,
        borderColor: color,
      })
    }

    return eventInput
  } catch (e) {
    alert(`Could not get calendar events: ${e}`)
    return []
  }
}

function buildDialogDateString(
  date: Date,
  allDay: boolean,
  isEndDate: boolean,
): string {
  if (isEndDate && allDay) {
    // endStr is exclusive for the fullCalendar component, which means it stores
    // the next day if it is an all-day event.
    // For our dialog, however, we want to display the last day that
    // is still affected by the event
    date.setDate(date.getDate() - 1)
  }

  let dialogDateString = `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()}`

  if (!allDay) {
    const minutes = date.getMinutes() === 0 ? '00' : `${date.getMinutes()}`
    dialogDateString = `${dialogDateString} ${date.getHours()}:${minutes}`
  }

  return dialogDateString
}

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const datePickerIsActive = ref(false)
    const categoryPickerIsActive = ref(false)

    const currentEvents: Ref<EventApi[]> = ref([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datePickInfo: Ref<DatePickInfo> = ref({} as any)

    function saveEventWrapper() {
      saveEvent(datePickInfo.value)
      datePickerIsActive.value = false
    }

    function handleDateSelectWrapper(selectInfo: DateSelectArg) {
      datePickInfo.value = {
        startStr: selectInfo.startStr,
        endStr: selectInfo.endStr,
        allDay: selectInfo.allDay,
        calendarApi: selectInfo.view.calendar,
        category: DEFAULT_EVENT_CATEGORY,
      }
      datePickerIsActive.value = true
    }

    function handleEventClick(clickInfo: EventClickArg) {
      datePickInfo.value = {
        startStr: clickInfo.event.startStr,
        endStr: clickInfo.event.endStr,
        allDay: clickInfo.event.allDay,
        calendarApi: clickInfo.view.calendar,
        title: clickInfo.event.title,
        eventId: clickInfo.event.id,
        category:
          // Prettier issue: https://github.com/prettier/prettier/issues/3806
          // eslint-disable-next-line operator-linebreak
          clickInfo.event.extendedProps[EVENT_CATEGORY_PROP_NAME] ||
          DEFAULT_EVENT_CATEGORY,
      }
      datePickerIsActive.value = true
    }

    function handleEvents(events: EventApi[]) {
      currentEvents.value = events
    }

    const eventsRef: Ref<EventInput[]> = ref([])
    getInitialEvents().then((init) => {
      eventsRef.value = init
    })

    const calendarOptions = ref({
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin, // needed for dateClick
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      events: eventsRef,
      firstDay: 1,
      select: handleDateSelectWrapper,
      eventClick: handleEventClick,
      eventsSet: handleEvents,
      /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
    })

    function handleWeekendsToggle() {
      calendarOptions.value.weekends = !calendarOptions.value.weekends // update a property
    }

    return {
      calendarOptions,
      currentEvents,
      handleWeekendsToggle,
      datePickerIsActive,
      datePickInfo,
      categoryPickerIsActive,
      buildDialogDateString,
      saveEventWrapper,
      removeEvent,
      getCategoryColor,
      CATEGORY_TO_COLOR_MAPPING,
    }
  },
}
</script>

<style lang='css'>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

.v-dialog--custom {
  width: 30%;
}
</style>
