<script setup>
import EventSearchHeader from '@/components/EventSearchHeader.vue'
import EventsCard from '@/components/EventsCard.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { onMounted, ref, watch } from 'vue'
import { useEventFilters } from '@/composables/useEventFilters'
import { useRequestedEvents } from '@/composables/useRequestedEvents'
import { useUniventStore } from '@/stores/counter'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { filter, loading, noEvent, handleFilters, filterUpcomingEventOnlyAndInterested } =
  useEventFilters()
const { fetchRequestedAndEvents } = useRequestedEvents()
const univentStore = useUniventStore()
const pagesNo = ref(false)
const emptyEvent = ref(false)
const resultNo = ref(null)
const unavailableEvent = ref(false)
const count = ref(null)
const searchFromId = ref([])
onMounted(async () => {
  univentStore.dateDropdown = false
  univentStore.categoryDropdown = false
  univentStore.locationDropdown = false
  univentStore.organizerDropdown = false
  univentStore.priceDropdown = false
  univentStore.currentPage = Number(route.query.page) || 1

  if (route.query.eventId) {
    const allEvent = await fetchRequestedAndEvents(univentStore.currentPage)
    searchFromId.value = allEvent.allEvents.filter((e) => e.id === route.query.eventId)
    if (searchFromId.value.length === 0) {
      toast.error('Event is currently unavailable')
      unavailableEvent.value = true
    }
    return
  } else if (!route.query.eventId) {
    try {
      loading.value = true
      const result = await fetchRequestedAndEvents(
        univentStore.currentPage,
        univentStore.activeFilters,
      )
      console.log(result.events)
      for (let i = 0; i < result.pagesNo; i++) {
        test.value.push(i)
      }
      pagesNo.value = univentStore.pageCount > 1
      resultNo.value = result.pagesNo
      count.value = result.count
      filter.value = await filterUpcomingEventOnlyAndInterested(result.events)
      if (filter.value.length == 0) {
        emptyEvent.value = true
      }
    } catch (err) {
      console.error('onMounted error:', err)
    } finally {
      loading.value = false
    }
  }
})
const test = ref([])
async function pagination(param) {
  univentStore.currentPage = param
  try {
    loading.value = true
    const result = await fetchRequestedAndEvents(
      univentStore.currentPage,
      univentStore.activeFilters,
    )

    filter.value = await filterUpcomingEventOnlyAndInterested(result.events)
    univentStore.pageCount = result.pagesNo
  } catch (err) {
    console.error('pagination error:', err)
  } finally {
    loading.value = false
  }
}
function backToDiscoverPage() {
  router.replace({ query: {} })
}
watch(
  () => univentStore.currentPage,
  (newVal) => {
    router.replace({
      query: {
        ...route.query,
        page: newVal,
      },
    })
    console.log(newVal)
  },
)
</script>
<template>
  <div>
    <div class="">
      <EventSearchHeader
        header="Discover Events on Campus"
        title="Find the best happenings on campus – from academic workshops to social hangouts."
        @filter-changed="handleFilters"
      />
      <div class="no-result" v-if="noEvent">
        <img src="/no-result.png" alt="" />
      </div>
      <div class="skeleton" v-if="loading">
        <SkeletonLoader v-for="i in 3" :key="i" />
      </div>
      <button class="" v-if="route.query.eventId" @click="backToDiscoverPage">
        ← Back to all Event
      </button>
      <div class="" v-if="unavailableEvent">Event currently unavailable</div>
      <div class="events-section" v-if="!loading">
        <EventsCard :events="route.query.eventId ? searchFromId : filter" />
      </div>
      <div class="" v-if="emptyEvent">Sorry no event</div>
      <div class="pagination" v-if="univentStore.pageCount > 1 && !route.query.eventId">
        <h3>Page {{ univentStore.currentPage }} of {{ univentStore.pageCount }}</h3>
        <div class="buttons">
          <button
            v-for="i in univentStore.pageCount"
            :key="i"
            @click="pagination(i)"
            :class="{ activeFilter: univentStore.currentPage == i }"
          >
            {{ i }}
          </button>
        </div>

        <div class="go-to-page">
          <p>Go to page</p>
          <select
            name="page"
            id="page"
            @change="pagination($event.target.value)"
            v-model="univentStore.currentPage"
          >
            <option v-for="i in univentStore.pageCount" :value="i" :key="i">
              {{ i }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-end;
  max-width: 95%;
  width: 100%;
  /* margin: 30px auto; */
}
.pagination h3 {
  font-size: 14px;
  font-weight: 600;
  color: rgba(31, 31, 31, 1);
}
.pagination .buttons {
  display: flex;
  gap: 4px;
}
.go-to-page {
  display: flex;
  gap: 14px;
  align-items: center;
  color: #aaa;
  font-size: 14px;
}
.pagination button {
  height: 100%;
  background-color: transparent;
  color: #aaa;
  font-size: 14px;
  padding: 8px;
  border: none;
}
.pagination .activeFilter {
  border: 1px solid #1969fe;
  color: #1f1f1f;
  border-radius: 6px;
}
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
