import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import Quiz from '../components/Quiz.vue'

const routes = [
    { path: '/', component: LandingPage },
    { path: '/quiz', component: Quiz },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
