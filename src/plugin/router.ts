import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import WelcomeScreen from "../components/WelcomeScreen.vue"
import ModeSelectionScreen from "../components/ModeSelectionScreen.vue"
import GameScreen from "../components/GameScreen.vue"
const routes: RouteRecordRaw[]  = [
    { path: '/', component: WelcomeScreen},
    { path: '/mode', component: ModeSelectionScreen },
    {
        path: '/gamescreen',
        component: GameScreen,
    }
]

export const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
})