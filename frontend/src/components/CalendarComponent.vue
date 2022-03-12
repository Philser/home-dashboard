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
          ></v-text-field>
          <v-list>
            <v-list-item>
              <v-col>
                <v-list-item-title>{{
                  dialogStartDateString
                }}</v-list-item-title>
              </v-col>
              <v-list-item-title>--</v-list-item-title>
              <v-col>
                <v-list-item-title>{{ dialogEndDateString }}</v-list-item-title>
              </v-col>
            </v-list-item>
          </v-list>
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
// TODO: how to disable globally?
import '@fullcalendar/core/vdom' // solve problem with Vite
import FullCalendar, {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Ref, ref } from 'vue'
import { getEvents, postEvent } from '../api/calendarEvents'

async function handleDateSelect(selectInfo: DateSelectArg) {
  try {
    // const title = prompt('Enter a title')
    const title = ''
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (!title) {
      return
    }

    const dateStart = new Date(selectInfo.startStr)
    const dateEnd = new Date(selectInfo.endStr)
    const { allDay } = selectInfo
    const eventId = await postEvent({
      title,
      dateStart,
      dateEnd,
      allDay,
      creator: '0',
      subject: '0',
    })

    calendarApi.addEvent({
      id: eventId,
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    })
  } catch (e) {
    alert(`Saving event failed: ${e}`)
  }
}

async function getInitialEvents(): Promise<EventInput[]> {
  try {
    const eventInput = []
    const apiEvents = await getEvents()
    for (const event of apiEvents) {
      const start = new Date(event.dateStart)
      const end = new Date(event.dateEnd)
      eventInput.push({
        id: event.id,
        title: event.title,
        start,
        end,
        allDay: event.allDay,
      })
    }

    return eventInput
  } catch (e) {
    alert(`Could not get calendar events: ${e}`)
    return []
  }
}

function buildDialogDateString(
  startDateString: string,
  allDay: boolean,
  isEndDate: boolean,
): string {
  const date = new Date(startDateString)

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
    const minutes = date.getMinutes() === 0 ? '' : `${date.getMinutes()}`
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

    const currentEvents: Ref<EventApi[]> = ref([])

    const dialogStartDateString = ref('Init')
    const dialogEndDateString = ref('Init')

    function handleDateSelectWrapper(selectInfo: DateSelectArg) {
      dialogStartDateString.value = buildDialogDateString(
        selectInfo.startStr,
        selectInfo.allDay,
        false,
      )

      dialogEndDateString.value = buildDialogDateString(
        selectInfo.endStr,
        selectInfo.allDay,
        true,
      )

      datePickerIsActive.value = true
      handleDateSelect(selectInfo)
    }

    function handleEventClick(clickInfo: EventClickArg) {
      datePickerIsActive.value = true
      clickInfo.event.remove()
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
      dialogStartDateString,
      dialogEndDateString,
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
