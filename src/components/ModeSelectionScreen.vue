<template>
    <div class="game-mode">
        <h2 class="display-2">All game mode:</h2>
        <va-button-toggle toggle-color="black" class="row justify--center" v-model="gameMode"
            :options="gameModeSelection" />
    </div>

    <div class="game-setting">
        <h2 class="display-2">Board size</h2>
        <va-button-toggle toggle-color="black" class="row justify--center" v-model="gameStore.boardSize"
            :options="boardSizeSelection" />

        <h2 class="display-2">Number of colors</h2>
        <va-button-toggle toggle-color="black" class="row justify--center" v-model="gameStore.numberOfColors"
            :options="numberOfColorSelection" />

        <div>
            <va-button class="play-button" @click="startGame()">Play game</va-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VaButtonToggle, VaButton } from 'vuestic-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../plugin/pinia';

let gameModeSelection = [
    { label: "One player", value: 1 },
    { label: "Play with computer", value: 2 },
    { label: "Two players", value: 3 }
]

let gameMode = ref(1)

let boardSizeSelection = [
    { label: "15x15", value: 15 },
    { label: "19x19", value: 19 },
    { label: "21x21", value: 21 },
    { label: "25x25", value: 25 }
]

let numberOfColorSelection = [
    { label: "4 colors", value: 4 },
    { label: "6 colors", value: 6 },
    { label: "8 colors", value: 8 },
]

let router = useRouter()

let gameStore = useGameStore()

let startGame = () => {
    let routeMap: Record<number, string> = {
        1: "/mode/oneplayer",
        2: "/mode/twoplayer",
        3: "/mode/twoplayer"
    }
    // reset một số chỉ số.
    gameStore.$patch({
        playerRedScore: 1,
        playerBlueScore: 1,
        boardCurrentState: [[1, 2], [3, 4]],
    })
    if (gameMode.value == 2) {
        gameStore.playWithComputer = true
    }
    gameStore.initBoard()
    router.push(routeMap[gameMode.value])
}
</script>

<style scoped>
.container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
        "game-mode game-mode game-mode"
        "game-setting game-setting game-setting"
        "game-setting game-setting game-setting"
        "game-setting game-setting game-setting"
        "game-setting game-setting game-setting"
        "game-setting game-setting game-setting";
}

.game-mode {
    grid-area: game-mode;
    text-align: center;
}

.game-setting {
    grid-area: game-setting;
    text-align: center;
}

.play-button {
    margin: 20px;
}
</style>