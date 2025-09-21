<script setup>
import EventsCard from '@/components/EventsCard.vue'
import EventSearchHeader from '@/components/EventSearchHeader.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useToast } from 'vue-toastification'
import { useInterestedEvents } from '@/composables/useInterestEvents'
import { useUniventStore } from '@/stores/counter'
import { onMounted, ref, toRaw, watch } from 'vue'

const toast = useToast()
const univentStore = useUniventStore()
const { active, filteredEvents, deleteInterest, loading, fetchInterest } =
  useInterestedEvents(toast)

function handleDelete(event) {
  deleteInterest(event)
}
const res = ref([])
watch(active, async () => {
  result.value = await fetchInterest()
  res.value = result.value.events.map((e) => e.events)
  console.log('result', result.value)
})
const result = ref([])

onMounted(async () => {
  univentStore.dateDropdown = false
  univentStore.categoryDropdown = false
  univentStore.locationDropdown = false
  univentStore.organizerDropdown = false
  univentStore.priceDropdown = false
  console.log('data', filteredEvents.value)
  result.value = await fetchInterest(1)
  res.value = result.value.events.map((e) => e.events)
  console.log(toRaw(res.value), 'res')
})
async function pagination(param) {
  result.value = await fetchInterest(param)
  res.value = result.value.events.map((e) => e.events)
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
        :class="['upcoming-event', { upcomingActive: active === 'upcoming' }]"
        @click="active = 'upcoming'"
      >
        Upcoming Events
      </button>
      <button
        :class="['past-event', { upcomingActive: active === 'past' }]"
        @click="active = 'past'"
      >
        Past Events
      </button>
    </div>
    <div class="">
      <div class="">
        <button v-for="(data, i) in result.pageSum" :key="i" @click="pagination(i + 1)">
          {{ i + 1 }}
        </button>
      </div>
    </div>

    <div class="upcoming-events-container">
      <!-- <EventsCard
        :events="filteredEvents"
        v-if="filteredEvents.length >= 1"
        @deleteEvent="handleDelete"
      /> -->
      <EventsCard :events="res" v-if="res.length >= 1" @deleteEvent="handleDelete" />
      <div class="" v-if="!filteredEvents.length >= 1">
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
.upcoming-past .upcomingActive {
  border-bottom: 2px solid #1969fe;
  background: #f4f4f4;
}
</style>
