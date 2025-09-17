import { supabase } from '@/supabase'

export const useRequestedEvents = () => {
  const fetchRequestedAndEvents = async () => {
    try {
      const { data: requested_event, error } = await supabase.from('requested-event').select('*')
      const { data: events, error: event_error } = await supabase.from('events').select('*')

      if (error || event_error) {
        throw error || event_error
      }

      return {
        success: true,
        requested_event: requested_event || [],
        events: events || [],
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const pushToEvents = async (requestData) => {
    try {
      const { data: selectedEvent, error } = await supabase
        .from('events')
        .insert([requestData])
        .select()

      if (error) throw error

      if (selectedEvent.length > 0) {
        const { error: deleteError } = await supabase
          .from('requested-event')
          .delete()
          .eq('id', requestData.id)

        if (deleteError) throw deleteError

        return { success: true, data: selectedEvent }
      } else {
        return { success: false, error: 'Insert failed, no event returned' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { fetchRequestedAndEvents, pushToEvents }
}
