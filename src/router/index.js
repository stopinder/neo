import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'

const routes = [
    { path: '/', component: LandingPage },
    // We'll add /quiz later
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
