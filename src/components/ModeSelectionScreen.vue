<template>
    <div class="game-mode">
        <h2 class="display-2">All game mode:</h2>
        <va-button-toggle toggle-color="black" class="row justify--center" v-model="gameMode"
            :options="gameModeSelection" />
    </div>

    <div class="game-setting">
        <h2 class="display-2">Board size</h2>
        <va-button-toggle toggle-color="black" class="row justify--center" v-model="gameSettingStore.boardSize"
            :options="boardSizeSelection" />

        <h2 class="display-2">Number of colors</h2>
        <va-button-toggle toggle-color="black" class="row justify--center" v-model="gameSettingStore.numberOfColor"
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
import { useGameSettingStore } from 'src/plugin/pinia';

let gameSettingStore = useGameSettingStore()

enum GameMode {
    ONE_PLAYER = 1,
    PLAY_WITH_COMPUTER = 2,
    TWO_PLAYER = 3
}

let gameModeSelection = [
    { label: "One player", value: GameMode.ONE_PLAYER },
    { label: "Play with computer", value: GameMode.PLAY_WITH_COMPUTER },
    { label: "Two players", value: GameMode.TWO_PLAYER }
]

let gameMode = ref(GameMode.ONE_PLAYER)

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

let startGame = () => {
    let setupGameRecord: Record<GameMode, () => void> = {
        [GameMode.ONE_PLAYER]: () => {
            router.push("/mode/oneplayer")
        },
        [GameMode.PLAY_WITH_COMPUTER]: () => {
            gameSettingStore.playWithComputer = true
            router.push("/mode/twoplayer")
        },
        [GameMode.TWO_PLAYER]: () => {
            gameSettingStore.playWithComputer = false
            router.push("/mode/twoplayer")
        }
    }
    setupGameRecord[gameMode.value]()
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