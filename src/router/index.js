import { createRouter, createWebHistory } from 'vue-router'

// Component imports
import LandingPage from '../components/LandingPage.vue'
import Quiz from '../components/Quiz.vue'
import FullReport from '../components/FullReport.vue'

// Optional: a lightweight 404 page if you have one
// import NotFound from '../components/NotFound.vue'

const routes = [
    { path: '/', name: 'Home', component: LandingPage },
    { path: '/quiz', name: 'Quiz', component: Quiz },
    { path: '/full-report', name: 'Report', component: FullReport },

    // Catch-all (optional)
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }) // optional: reset scroll on route change
})

export default router
