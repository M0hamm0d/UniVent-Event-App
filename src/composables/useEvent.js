import { supabase } from '@/supabase'

export const useEvents = () => {
  const uploadFile = async (file, currentFileName) => {
    try {
      if (currentFileName) {
        const { error: deleteError } = await supabase.storage
          .from('event-fliers')
          .remove([currentFileName])
        if (deleteError) {
          console.warn('Failed to delete old image:', deleteError.message)
        }
      }

      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('event-fliers')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('event-fliers')
        .getPublicUrl(fileName)
      if (urlError) throw urlError

      return {
        success: true,
        fileName,
        url: publicUrlData.publicUrl,
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || 'File upload failed',
      }
    }
  }

  const saveEvent = async (eventData) => {
    try {
      const { error } = await supabase.from('requested-event').insert([
        {
          event_title: eventData.title,
          description: eventData.description,
          category: eventData.categories,
          date: eventData.date,
          location: eventData.location,
          email: eventData.email,
          time: eventData.time,
          image_url: eventData.imageUrl,
          price: eventData.price,
          is_interested: eventData.isInterested,
          free_or_paid: eventData.isPaid,
          link_to_register: eventData.linkToRegister,
        },
      ])

      if (error) throw error

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Failed to save event',
      }
    }
  }

  return { uploadFile, saveEvent }
}
