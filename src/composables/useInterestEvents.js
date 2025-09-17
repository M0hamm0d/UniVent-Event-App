import { ref, computed, onMounted, onUnmounted } from 'vue'
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
        if (active.value === 'past') return eventDate < today
        return true
      })
  })

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
    interest,
    filteredEvents,
    fetchInterestedEvents,
    deleteInterest,
  }
}
