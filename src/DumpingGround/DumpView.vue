<script setup>
import { onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useUserProfile } from '@/composables/useUserProfile'

const { loading, error, profile, fetchProfile } = useUserProfile()

const fetchSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error fetching session:', error.message)
    return null
  }
  console.log(data.session)
  return data.session
}

onMounted(async () => {
  const session = await fetchSession()
  if (session?.user) {
    const result = await fetchProfile(session.user.id)
    console.log(result)
  }
})
</script>

<template>
  <div>
    <h1>This is DiscoverView</h1>
    <p v-if="loading">Loading profile...</p>
    <p v-if="error">{{ error }}</p>
    <div v-if="profile">
      <p>{{ profile }}</p>
      <div class="profile">
        <img :src="profile.profile_pics" alt="" />
      </div>
    </div>
  </div>
</template>
<style>
.profile {
  width: 50px;
}
.profile img {
  width: 100%;
}
</style>
