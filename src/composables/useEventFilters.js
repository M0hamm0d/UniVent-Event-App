import { ref } from 'vue'
import { supabase } from '@/supabase'
// import { modalStore } from '@/stores/counter'

export function useEventFilters() {
  // const store = modalStore()
  const loading = ref(false)
  const noEvent = ref(false)
  const filter = ref([])
  const debounceTimer = ref(null)

  async function filterUpcomingEventOnlyAndInterested(param) {
    loading.value = true
    let today = new Date()
    today.setHours(0, 0, 0, 0)

    // let sessionData = store.session || (await store.fetchSession())
    // store.session = sessionData
    //
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error fetching session:', error.message)
      return null
    }
    let sessionData = data.session
    //

    if (!sessionData) {
      return param
        .map((e) => ({ ...e, is_interest: false }))
        .filter((e) => new Date(e.date).setHours(0, 0, 0, 0) >= today)
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      console.error('Error getting user:', userError)
      return param
        .map((e) => ({ ...e, is_interest: false }))
        .filter((e) => new Date(e.date).setHours(0, 0, 0, 0) >= today)
    }

    const { data: interested_events, error: interestedError } = await supabase
      .from('interested_events')
      .select('event_id')
      .eq('user_id', userData.user.id)

    if (interestedError) {
      console.error('Error fetching interested events:', interestedError)
      return []
    }

    const interestedId = new Set(interested_events.map((e) => e.event_id))

    return param
      .map((e) => ({
        ...e,
        is_interest: interestedId.has(e.id),
      }))
      .filter((e) => new Date(e.date).setHours(0, 0, 0, 0) >= today)
  }

  async function handleFilters(filters) {
    const { data: events, error: event_error } = await supabase.from('events').select('*')
    if (event_error) {
      console.error('Error during filter:', event_error.message)
      return null
    }
    let eventsArray = events
    let upcomingEventArray = await filterUpcomingEventOnlyAndInterested(eventsArray)
    loading.value = true

    if (filters.searchInput) {
      if (debounceTimer.value) clearTimeout(debounceTimer.value)
      debounceTimer.value = setTimeout(() => {
        const query = filters.searchInput.toLowerCase().trim()
        const results = upcomingEventArray.filter((e) =>
          e.event_title.toLowerCase().includes(query),
        )
        filter.value = results
        loading.value = false
        noEvent.value = results.length === 0
      }, 500)
      return
    }

    if (!filters.price && !filters.location && !filters.category) {
      filter.value = [...upcomingEventArray]
      noEvent.value = filter.value.length === 0
      loading.value = false
      return
    }

    try {
      filter.value = upcomingEventArray.filter((event) => {
        let match = true
        let categories = Array.isArray(event.category)
          ? event.category.map((c) => c.toLowerCase())
          : [String(event.category || '').toLowerCase()]

        if (filters.category?.length) {
          match = match && filters.category.some((cat) => categories.includes(cat.toLowerCase()))
        }

        if (filters.location?.length) {
          match =
            match &&
            filters.location.some((loc) => event.location.toLowerCase().includes(loc.toLowerCase()))
        }

        if (filters.price) {
          match = match && event.price <= filters.price
        }

        return match
      })
    } catch (err) {
      console.error('Error filtering events:', err)
      filter.value = []
    } finally {
      noEvent.value = filter.value.length === 0
      loading.value = false
    }
  }

  return {
    filter,
    loading,
    noEvent,
    handleFilters,
    filterUpcomingEventOnlyAndInterested,
  }
}
