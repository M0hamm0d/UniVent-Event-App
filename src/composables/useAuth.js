// composables/useAuth.js
import { supabase } from '@/supabase'
import { useUniventStore } from '@/stores/counter'

export function useAuth(toast) {
  const uniVentStore = useUniventStore()

  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        toast?.error(error ? error.message : 'Login failed')
        return { success: false, error: error ? error.message : 'Login failed' }
      }

      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('id', data.user.id)
        .single()

      uniVentStore.isAuthenticated = true
      uniVentStore.userProfile = profile
      uniVentStore.imageUrl = profile?.profile_pics || null
      uniVentStore.loginModal = false

      toast?.success('Logged in successfully')

      return { success: true, user: data.user }
    } catch (err) {
      toast?.error('Something went wrong. Please try again.')
      return { success: false, error: err.message }
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      toast?.error('Sign out failed')
      return false
    }
    uniVentStore.$reset()
    toast?.success('Signed out successfully')
    uniVentStore.isAuthenticated = false
    return true
  }

  return { signIn, logout }
}
