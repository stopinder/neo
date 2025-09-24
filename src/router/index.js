// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router"
import LandingPage from "../components/LandingPage.vue"
import Quiz from "../components/Quiz.vue"
import FullReport from "../components/FullReport.vue"
import Ping from "../components/Ping.vue" // ✅ keep test route

const routes = [
    { path: "/", name: "Home", component: LandingPage },
    { path: "/quiz/:type", name: "Quiz", component: Quiz, props: true },
    { path: "/full-report", name: "Report", component: FullReport },
    { path: "/ping", name: "Ping", component: Ping },
]

const router = createRouter({
    history: createWebHashHistory(), // hash mode for Vercel
    routes,
    scrollBehavior: () => ({ top: 0 }),
})

export default router
