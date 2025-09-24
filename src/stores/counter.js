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
  const currentPage = ref(1)
  const pageCount = ref(0)
  const interestCount = ref(1)
  const activeFilters = ref([])
  const interestFilters = ref({})

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
    pageCount,
    interestFilters,
    editModal,
    signupModal,
    interestCount,
    loginModal,
    activeFilters,
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
    currentPage,
    setEditModal,
    setChangePasswordModal,
    setMobileSideBar,
    $reset,
  }
})
