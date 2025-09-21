<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
import { useUniventStore } from '@/stores/counter'
const showCategoryFilter = computed(() => {
  return route.path === '/interested' || route.path === '/discover'
})

defineProps({
  title: {
    type: String,
  },
  header: {
    type: String,
  },
  content: {
    type: String,
  },
})
import FiltersIcon from './icons/FiltersIcon.vue'
import SortIcon from './icons/SortIcon.vue'
import Search2Icon from './icons/Search2Icon.vue'
import CategoryIcon from './icons/CategoryIcon.vue'
import DropdownIcon from './icons/DropdownIcon.vue'
import ResetFilter from './icons/ResetFilter.vue'
import { watch } from 'vue'
// import DateRange from './icons/Daterange.vue'
import DateRange from './icons/DateRange.vue'
import LocationIcon from './icons/LocationIcon.vue'
import OrganizersIcon from './icons/OrganizersIcon.vue'
import PriceIcon from './icons/PriceIcon.vue'
import { computed, ref } from 'vue'
const univentStore = useUniventStore()
let date = ref(null)
function handleDateChange(e) {
  filterObject.value.date = e.target.value
}

const filterObject = ref({
  searchInput: '',
  category: [],
  location: [],
  organizers: [],
  date: '',
  price: '',
})

function resetFilter() {
  filterObject.value.searchInput = ''
  filterObject.value.category = []
  filterObject.value.location = []
  filterObject.value.organizers = []
  filterObject.value.date = ''
  filterObject.value.price = ''
  date.value = ''
}

function pickDateOrPrice(name = '', value = '') {
  filterObject.value[name] = value
  date.value = ''
}
const emit = defineEmits(['filter-changed', 'search-performed'])
function showFilterDropdown(param) {
  if (param == 'date') {
    univentStore.dateDropdown = !univentStore.dateDropdown
    univentStore.categoryDropdown = false
    univentStore.locationDropdown = false
    univentStore.organizerDropdown = false
    univentStore.priceDropdown = false
  }
  if (param == 'category') {
    univentStore.dateDropdown = false
    univentStore.categoryDropdown = !univentStore.categoryDropdown
    univentStore.locationDropdown = false
    univentStore.organizerDropdown = false
    univentStore.priceDropdown = false
  }
  if (param == 'location') {
    univentStore.dateDropdown = false
    univentStore.categoryDropdown = false
    univentStore.locationDropdown = !univentStore.locationDropdown
    univentStore.organizerDropdown = false
    univentStore.priceDropdown = false
  }
  if (param == 'organizer') {
    univentStore.dateDropdown = false
    univentStore.categoryDropdown = false
    univentStore.locationDropdown = false
    univentStore.organizerDropdown = !univentStore.organizerDropdown
    univentStore.priceDropdown = false
  }
  if (param == 'price') {
    univentStore.dateDropdown = false
    univentStore.categoryDropdown = false
    univentStore.locationDropdown = false
    univentStore.organizerDropdown = false
    univentStore.priceDropdown = !univentStore.priceDropdown
  }
}
watch(
  filterObject,
  (newVal) => {
    emit('filter-changed', newVal)
  },
  { deep: true },
)
</script>
<template>
  <div class="">
    <div class="wrapper">
      <div class="hero-section">
        <div class="title">
          <h2>{{ header }}</h2>
          <p>{{ title }}</p>
        </div>
        <div class="search-section">
          <input
            type="text"
            v-model="filterObject.searchInput"
            @input="emit('search-performed')"
            placeholder="Search events by keyword, organizer, or venue..."
          />
          <button class="">Search <Search2Icon /></button>
        </div>
      </div>
    </div>
    <div v-if="showCategoryFilter" class="category-filter">
      <div class="">
        <button class=""><FiltersIcon /> Filter</button>
        <button class="">
          <SortIcon /> Sort by
          <div class="">
            <select id="category" name="category">
              <option value="">All Categories</option>
              <option value="music">Academic</option>
              <option value="tech">Upcoming</option>
            </select>
          </div>
        </button>
      </div>
      <div class="filters-btn">
        <div class="category" @click="showFilterDropdown('category')">
          <div class="">
            <span><CategoryIcon /></span>
            <p>Category</p>
            <span><DropdownIcon /></span>
          </div>
          <ul class="categoryDropdown" v-if="univentStore.categoryDropdown" @click.stop>
            <li>
              <label for="tech">Tech & Innovation</label
              ><input
                type="checkbox"
                name="tech"
                id="tech"
                value="Tech"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="social">Social Gatherings</label
              ><input
                type="checkbox"
                name="social"
                id="social"
                value="Social"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="academic">Academic Workshops</label
              ><input
                type="checkbox"
                name="academic"
                id="academic"
                value="Academic"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="sport">Sports Events</label
              ><input
                type="checkbox"
                name="sport"
                id="sport"
                value="Sport"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="cultural">Cultural Activities</label
              ><input
                type="checkbox"
                name="cultural"
                id="cultural"
                value="Cultural"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="tech">Clubs & Organizations</label
              ><input
                type="checkbox"
                name="organization"
                id="organization"
                value="Organization"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="career">Career Fairs</label
              ><input
                type="checkbox"
                name="career"
                id="career"
                value="Career"
                v-model="filterObject.category"
              />
            </li>
            <li>
              <label for="others">Others</label
              ><input
                type="checkbox"
                name="others"
                id="others"
                value="Others"
                v-model="filterObject.category"
              />
            </li>
          </ul>
        </div>
        <div class="category" @click="showFilterDropdown('date')">
          <div class="">
            <span><DateRange /></span>
            <p>Date Range</p>
            <span><DropdownIcon /></span>
          </div>
          <ul v-if="univentStore.dateDropdown" @click.stop>
            <li @click="pickDateOrPrice('date', 'today')">
              Today <span v-if="filterObject.date === 'today'">✓</span>
            </li>
            <li @click="pickDateOrPrice('date', 'this week')">
              This Week <span v-if="filterObject.date === 'this week'">✓</span>
            </li>
            <li @click="pickDateOrPrice('date', 'this month')">
              This Month <span v-if="filterObject.date === 'this month'">✓</span>
            </li>
            <li>Choose a date <input type="date" v-model="date" @change="handleDateChange" /></li>
            <!-- <li>Choose a date <input type="date" v-model="filterObject.date" /></li> -->
          </ul>
        </div>
        <div class="category" @click="showFilterDropdown('location')">
          <div class="">
            <span><LocationIcon /></span>
            <p>Location</p>
            <span><DropdownIcon /></span>
          </div>
          <ul v-if="univentStore.locationDropdown" @click.stop>
            <li>
              <label for="main">Main Campus</label
              ><input
                type="checkbox"
                name="main"
                id="main"
                value="main campus"
                v-model="filterObject.location"
              />
            </li>
            <li>
              <label for="auditorium">Auditorium</label
              ><input
                type="checkbox"
                name="auditorium"
                id="auditorium"
                value="auditorium"
                v-model="filterObject.location"
              />
            </li>
            <li>
              <label for="library">Library</label
              ><input
                type="checkbox"
                name="library"
                id="library"
                value="library"
                v-model="filterObject.location"
              />
            </li>
            <li>
              <label for="stadium">Stadium</label
              ><input
                type="checkbox"
                name="stadium"
                id="stadium"
                value="stadium"
                v-model="filterObject.location"
              />
            </li>
            <li>
              <label for="others">Others</label
              ><input
                type="checkbox"
                name="others"
                id="others"
                value="others"
                v-model="filterObject.location"
              />
            </li>
          </ul>
        </div>
        <div class="category" @click="showFilterDropdown('organizer')">
          <div class="">
            <span><OrganizersIcon /></span>
            <p>Organizers</p>
            <span><DropdownIcon /></span>
          </div>
          <!-- <ul v-if="univentStore.organizerDropdown">
            <li>Tech</li>
            <li>Academic</li>
            <li>Cultural</li>
          </ul> -->
        </div>
        <div class="category" @click="showFilterDropdown('price')">
          <div class="">
            <span><PriceIcon /></span>
            <p>Price</p>
            <span><DropdownIcon /></span>
          </div>
          <ul v-if="univentStore.priceDropdown">
            <li @click="pickDateOrPrice('price', 'below 2000')">
              Below N2000 <span v-if="filterObject.price === 'below 2000'">✓</span>
            </li>
            <li @click="pickDateOrPrice('price', 'between 2000 and 5000')">
              Between N2000 - N5000
              <span v-if="filterObject.price === 'between 2000 and 5000'">✓</span>
            </li>
            <li @click="pickDateOrPrice('price', 'above 5000')">
              Above N5000 <span v-if="filterObject.price === 'above 5000'">✓</span>
            </li>
          </ul>
        </div>
        <div class="reset-filter">
          <div class="" @click="resetFilter">
            <span><ResetFilter /></span>
            <p>Reset Filter</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h2,
p {
  margin: 0;
}
.hero-section {
  max-width: 90%;
  width: 100%;
  margin: 0px auto;
  padding: 64px 0;
}
.wrapper {
  background: url('/discorver-hero.webp') no-repeat center/cover;
  z-index: 10;
}
.title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px 0 32px;
}
.title h2 {
  font-weight: 700;
  font-size: 57px;
  line-height: 120%;
  text-align: center;
  color: #fff;
}
.title p {
  color: #fff;
  font-weight: 600;
  font-size: 19px;
  line-height: 120%;
  text-align: center;
}
.search-section {
  max-width: 654px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-section input {
  font-family: pp editorial new;
  font-style: italic;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 20px;
  outline: none;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(
        90.28deg,
        rgba(251, 55, 255, 0.466667) 0%,
        rgba(155, 111, 238, 0.7) 34.49%,
        #7b7fea 66.97%,
        #fb37ff 99.96%
      )
      border-box;
  padding: 16px 20px;
  border-radius: 8px;
  background-color: #f4f4f4;
  font-size: 20px;
}
.search-section button {
  background-color: #055dfa;
  color: #fff;
  font-size: 19px;
  padding: 16px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.category {
  position: relative;
}
.category-filter {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 34px 0;
}
.category-filter > div {
  display: flex;
  justify-content: center;
  gap: 16px;
}
select {
  /* padding: 8px 10px; */
  font-size: 19px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  color: #000;
  outline: none;
}
option {
  background-color: #fff;
}
option:hover {
  background-color: #f4f4f4;
}
.category-filter button {
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  display: flex;
  font-size: 19px;
  color: #aaaaaa;
  font-weight: 600;
  font-family: 'Geist', sans-serif;
  align-items: center;
  padding: 8px;
  gap: 4px;
}
.category > div,
.reset-filter > div {
  position: relative;
  display: flex;
  background-color: #f4f4f4;
  padding: 10px 8px;
  align-items: center;
  border-radius: 8px;
  gap: 4px;
  font-size: 19px;
  font-weight: 600;
  border: 1px solid #eaeaea;
  cursor: pointer;
}
.category ul {
  position: absolute;
  width: 233px;
}
.category span,
.reset-filter span {
  display: flex;
  align-items: center;
}
.reset-filter > div {
  background-color: #000;
}
.reset-filter > div p {
  color: #fff;
}
ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  background-color: #fff;
  border: 1px solid #eaeaea;
  padding: 4px;
  margin-top: 5px;
  border-radius: 8px;
}
ul li {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #5a5a5a;
  display: flex;
  justify-content: space-between;
}
ul li:hover {
  background-color: #f4f4f4;
}
</style>
