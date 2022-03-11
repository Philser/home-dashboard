<template>
  <div class="demo-app">
    <div class="demo-app-main">
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
  CalendarOptions,
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
    const title = prompt('Enter a title')
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
      creator: 'Joe',
      subject: 'Mama',
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
    console.log(`Done getting events: ${JSON.stringify(eventInput)}`)
    return eventInput
  } catch (e) {
    alert(`Could not get calendar events: ${e}`)
    return []
  }
}

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const currentEvents: Ref<EventApi[]> = ref([])

    function handleEventClick(clickInfo: EventClickArg) {
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
      select: handleDateSelect,
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
</style>
