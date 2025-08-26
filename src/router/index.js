import { createRouter, createWebHistory } from 'vue-router'

// Component imports
import LandingPage from '../components/LandingPage.vue'
import Quiz from '../components/Quiz.vue'
import PaymentPage from '../components/PaymentPage.vue'
import FullReport from '../components/FullReport.vue'

// Optional: a lightweight 404 page if you have one
// import NotFound from '../components/NotFound.vue'

const routes = [
    { path: '/', name: 'Home', component: LandingPage },
    { path: '/quiz', name: 'Quiz', component: Quiz },
    { path: '/payment', name: 'Payment', component: PaymentPage },

    // Protect this route
    { path: '/full-report', name: 'Report', component: FullReport, meta: { requiresAuth: true } },

    // Catch-all (optional)
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * Attempt to read auth state:
 * 1) If localStorage has a valid-looking user, trust it.
 * 2) Else, if Outseta is available, try to fetch current user and cache it.
 * 3) Otherwise, unauthenticated.
 */
async function isAuthenticated () {
    try {
        const cached = localStorage.getItem('user')
        if (cached) {
            // Basic sanity check: Outseta user objects generally have an 'Email' or 'Account' property
            const parsed = JSON.parse(cached)
            if (parsed && (parsed.Email || parsed.email || parsed.Account)) {
                return true
            }
        }

        // If Outseta is available, try fetching current user
        if (typeof window !== 'undefined' && window.Outseta && typeof window.Outseta.getCurrentUser === 'function') {
            const user = await window.Outseta.getCurrentUser().catch(() => null)
            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
                return true
            }
        }

        // Not authenticated
        return false
    } catch {
        return false
    }
}

/**
 * Router guard:
 * - If route requires auth and user is not authenticated:
 *   - Dispatch a window event so App.vue can open the login modal.
 *   - Redirect to /payment?next=<intended> as a fallback.
 */
router.beforeEach(async (to, from) => {
    if (to.meta?.requiresAuth) {
        const authed = await isAuthenticated()
        if (!authed) {
            // Signal app to open login modal (App.vue can listen for this)
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                window.dispatchEvent(
                    new CustomEvent('auth:need-login', { detail: { next: to.fullPath } })
                )
            }

            // Redirect to payment with a "next" param so we can return after login
            return {
                name: 'Payment',
                query: { next: to.fullPath }
            }
        }
    }

    // Otherwise, proceed
    return true
})

export default router
