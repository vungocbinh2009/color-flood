<template>
    <div class="game-container">
        <ColorBoard class="color-board"
        :color-board="gameManager.colorBoard.gameBoard.value"
        />
        <GameBar class="game-bar"
        :player-color="gameManager.playerColor.value"
        :player-score="gameManager.playerScore.value"
        :is-game-finished="gameManager.isGameFinished.value"
        @player-move="playerMove"
        />
    </div>

</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import ColorBoard from "./ColorBoard.vue"
import GameBar from './GameBar.vue';
import { useGameStore } from "src/plugin/pinia";
import { onBeforeMount } from "vue";
import { useGameManager } from "src/core/gameManager";

let gameStore = useGameStore()

let gameManager = useGameManager(
    gameStore.boardSize,
    gameStore.numColor,
    gameStore.playerList,
)

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
}

.game-bar {
    grid-area: game-bar;
}
</style>