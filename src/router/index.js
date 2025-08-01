import { createRouter, createWebHistory } from 'vue-router'

// Component imports
import LandingPage from '../components/LandingPage.vue'
import Quiz from '../components/Quiz.vue'
import SnippetPage from '../components/SnippetPage.vue'
import UpsellScreen from '../components/UpsellScreen.vue'
import PaymentPage from '../components/PaymentPage.vue'
import FullReport from '../components/FullReport.vue'

const routes = [
    { path: '/', name: 'Home', component: LandingPage },
    { path: '/quiz', name: 'Quiz', component: Quiz },
    { path: '/results-snippet', name: 'Snippet', component: SnippetPage },
    { path: '/payment', name: 'Payment', component: PaymentPage },
    { path: '/full-report', name: 'Report', component: FullReport }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
