<template>
    <div class="parent">
        <va-card color="#ff0000">
            <h1 class="player-score display-1 text--center">{{props.playerRedScore}}</h1>
        </va-card>
        <va-card color="#000000">
            <va-card-content class="row justify--center">
                <va-button v-for="(color, i) in usedColorMap" 
                :color="color" :key="i" :disabled="!buttonEnableState[i]"
                    @click="onColorButtonClicked(color)">
                    <font-awesome-icon v-show="!buttonEnableState[i]" icon="fa-solid fa-ban" />
                </va-button>
            </va-card-content>
        </va-card>
        <va-card color="#0000ff">
            <h1 class="player-score display-1 text--center">{{props.playerBlueScore}}</h1>
        </va-card>
    </div>
</template>

<script setup lang="ts">
import { VaCard, VaCardContent, VaButton, VaNavbar, VaNavbarItem } from 'vuestic-ui';
import { computed } from 'vue';
import { colorMap } from "src/plugin/constant"
import { botPickNumber, botBanNumber } from "src/core/bot"
import { GameResult, PickColorPhase } from 'src/core/util';
import { emit } from 'process';

let props = defineProps<{
    numberOfColors: number,
    boardSize: number,
    playWithComputer: boolean,
    playerRedScore: number,
    playerBlueScore: number,
    boardCurrentState: number[][],
    pickColorPhase: PickColorPhase
}>()

let emits = defineEmits<{
    (e: 'pickColor', color: string): void
}>()

let usedColorMap = computed(() => {
    return colorMap.slice(0, props.numberOfColors)
})

let spaceChar = " "

let isRedTurn = computed((): boolean => {
    return props.pickColorPhase == PickColorPhase.RED_PLAYER_PICK
})

let isGameFinished = computed((): boolean => {
    return props.playerRedScore + props.playerBlueScore == props.boardSize * props.boardSize
})

let winningTeam = computed((): GameResult => {
    let value: GameResult = GameResult.DRAW
    if (isGameFinished) {
        if (props.playerRedScore > props.playerBlueScore) {
            value = GameResult.RED_PLAYER_WIN
        } else if (props.playerRedScore < props.playerBlueScore) {
            value = GameResult.BLUE_PLAYER_WIN
        } else {
            value = GameResult.DRAW
        }
    }
    return value
})

let getRedCurrentNumber = computed((): number => {
    return props.boardCurrentState[0][0]
})

let getBlueCurrentNumber = computed((): number => {
    return props.boardCurrentState[props.boardSize - 1][props.boardSize - 1]
})

let playerTurnMessage = computed(() => {
    if (isGameFinished) {
        if (winningTeam.value === GameResult.RED_PLAYER_WIN) {
            return "Red player won"
        } else if (winningTeam.value === GameResult.BLUE_PLAYER_WIN) {
            return "Blue player won"
        } else {
            return "Draw"
        }
    }

    if (props.pickColorPhase == PickColorPhase.RED_PLAYER_PICK) {
        return "Red player pick"
    } else {
        return "Blue player pick"
    }
})

// false là tắt button, true là bật button
let buttonEnableState = computed(() => {
    let state = Array<boolean>(props.numberOfColors)
    for (let i = 0; i < props.numberOfColors; i++) {
        if (isGameFinished) {
            state[i] = false
        } else if (i == getBlueCurrentNumber.value || i == getRedCurrentNumber.value) {
            state[i] = false
        } else {
            state[i] = true
        }
    }
    return state
})

let onColorButtonClicked = (color: string) => {
    emits("pickColor", color)
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
}
</style>