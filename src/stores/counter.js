import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUniventStore = defineStore('appStore', () => {
  const editModal = ref(false)
  const changePasswordModal = ref(false)
  const mobileSideBar = ref(false)
  const interestedEvents = ref([])
  const viewDetailsModal = ref(false)
  const isAuthenticated = ref(false)
  const dateDropdown = ref(false)
  const categoryDropdown = ref(false)
  const locationDropdown = ref(false)
  const organizerDropdown = ref(false)
  const priceDropdown = ref(false)
  const loginModal = ref(false)
  const signupModal = ref(false)
  const userProfile = ref(null)
  const imageUrl = ref(null)

  function setEditModal() {
    editModal.value = !editModal.value
  }
  function setMobileSideBar() {
    mobileSideBar.value = !mobileSideBar.value
  }
  function setChangePasswordModal() {
    changePasswordModal.value = !changePasswordModal.value
  }

  function $reset() {
    isAuthenticated.value = false
    userProfile.value = null
    imageUrl.value = null
    loginModal.value = false
  }

  return {
    editModal,
    signupModal,
    loginModal,
    isAuthenticated,
    changePasswordModal,
    dateDropdown,
    categoryDropdown,
    locationDropdown,
    organizerDropdown,
    priceDropdown,
    viewDetailsModal,
    interestedEvents,
    userProfile,
    imageUrl,
    mobileSideBar,
    setEditModal,
    setChangePasswordModal,
    setMobileSideBar,
    $reset,
  }
})
