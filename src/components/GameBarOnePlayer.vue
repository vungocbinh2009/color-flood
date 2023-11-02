<template>
    <div class="parent">
        <va-card square class="player-score" :color="colorMap[props.playerColor[0]]">
            <h1 class="text-score">{{props.playerScore[0]}}</h1>
        </va-card>
        <va-card square color="#000000">
            <va-card-content class="center-toggle">
                <va-button v-for="(color, i) in usedColorMap" 
                :color="color" :key="i" :disabled="!buttonEnableState[i]"
                    @click="onColorButtonClicked(i)">
                    <font-awesome-icon v-show="!buttonEnableState[i]" icon="fa-solid fa-ban" />
                </va-button>
            </va-card-content>
        </va-card>
        <va-card square class="player-score" :color="colorMap[props.playerColor[0]]">
            <h1 class="text-stats">Moves: {{ playerTotalMove }}</h1>
            <h1 class="text-stats">Avg per move: {{ avgScorePerMove }}</h1>
        </va-card>
    </div>    
</template>

<script setup lang="ts">
import { VaCard, VaCardContent, VaButton } from 'vuestic-ui';
import { computed, ref } from 'vue';
import { colorMap } from "src/core/colorBoardManager"
import { useGameStore } from 'src/plugin/pinia';

let gameStore = useGameStore()

let props = defineProps<{
    playerColor: number[]
    playerScore: number[]
    numPlayerCell: number[]
    numPlayerBonusCell: number[]
    isGameFinished: boolean
}>()

let playerTotalMove = ref(0)

let avgScorePerMove = computed(() => {
    let value = 0
    if(playerTotalMove.value === 0) {
        value = 0
    } else {
        value = props.playerScore[0] / playerTotalMove.value
    }
    return value.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2 
    })
})

let emits = defineEmits<{
    (e: "player-move", newColor: number): void
}>()

let usedColorMap = computed(() => {
    return colorMap.slice(0, gameStore.numColor)
})

// false là tắt button, true là bật button
let buttonEnableState = computed(() => {
    let state = Array<boolean>(gameStore.numColor)
    let playerColor = props.playerColor[0]
    for (let i = 0; i < gameStore.numColor; i++) {
        if (props.isGameFinished) {
            console.log("Game finished")
            state[i] = false
        } else if (i === playerColor) {
            console.log(`Turn off button ${i}`)
            state[i] = false
        } else {
            state[i] = true
        }
    }
    return state
})

let onColorButtonClicked = (color: number) => {
    playerTotalMove.value++
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

.text-stats {
    font-size: 25px;
}

.center-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>