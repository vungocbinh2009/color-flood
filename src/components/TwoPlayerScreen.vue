<template>
    <div class="game-container">
        <ColorBoard class="color-board" />
        <GameBar class="game-bar"/>
    </div>

</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ColorBoard from "../components/ColorBoard.vue"
import { useGameStore } from '../plugin/pinia';
import GameBar from './GameBar.vue';

let gameStore = useGameStore()

onMounted(() => {
    gameStore.$reset
    gameStore.initBoard()
})
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