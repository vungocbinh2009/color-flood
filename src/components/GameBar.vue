<template>
    <div class="parent">
        <va-card color="#ff0000">
            <h1 class="player-score display-1 text--center">{{gameStore.playerRedScore}}</h1>
        </va-card>
        <va-card color="#000000">
            <va-card-content class="row justify--center">
                <va-button v-for="(color, i) in usedColorMap" 
                :color="color" :key="i" :disabled="!buttonEnableState[i-1]"
                    @click="onColorButtonClicked(color)">
                    <font-awesome-icon v-show="!buttonEnableState[i-1]" icon="fa-solid fa-ban" />
                </va-button>
            </va-card-content>
        </va-card>
        <va-card color="#0000ff">
            <h1 class="player-score display-1 text--center">{{gameStore.playerBlueScore}}</h1>
        </va-card>
    </div>
</template>

<script setup lang="ts">
import { VaCard, VaCardContent, VaButton, VaNavbar, VaNavbarItem } from 'vuestic-ui';
import { computed } from 'vue';
import { colorMap } from "../plugin/constant"
import { useGameStore, GameResult, PickColorPhrase } from '../plugin/pinia';
import { botPickNumber, botBanNumber } from "../core/bot"

let gameStore = useGameStore()

let usedColorMap = computed(() => {
    return colorMap.slice(0, gameStore.numberOfColors)
})

let spaceChar = " "

let playerTurnMessage = computed(() => {
    if (gameStore.isGameFinished) {
        if (gameStore.winningTeam === GameResult.RED_PLAYER_WIN) {
            return "Red player won"
        } else if (gameStore.winningTeam === GameResult.BLUE_PLAYER_WIN) {
            return "Blue player won"
        } else {
            return "Draw"
        }
    }

    if (gameStore.pickColorPhrase == PickColorPhrase.RED_PLAYER_PICK) {
        return "Red player pick"
    } else if (gameStore.pickColorPhrase == PickColorPhrase.RED_PLAYER_BAN) {
        return "Red player ban"
    } else if (gameStore.pickColorPhrase == PickColorPhrase.BLUE_PLAYER_PICK) {
        return "Blue player pick"
    } else {
        return "Blue player ban"
    }
})

// false là tắt button, true là bật button
let buttonEnableState = computed(() => {
    let state = Array<boolean>(gameStore.numberOfColors)
    for (let i = 0; i < gameStore.numberOfColors; i++) {
        if (gameStore.isGameFinished) {
            state[i] = false
        } else if (i == gameStore.getBlueCurrentNumber
            || i == gameStore.getRedCurrentNumber
            || i == gameStore.bannedNumber) {
            state[i] = false
        } else {
            state[i] = true
        }
    }
    return state
})

let onColorButtonClicked = (color: string) => {
    let pickColorActions: Record<PickColorPhrase, () => void> = {
        [PickColorPhrase.RED_PLAYER_PICK]: () => {
            pickColor(color)
            if (gameStore.allowBanColor) {
                gameStore.pickColorPhrase = PickColorPhrase.RED_PLAYER_BAN
            } else {
                if (gameStore.playWithComputer) {
                    gameStore.pickColorPhrase = PickColorPhrase.BLUE_PLAYER_PICK
                    computerPick()
                    gameStore.pickColorPhrase = PickColorPhrase.RED_PLAYER_PICK
                } else {
                    gameStore.pickColorPhrase = PickColorPhrase.BLUE_PLAYER_PICK
                }
            }
        },
        [PickColorPhrase.RED_PLAYER_BAN]: () => {
            banColor(color)
            if (gameStore.playWithComputer) {
                gameStore.pickColorPhrase = PickColorPhrase.BLUE_PLAYER_PICK
                computerPick()
                computerBan()
                gameStore.pickColorPhrase = PickColorPhrase.RED_PLAYER_PICK
            } else {
                gameStore.pickColorPhrase = PickColorPhrase.BLUE_PLAYER_PICK
            }
        },
        [PickColorPhrase.BLUE_PLAYER_PICK]: () => {
            pickColor(color)
            if (gameStore.allowBanColor) {
                gameStore.pickColorPhrase = PickColorPhrase.BLUE_PLAYER_BAN
            } else {
                gameStore.pickColorPhrase = PickColorPhrase.RED_PLAYER_PICK
            }
        },
        [PickColorPhrase.BLUE_PLAYER_BAN]: () => {
            banColor(color)
            gameStore.pickColorPhrase = PickColorPhrase.RED_PLAYER_PICK
        }
    }
    pickColorActions[gameStore.pickColorPhrase]()
}

let pickColor = (color: string) => {
    let index = colorMap.indexOf(color)
    gameStore.updateBoardAndScore(index)
}

let banColor = (color: string) => {
    let index = colorMap.indexOf(color)
    gameStore.bannedNumber = index
}

let computerPick = () => {
    let index = botPickNumber(
        gameStore.boardCurrentState,
        gameStore.numberOfColors,
        gameStore.bannedNumber
    )
    gameStore.updateBoardAndScore(index)
    gameStore.bannedNumber = -1
}

let computerBan = () => {
    let index = botBanNumber(
        gameStore.boardCurrentState,
        gameStore.numberOfColors,
        gameStore.bannedNumber
    )
    gameStore.bannedNumber = index
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