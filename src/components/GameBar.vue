<template>
    <div class="parent">
        <va-card class="player-score" color="#ff0000">
            <h1 class="text-score">{{props.playerScore[0]}}</h1>
        </va-card>
        <va-card color="#000000">
            <va-card-content class="center-toggle">
                <va-button v-for="(color, i) in usedColorMap" 
                :color="color" :key="i" :disabled="!buttonEnableState[i]"
                    @click="onColorButtonClicked(i)">
                    <font-awesome-icon v-show="!buttonEnableState[i]" icon="fa-solid fa-ban" />
                </va-button>
            </va-card-content>
        </va-card>
        <va-card class="player-score" color="#0000ff" v-show="gameStore.numPlayer === 2">
            <h1 class="text-score">{{props.playerScore[1]}}</h1>
        </va-card>
    </div>
</template>

<script setup lang="ts">
import { VaCard, VaCardContent, VaButton, VaNavbar, VaNavbarItem } from 'vuestic-ui';
import { computed } from 'vue';
import { colorMap } from "src/core/colorBoardManager"
import { useGameStore } from 'src/plugin/pinia';

let gameStore = useGameStore()

let props = defineProps<{
    playerColor: number[]
    playerScore: number[]
    isGameFinished: boolean
}>()

let emits = defineEmits<{
    (e: "player-move", newColor: number): void
}>()

let usedColorMap = computed(() => {
    return colorMap.slice(0, gameStore.numColor)
})

// false là tắt button, true là bật button
let buttonEnableState = computed(() => {
    let state = Array<boolean>(gameStore.numColor)
    let playerColor = props.playerColor
    for (let i = 0; i < gameStore.numColor; i++) {
        if (props.isGameFinished) {
            console.log("Game finished")
            state[i] = false
        } else if (playerColor.includes(i)) {
            console.log(`Turn off button ${i}`)
            state[i] = false
        } else {
            state[i] = true
        }
    }
    return state
})

let onColorButtonClicked = (color: number) => {
    emits("player-move", color)
}
</script>

<style scoped>
.parent {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
}

.player-score {
    color: white;
    text-align: center;
    justify-content: center;
}

.text-score {
    font-size: 50px;
}

.center-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>