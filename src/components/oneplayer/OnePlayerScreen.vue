<template>
    <div class="game-container">
        <ColorBoard class="color-board" :boardSize="boardSize" :boardCurrentState="boardCurrentState.value" />
        <va-navbar color="#7e06ae" class="game-bar">
            <template #left>
                Scores: {{ playerScore }}
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
                Moves: {{ moves }}
            </template>
        </va-navbar>
    </div>
</template>

<script setup lang="ts">
import { VaCard, VaButton, VaNavbar, VaNavbarItem } from 'vuestic-ui';
import { computed, onMounted, reactive, ref } from 'vue';
import { colorMap } from "src/plugin/constant"
import ColorBoard from "./ColorBoard.vue"
import random from "random"
import { calculateScore, floodFill } from 'src/core/floodFill';
import { useModeStore } from 'src/plugin/pinia';

let modeStore = useModeStore()

let boardSize = modeStore.boardSize
let numberOfColors = modeStore.numberOfColor
let moves = ref(1)
let playerScore = ref(1)
let boardCurrentState = reactive({value: [[1, 2], [3, 4]]})

onMounted(() => {
    initBoard()
})

let spaceChar = " "

let usedColorMap = computed(() => {
    return colorMap.slice(0, numberOfColors)
})

let buttonEnableState = computed(() => {
    let state = Array<boolean>(numberOfColors)
    for (let i = 0; i < numberOfColors; i++) {
        if (playerScore.value === boardSize * boardSize || getRedCurrentNumber.value === i) {
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
    updateBoardAndScore(index)
}

let getRedCurrentNumber = computed((): number => {
    return boardCurrentState.value[0][0]
})

let initBoard = () => {
    let boardState: number[][] = []
    for (let i: number = 0; i < boardSize; i++) {
        boardState[i] = []
        for (let j: number = 0; j < boardSize; j++) {
            boardState[i][j] = random.int(0, numberOfColors - 1)
        }
    }
    boardCurrentState.value = reactive(boardState)
}

let updateBoardAndScore = (newNumber: number) => {
    boardCurrentState.value = floodFill(
        boardCurrentState.value,
        boardSize, boardSize,
        0, 0,
        getRedCurrentNumber.value, newNumber
    )
    playerScore.value = calculateScore(
        boardCurrentState.value,
        boardSize, boardSize,
        0, 0,
        newNumber
    )
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