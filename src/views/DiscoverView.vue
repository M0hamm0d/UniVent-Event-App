<script setup>
import EventSearchHeader from '@/components/EventSearchHeader.vue'
import EventsCard from '@/components/EventsCard.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { onMounted } from 'vue'
// import { modalStore } from '@/stores/counter'
import { useEventFilters } from '@/composables/useEventFilters'
import { useRequestedEvents } from '@/composables/useRequestedEvents'

// const store = modalStore()
const { filter, loading, noEvent, handleFilters, filterUpcomingEventOnlyAndInterested } =
  useEventFilters()
const { fetchRequestedAndEvents } = useRequestedEvents()

onMounted(async () => {
  try {
    loading.value = true
    // store.handleAuthStateChange()
    const result = await fetchRequestedAndEvents()

    if (result.events.length > 0) {
      filter.value = await filterUpcomingEventOnlyAndInterested(result.events)
    } else {
      filter.value = await filterUpcomingEventOnlyAndInterested(result.events)
    }
  } catch (err) {
    console.error('onMounted error:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <EventSearchHeader
      header="Discover Events on Campus"
      title="Find the best happenings on campus – from academic workshops to social hangouts."
      @filter-changed="handleFilters"
    />
    <div class="no-result" v-if="noEvent">
      <img src="/no-result.png" alt="" />
    </div>
    <div class="events-section">
      <EventsCard :events="filter" />
    </div>
    <!-- <div class="events-section">
      <EventsCard :events="store.eventsArray" />
    </div> -->
    <div class="skeleton" v-if="loading">
      <SkeletonLoader v-for="i in 3" :key="i" />
    </div>
  </div>
</template>
<style scoped>
.skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 90%;
  margin: 30px auto;
  width: 100%;
  gap: 16px;
}
.no-result {
  width: 347px;
  margin: auto;
}
.no-result img {
  width: 100%;
}
.events-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  max-width: 90%;
  width: 100%;
  margin: 30px auto;
}
</style>
