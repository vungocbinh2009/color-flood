<template>
    <div class="game-container">
        <ColorBoard class="color-board"
        :color-board="gameManager.colorBoard.gameBoard.value"
        />
        <GameBarTwoPlayer class="game-bar" v-if="gameStore.numPlayer === 2"
        :player-stat="gameManager.gameStat.playerStatList.value"
        :is-game-finished="gameManager.isGameFinished.value"
        @player-move="playerMove"
        />

        <GameBarOnePlayer class="game-bar" v-if="gameStore.numPlayer === 1"
        :player-stat="gameManager.gameStat.playerStatList.value"
        :is-game-finished="gameManager.isGameFinished.value"
        @player-move="playerMove"
        />
    </div>

</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import ColorBoard from "./ColorBoard.vue"
import GameBarOnePlayer from './GameBarOnePlayer.vue';
import GameBarTwoPlayer from './GameBarTwoPlayer.vue';
import { useGameStore } from "src/plugin/pinia";
import { onBeforeMount } from "vue";
import { useGameManager } from "src/core/gameManager";

let gameStore = useGameStore()

let gameManager = useGameManager({
    boardSize: gameStore.boardSize,
    numColor: gameStore.numColor,
    playerList: gameStore.playerList,
    randomObstacle: gameStore.randomObstacle,
    bonusScore: gameStore.bonusScore
})

let playerMove = (newColor: number) => {
    gameManager.playerMove(newColor)

    if(gameStore.playWithComputer) {
        let computerChoice = gameManager.colorBoard.bestPickNumber()
        gameManager.playerMove(computerChoice)
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
    height: calc(100vh - 80px);
    overflow: scroll;
}

.game-bar {
    grid-area: game-bar;
}
</style>