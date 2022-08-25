<template>
    <div class="game-container">
        <ColorBoard class="color-board" />
        <va-navbar color="#7e06ae" class="game-bar">
            <template #left>
                Scores: {{gameStore.playerRedScore}}
            </template>

            <template #center>
                <va-navbar-item>
                    <va-button v-for="(color, i) in usedColorMap" :color="color" :key="i" @click="updateBoard(color)"
                        :disabled="!buttonEnableState[i]">
                        <font-awesome-icon v-show="!buttonEnableState[i]" icon="fa-solid fa-ban" />
                    </va-button>
                </va-navbar-item>
            </template>

            <template #right>
                Moves: {{moves}}
            </template>
        </va-navbar>
    </div>
</template>

<script setup lang="ts">
import { VaCard, VaButton, VaNavbar, VaNavbarItem } from 'vuestic-ui';
import { computed, onMounted, ref } from 'vue';
import { colorMap } from "../plugin/constant"
import ColorBoard from "../components/ColorBoard.vue"
import { useGameStore } from '../plugin/pinia';

let gameStore = useGameStore()
let moves = ref(1)

onMounted(() => {
    gameStore.$reset
    gameStore.initBoard()
})

let spaceChar = " "

let usedColorMap = computed(() => {
    return colorMap.slice(0, gameStore.numberOfColors)
})

let buttonEnableState = computed(() => {
    let state = Array<boolean>(gameStore.numberOfColors)
    for (let i = 0; i < gameStore.numberOfColors; i++) {
        if (gameStore.playerRedScore === gameStore.boardSize * gameStore.boardSize
            || gameStore.getRedCurrentNumber === i) {
            state[i] = false
        } else {
            state[i] = true
        }
    }
    return state
})

let updateBoard = (color: string) => {
    moves.value++
    let index = colorMap.indexOf(color)
    gameStore.updateBoardAndScore(index)
}
</script>
<style scoped>
.game-container {
    display: grid;
    grid-template-columns: 1fr 90vh 1fr;
    grid-template-rows: 90vh 1fr;
    grid-template-areas:
        ". color-board ."
        "game-bar game-bar game-bar";
}

.color-board {
    grid-area: color-board;
}

.game-bar {
    grid-area: game-bar;
}
</style>