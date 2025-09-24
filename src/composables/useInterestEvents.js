import { ref } from 'vue'
import { supabase } from '@/supabase'

export function useInterestedEvents(toast) {
  const interest = ref([])
  const active = ref('upcoming')
  const int = ref([])
  const loading = ref(false)
  const perPage = ref(1)
  // const filtersArray = ref({})
  async function fetchInterest(page = 1, filters = {}) {
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
      let today = new Date().toISOString().split('T')[0]
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
      if (filters.date) {
        if (filters.date === 'today') {
          console.log('changed to today')
          query = query.eq('events.date', today)
        } else if (filters.date === 'this week') {
          const today = new Date()
          const weekFirstDay = new Date(today.setDate(today.getDate() - today.getDay()))
          const weekLastDay = new Date(weekFirstDay)
          weekLastDay.setDate(weekFirstDay.getDate() + 6)
          const formattedLastWeekDay = weekLastDay.toISOString().split('T')[0]
          const formattedFirstWeekDay = weekFirstDay.toISOString().split('T')[0]
          query = query
            .gte('events.date', formattedFirstWeekDay)
            .lte('events.date', formattedLastWeekDay)
        } else if (filters.date === 'this month') {
          const today = new Date()
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString()
            .split('T')[0]
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0]
          query = query.gte('events.date', firstDayOfMonth).lte('events.date', lastDayOfMonth)
        } else {
          query = query.eq('events.date', filters.date)
        }
      }
      if (filters.price == 'below 2000') {
        query = query.lt('events.price', 2000)
      }
      if (filters.price == 'between 2000 and 5000') {
        query = query.gte('events.price', 2000).lte('events.price', 5000)
      }
      if (filters.price == 'above 5000') {
        query = query.gt('events.price', 5000)
      }
      if (filters.category && filters.category.length > 0) {
        query = query.overlaps('events.category', filters.category)
      }
      if (filters.searchInput) {
        query = query.ilike('events.event_title', `%${filters.searchInput}%`)
      }
      const { data, error, count } = await query
      const totalPageNo = Math.ceil(count / perPage.value)
      if (!error) {
        return {
          success: true,
          events: data.slice(from, to),
          count: count,
          currentPage: page,
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

  return {
    active,
    int,
    loading,
    interest,
    fetchInterest,
    deleteInterest,
  }
}
