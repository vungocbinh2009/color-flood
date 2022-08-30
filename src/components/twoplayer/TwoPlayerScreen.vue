<template>
    <div class="game-container">
        <ColorBoard class="color-board" 
        :boardSize="boardSize" 
        :boardCurrentState="boardCurrentState.value"/>
        <GameBar class="game-bar" 
        :currentRedNumber="getRedCurrentNumber"
        :currentBlueNumber="getBlueCurrentNumber"
        :isGameFinished="isGameFinished"
        :isRedTurn="isRedTurn"
        :numberOfColors="numberOfColors"
        :playerRedScore="playerRedScore"
        :playerBlueScore="playerBlueScore"
        @pickColor="pickColor" />
    </div>

</template>

<script setup lang="ts">
import random from 'random';
import { botPickNumber } from 'src/core/bot';
import { calculateScore, floodFill } from 'src/core/floodFill';
import { PickColorPhase } from 'src/core/util';
import { colorMap } from 'src/plugin/constant';
import { useGameSettingStore } from 'src/plugin/pinia';
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import ColorBoard from "./ColorBoard.vue"
import GameBar from './GameBar.vue';

let gameSettingStore = useGameSettingStore()

let boardSize = gameSettingStore.boardSize
let numberOfColors = gameSettingStore.numberOfColor
let playWithComputer = gameSettingStore.playWithComputer
let playerRedScore = ref(1)
let playerBlueScore = ref(1)
let boardCurrentState = reactive({ value: [[1, 2], [3, 4]] })
let pickColorPhase = ref(PickColorPhase.RED_PLAYER_PICK)

onBeforeMount(() => {
    initBoard()
})

let isRedTurn = computed((): boolean => {
    return pickColorPhase.value == PickColorPhase.RED_PLAYER_PICK
})

let isGameFinished = computed((): boolean => {
    return playerRedScore.value + playerBlueScore.value == boardSize * boardSize
})

let getRedCurrentNumber = computed((): number => {
    return boardCurrentState.value[0][0]
})

let getBlueCurrentNumber = computed((): number => {
    return boardCurrentState.value[boardSize - 1][boardSize - 1]
})

let initBoard = () => {
    let boardState: number[][] = []
    for (let i: number = 0; i < boardSize; i++) {
        boardState[i] = []
        for (let j: number = 0; j < boardSize; j++) {
            boardState[i][j] = random.int(0, numberOfColors - 1)
        }
    }
    boardCurrentState.value = boardState
}

let pickColor = (color: string) => {
    let newNumber = colorMap.indexOf(color)
    if (isRedTurn.value) {
        updateBoardAndScore(newNumber)
        pickColorPhase.value = PickColorPhase.BLUE_PLAYER_PICK
        if (playWithComputer) {
            let compNumber = botPickNumber(boardCurrentState.value, numberOfColors)
            updateBoardAndScore(compNumber)
        }
        pickColorPhase.value = PickColorPhase.RED_PLAYER_PICK
    } else {
        updateBoardAndScore(newNumber)
        pickColorPhase.value = PickColorPhase.RED_PLAYER_PICK
    }
}

let updateBoardAndScore = (newNumber: number) => {
    if (isRedTurn.value) {
        boardCurrentState.value = floodFill(
            boardCurrentState.value,
            boardSize, boardSize,
            0, 0,
            getRedCurrentNumber.value, newNumber
        )
        playerRedScore.value = calculateScore(
            boardCurrentState.value,
            boardSize, boardSize,
            0, 0,
            newNumber
        )
    } else {
        boardCurrentState.value = floodFill(
            boardCurrentState.value,
            boardSize, boardSize,
            boardSize - 1, boardSize - 1,
            getBlueCurrentNumber.value, newNumber
        )
        playerBlueScore.value = calculateScore(
            boardCurrentState.value,
            boardSize, boardSize,
            boardSize - 1, boardSize - 1,
            newNumber
        )
    }
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