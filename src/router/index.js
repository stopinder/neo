// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import Quiz from '../components/Quiz.vue'
import FullReport from '../components/FullReport.vue'

const routes = [
    { path: '/', name: 'Home', component: LandingPage },
    { path: '/quiz', name: 'Quiz', component: Quiz },
    { path: '/full-report', name: 'Report', component: FullReport },
]

const router = createRouter({
    history: createWebHashHistory(), // <- hash mode
    routes,
    scrollBehavior: () => ({ top: 0 }),
})

export default router
