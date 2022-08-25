import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import WelcomeScreen from "../components/WelcomeScreen.vue"
import ModeSelectionScreen from "../components/ModeSelectionScreen.vue"
import OnePlayerScreen from "../components/OnePlayerScreen.vue"
import TwoPlayerScreen from "../components/TwoPlayerScreen.vue"

const routes: RouteRecordRaw[]  = [
    { path: '/', component: WelcomeScreen},
    { path: '/mode', component: ModeSelectionScreen },
    { path: '/mode/oneplayer', component: OnePlayerScreen},
    { path: '/mode/twoplayer', component: TwoPlayerScreen}
]

export const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
})