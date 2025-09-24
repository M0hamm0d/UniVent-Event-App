<template>
  <div>
    <!-- Search input -->
    <input v-model="query" placeholder="Search" />

    <!-- Pagination buttons -->
    <button @click="prevPage" :disabled="page <= 1">Prev</button>
    <span>Page {{ page }}</span>
    <button @click="nextPage">Next</button>

    <!-- Show current shareable URL -->
    <p>Share this link:</p>
    <pre>{{ shareUrl }}</pre>
  </div>
</template>

<script setup>
// const route = useRoute()
// const inputValue = ref(route.query.q || '')
// function buildQuery() {
//   const q = {}
//   if (inputValue.value) q.q = inputValue.value
//   return q
// }
// function updateUrl() {
//   router.replace({ query: buildQuery() })
// }
// watch(inputValue, () => {
//   updateUrl()
// })
// watch(
//   () => route.query,
//   (newVal) => {
//     inputValue.value = newVal.q || ''
//   },
// )
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// access router and current route
const router = useRouter()
const route = useRoute()

// set initial values from URL
const query = ref(route.query.q || '')
const page = ref(Number(route.query.page) || 1)

// function to build URL query
function buildQuery() {
  const q = {}
  if (query.value) q.q = query.value
  if (page.value > 1) q.page = String(page.value)
  return q
}

// update URL without creating history entries
function updateUrl() {
  router.replace({ query: buildQuery() })
}

// watch for changes in state -> update URL
watch([query, page], () => {
  updateUrl()
})

// watch for changes in URL (back/forward) -> update state
watch(
  () => route.query,
  (newQ) => {
    query.value = newQ.q || ''
    page.value = Number(newQ.page) || 1
  },
)

// pagination helpers
function nextPage() {
  page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}

// shareable URL for copy
const shareUrl = computed(() => {
  const base = window.location.origin + window.location.pathname
  const params = new URLSearchParams(buildQuery()).toString()
  return params ? `${base}?${params}` : base
})
</script>
