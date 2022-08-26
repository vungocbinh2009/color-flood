import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import WelcomeScreen from "../components/WelcomeScreen.vue"
import ModeSelectionScreen from "../components/ModeSelectionScreen.vue"
import OnePlayerScreen from "src/components/oneplayer/OnePlayerScreen.vue"
import TwoPlayerScreen from "src/components/twoplayer/TwoPlayerScreen.vue"

const routes: RouteRecordRaw[]  = [
    { path: '/', component: WelcomeScreen},
    { path: '/mode', component: ModeSelectionScreen },
    {
        path: '/mode/oneplayer',
        component: OnePlayerScreen,
    },
    {
        path: '/mode/twoplayer',
        component: TwoPlayerScreen
    }
]

export const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
})