<script setup>
import EventsCard from '@/components/EventsCard.vue'
import EventSearchHeader from '@/components/EventSearchHeader.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useToast } from 'vue-toastification'
import { useInterestedEvents } from '@/composables/useInterestEvents'

const toast = useToast()
const { active, filteredEvents, deleteInterest } = useInterestedEvents(toast)

function handleDelete(event) {
  deleteInterest(event)
}
</script>

<template>
  <div class="interested-events">
    <EventSearchHeader
      header="Interested Events"
      title="Keep track of all the events you’ve marked interest in."
    />

    <div class="upcoming-past">
      <button
        :class="['upcoming-event', { active: active === 'upcoming' }]"
        @click="active = 'upcoming'"
      >
        Upcoming Events
      </button>
      <button :class="['past-event', { active: active === 'past' }]" @click="active = 'past'">
        Past Events
      </button>
    </div>

    <div class="upcoming-events-container">
      <EventsCard
        :events="filteredEvents"
        v-if="filteredEvents.length >= 1"
        @deleteEvent="handleDelete"
      />
      <div class="" v-else>
        <SkeletonLoader />
      </div>
    </div>
  </div>
</template>

<style scoped>
.interested-events {
  display: flex;
  flex-direction: column;
}
.upcoming-events-container {
  max-width: 90%;
  width: 100%;
  gap: 16px;
  display: grid;
  margin: 0 auto;
  grid-template-columns: 1fr 1fr 1fr;
}
.upcoming-past {
  display: flex;
  border-bottom: 2px solid #eaeaea;
  margin: 20px auto 50px;
  max-width: 90%;
  width: 100%;
}
.upcoming-past button {
  width: 298px;
  padding: 16px 0;
  background: transparent;
  border: 0;
  color: #5a5a5a;
  font-weight: 600;
  font-size: 19px;
}
.upcoming-past .active {
  border-bottom: 2px solid #1969fe;
  background: #f4f4f4;
}
</style>
