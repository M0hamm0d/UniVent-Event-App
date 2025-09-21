import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '@/supabase'

export function useInterestedEvents(toast) {
  const interest = ref([])
  let subscription = null

  const active = ref('upcoming')

  const filteredEvents = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return interest.value
      .map((i) => ({ ...i.events, interested_id: i.id }))
      .filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        if (active.value === 'upcoming') return eventDate >= today
        if (active.value === 'past') {
          return eventDate < today
        }
        return true
      })
  })
  const int = ref([])
  const loading = ref(false)
  const perPage = ref(1)
  async function fetchInterest(page = 1) {
    const from = (page - 1) * perPage.value //0*2, 1*2
    const to = from + perPage.value //0+2, 2+2
    loading.value = true
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        int.value = []
        return
      }
      let today = new Date().toISOString()
      let query = supabase
        .from('interested_events')
        .select('id, event_id, events!inner(*)', { count: 'exact' })
        .eq('user_id', user.id)
      if (active.value === 'upcoming') {
        query = query.gte('events.date', today)
      }
      if (active.value === 'past') {
        query = query.lt('events.date', today)
      }
      const { data, error, count } = await query
      const totalPageNo = Math.ceil(count / perPage.value)
      if (!error) {
        return {
          success: true,
          events: data.slice(from, to),
          count: count,
          pageSum: totalPageNo,
        }
      } else {
        throw error
      }
    } catch (error) {
      console.error('error in interested event', error)
    } finally {
      loading.value = false
    }
  }
  watch(
    active,
    async () => {
      loading.value = true
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          int.value = []
          return
        }
        let today = new Date().toISOString()
        let query = supabase
          .from('interested_events')
          .select('id, event_id, events!inner(*)')
          .eq('user_id', user.id)
        if (active.value === 'upcoming') {
          query = query.gte('events.date', today)
        }
        if (active.value === 'past') {
          query = query.lt('events.date', today)
        }
        const { data, error } = await query
        if (!error) {
          int.value = data
        } else {
          throw error
        }
      } catch (error) {
        console.error('error in interested event', error)
      } finally {
        loading.value = false
      }
    },
    { immediate: true },
  )

  async function fetchInterestedEvents() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      interest.value = []
      return
    }

    const { data, error } = await supabase
      .from('interested_events')
      .select('id, event_id, events(*)')
      .eq('user_id', user.id)

    if (!error) {
      interest.value = data
      console.log('data', filteredEvents.value)
    } else {
      console.error(error)
    }
  }

  async function deleteInterest(event) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) return

    const { data: existing, error: checkError } = await supabase
      .from('interested_events')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_id', event.id)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      toast.error(checkError.message)
      return
    }

    if (existing) {
      const { error: deleteError } = await supabase
        .from('interested_events')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        toast.error(deleteError.message)
        return
      }
      toast.success('Removed from interested')
    }
  }

  onMounted(async () => {
    await fetchInterestedEvents()

    subscription = supabase
      .channel('interested-events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'interested_events' },
        (payload) => {
          if (payload.eventType === 'INSERT') fetchInterestedEvents()
          if (payload.eventType === 'DELETE') {
            interest.value = interest.value.filter((i) => i.id !== payload.old.id)
          }
        },
      )
      .subscribe()
  })

  onUnmounted(() => {
    if (subscription) supabase.removeChannel(subscription)
  })

  return {
    active,
    int,
    loading,
    interest,
    filteredEvents,
    fetchInterest,
    fetchInterestedEvents,
    deleteInterest,
  }
}
