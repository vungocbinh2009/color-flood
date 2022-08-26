<template>
    <div class="game-container">
        <ColorBoard class="color-board" 
        :boardSize="boardSize" 
        :boardCurrentState="boardCurrentState"/>
        <GameBar class="game-bar" 
        :boardSize="boardSize"
        :boardCurrentState="boardCurrentState"
        :numberOfColors="numberOfColors"
        :pickColorPhase="pickColorPhase"
        :playerBlueScore="playerBlueScore"
        :playerRedScore="playerRedScore"
        :playWithComputer="playWithComputer"
        @pickColor="updateBoardAndScore" />
    </div>

</template>

<script setup lang="ts">
import random from 'random';
import { calculateScore, floodFill } from 'src/core/floodFill';
import { GameResult, PickColorPhase } from 'src/core/util';
import { colorMap } from 'src/plugin/constant';
import { computed, onMounted } from 'vue';
import ColorBoard from "./ColorBoard.vue"
import GameBar from './GameBar.vue';

let boardSize = 15
let numberOfColors = 6
let playWithComputer = false
let bannedNumber = -1
let playerRedScore = 1
let playerBlueScore = 1
let boardCurrentState = [[1, 2], [3, 4]]
let pickColorPhase = PickColorPhase.RED_PLAYER_PICK

onMounted(() => {
    initBoard()
})

let isRedTurn = computed((): boolean => {
    return pickColorPhase == PickColorPhase.RED_PLAYER_PICK
})

let isGameFinished = computed((): boolean => {
    return playerRedScore + playerBlueScore == boardSize * boardSize
})

let winningTeam = computed((): GameResult => {
    let value: GameResult = GameResult.DRAW
    if (isGameFinished) {
        if (playerRedScore > playerBlueScore) {
            value = GameResult.RED_PLAYER_WIN
        } else if (playerRedScore < playerBlueScore) {
            value = GameResult.BLUE_PLAYER_WIN
        } else {
            value = GameResult.DRAW
        }
    }
    return value
})

let getRedCurrentNumber = computed((): number => {
    return boardCurrentState[0][0]
})

let getBlueCurrentNumber = computed((): number => {
    return boardCurrentState[boardSize - 1][boardSize - 1]
})

let initBoard = () => {
    let boardState: number[][] = []
    for (let i: number = 0; i < boardSize; i++) {
        boardState[i] = []
        for (let j: number = 0; j < boardSize; j++) {
            boardState[i][j] = random.int(0, numberOfColors - 1)
        }
    }
    boardCurrentState = boardState
}

let updateBoardAndScore = (color: string) => {
    let newNumber = colorMap.indexOf(color)
    if (isRedTurn) {
        boardCurrentState = floodFill(
            boardCurrentState,
            boardSize, boardSize,
            0, 0,
            getRedCurrentNumber.value, newNumber
        )
        playerRedScore = calculateScore(
            boardCurrentState,
            boardSize, boardSize,
            0, 0,
            newNumber
        )

        pickColorPhase = PickColorPhase.BLUE_PLAYER_PICK
    } else {
        boardCurrentState = floodFill(
            boardCurrentState,
            boardSize, boardSize,
            boardSize - 1, boardSize - 1,
            getBlueCurrentNumber.value, newNumber
        )
        playerBlueScore = calculateScore(
            boardCurrentState,
            boardSize, boardSize,
            boardSize - 1, boardSize - 1,
            newNumber
        )

        pickColorPhase = PickColorPhase.RED_PLAYER_PICK
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